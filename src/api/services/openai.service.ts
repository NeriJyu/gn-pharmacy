import { OpenAI } from "openai";
import { OpenAIEnum } from "../enums/openai.enum";
import { selectMedicinesInput } from "../../utils/openai.util";
import { I_PharmacyStock } from "../../interfaces/pharmacy.interfaces";
import { join } from "path";
import { tmpdir } from "os";
import { promises as fsp } from "fs";
import fs from "fs";
import GeoapifyService from "./geoapify.service";
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export default class OpenAIService {
  private geoapifyService = new GeoapifyService();

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async askChatGPT(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  }

  async generateSpeechFromText(text: string): Promise<string> {
    try {
      const response = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: "coral",
        input: text,
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      const key = `audios/${Date.now()}.mp3`;
      const bucketName = process.env.AWS_S3_BUCKET;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: "audio/mpeg",
        })
      );

      const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      setTimeout(() => {
        this.deleteAudio(key);
      }, 60000);

      return url;
    } catch (err) {
      throw err;
    }
  }

  async deleteAudio(key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        })
      );
      console.log(`Audio ${key} deleted from S3.`);
    } catch (err) {
      console.error(`Error deleting audio ${key}:`, err);
    }
  }

  async selectMedicinesByImage(
    imageBuffer: any,
    mimetype: string
  ): Promise<string[]> {
    const base64Image = `data:${mimetype};base64,${imageBuffer.toString(
      "base64"
    )}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: OpenAIEnum.INSTRUCTION_SELECT_MEDICINES_BY_IMAGE.toString(),
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: OpenAIEnum.CONTENT_SELECT_MEDICINES_BY_IMAGE.toString(),
            },
            { type: "image_url", image_url: { url: base64Image } },
          ],
        },
      ],
    });

    const userMessage = response.choices[0].message.content || "";

    const medicinesArray = await this.selectMedicinesByText(userMessage);

    return medicinesArray;
  }

  async selectMedicinesByAudio(audioBuffer: any): Promise<string[]> {
    const filePath = join(tmpdir(), `audio-${Date.now()}.wav`);
    await fsp.writeFile(filePath, audioBuffer);

    const response = await this.openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(filePath),
    });

    const medicinesArray = await this.selectMedicinesByText(response.text);

    return medicinesArray;
  }

  async selectMedicinesByText(message: string): Promise<string[]> {
    const response = await this.openai.responses.create({
      model: "gpt-4o",
      instructions: OpenAIEnum.INSTRUCTION_SELECT_MEDICINES.toString(),
      input: selectMedicinesInput(message),
      temperature: 0.5,
    });

    const medicinesArray = response.output_text
      .split(",")
      .map((name) => name.trim().replace(/\.$/, ""))
      .filter((name) => name.length > 0);

    return medicinesArray;
  }

  async selectMedicines(
    message: string,
    file?: Express.Multer.File
  ): Promise<string[]> {
    if (file?.mimetype.startsWith("image/"))
      return await this.selectMedicinesByImage(file.buffer, file.mimetype);

    if (file?.mimetype.startsWith("audio/"))
      return await this.selectMedicinesByAudio(file.buffer);

    return await this.selectMedicinesByText(message);
  }

  formatMedicinesWithPharmacies = (
    pharmacies: I_PharmacyStock[],
    medicines: string[],
    userLat: string,
    userLon: string
  ): string => {
    if (!pharmacies.length) {
      const formattedNames = medicines.join(", ");
      return `Nenhuma farmácia encontrada com os medicamentos: ${formattedNames}.`;
    }

    const grouped: Record<string, I_PharmacyStock[]> = {};
    pharmacies.forEach((pharmacy) => {
      if (!grouped[pharmacy.medicineName.toString()]) {
        grouped[pharmacy.medicineName.toString()] = [];
      }
      grouped[pharmacy.medicineName.toString()].push(pharmacy);
    });

    const lat1 = parseFloat(userLat);
    const lon1 = parseFloat(userLon);

    let result = "";
    for (const [medicineName, entries] of Object.entries(grouped)) {
      const entriesWithDistance = entries
        .map((pharmacy) => {
          const { lat, lon } = pharmacy.address;
          if (lat && lon) {
            const distanceKm = this.geoapifyService.calculateDistanceInKM(
              lat1,
              lon1,
              parseFloat(lat),
              parseFloat(lon)
            );
            return { ...pharmacy, distanceKm };
          }
          return { ...pharmacy, distanceKm: Infinity };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);

      result += `O remédio '${medicineName}' está disponível na(s) seguinte(s) farmácia(s):\n\n`;

      entriesWithDistance.forEach((pharmacy) => {
        const { pharmacyName, phone, address, price, quantity, distanceKm } =
          pharmacy;

        const { street, number, complement, neighborhood, city, state, cep } =
          address;

        const endereco = `${street}, ${number}${
          complement ? `, ${complement}` : ""
        } - ${neighborhood}, ${city} - ${state}, CEP: ${cep}`;

        const distanceInfo =
          distanceKm !== Infinity
            ? `🌍 Distância: ${distanceKm.toFixed(2)} km  \n`
            : "";

        result += `🏥 Nome: ${pharmacyName}  \n📍 Endereço: ${endereco}  \n📞 Telefone: ${phone}  \n💰 Preço: R$ ${price.toFixed(
          2
        )}  \n📦 Quantidade disponível: ${quantity}  \n${distanceInfo}\n`;
      });
    }

    return result.trim();
  };

  formatSimplifiedMedicineInfo = (
    pharmacies: I_PharmacyStock[],
    medicines: string[]
  ): string => {
    if (!pharmacies.length) {
      const formattedNames = medicines.join(", ");
      return `Não encontrei nenhuma farmácia com os medicamentos: ${formattedNames}.`;
    }

    const grouped: Record<string, string[]> = {};
    pharmacies.forEach((pharmacy) => {
      const medName = pharmacy.medicineName.toString();
      if (!grouped[medName]) {
        grouped[medName] = [];
      }
      if (!grouped[medName].includes(pharmacy.pharmacyName)) {
        grouped[medName].push(pharmacy.pharmacyName);
      }
    });

    let result = "";
    for (const [medicineName, pharmacyNames] of Object.entries(grouped)) {
      const pharmaciesStr = pharmacyNames.join(" e ");
      result += `Encontrei o ${medicineName} disponível na farmácia: ${pharmaciesStr}. `;
    }

    return result.trim();
  };

  validateRecommendateMedicine(message: any, file?: Express.Multer.File) {
    if (!message && !file)
      throw new Error("You need to send a text message or an audio/image");
  }
}

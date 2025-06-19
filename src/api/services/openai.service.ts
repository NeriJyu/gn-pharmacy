import { OpenAI } from "openai";
import { OpenAIEnum } from "../enums/openai.enum";
import { selectMedicinesInput } from "../../utils/openai.util";
import { I_PharmacyStock } from "../../interfaces/pharmacy.interfaces";
import { join } from "path";
import { tmpdir } from "os";
import { promises as fsp } from "fs";
import fs from "fs";

export default class OpenAIService {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async askChatGPT(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
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
    audio?: Buffer<ArrayBufferLike>
  ): Promise<string[]> {
    if (audio) return await this.selectMedicinesByAudio(audio);

    return await this.selectMedicinesByText(message);
  }

  formatMedicinesWithPharmacies = (
    pharmacies: I_PharmacyStock[],
    medicines: String[]
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

    let result = "";
    for (const [medicineName, entries] of Object.entries(grouped)) {
      result += `O remédio '${medicineName}' está disponível na(s) seguinte(s) farmácia(s):\n\n`;

      entries.forEach((pharmacy) => {
        const { pharmacyName, phone, address, price, quantity } = pharmacy;
        const { street, number, complement, neighborhood, city, state, cep } =
          address;

        const endereco = `${street}, ${number}${
          complement ? `, ${complement}` : ""
        } - ${neighborhood}, ${city} - ${state}, CEP: ${cep}`;

        result += `🏥 Nome: ${pharmacyName}  \n📍 Endereço: ${endereco}  \n📞 Telefone: ${phone}  \n💰 Preço: R$ ${price.toFixed(
          2
        )}  \n📦 Quantidade disponível: ${quantity}  \n\n`;
      });
    }

    return result.trim();
  };

  validateRecommendateMedicine(
    message: string,
    audioBuffer?: Buffer<ArrayBufferLike>
  ) {
    if (!message && !audioBuffer)
      throw new Error("You need to send a text message or an audio");
  }
}

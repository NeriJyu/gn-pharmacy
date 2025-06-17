import { OpenAI } from "openai";
import { OpenAIEnum } from "../enums/openai.enum";
import {
  recommendateMedicineInput,
  selectMedicinesInput,
} from "../../utils/openai.util";

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

  async recommendateMedicine(
    pharmacies: string,
    medicine: String[]
  ): Promise<string> {
    const response = await this.openai.responses.create({
      model: "gpt-4o",
      instructions: OpenAIEnum.INSTRUCTION_RECOMMENDATE_MEDICINE.toString(),
      input: recommendateMedicineInput(pharmacies, medicine),
      temperature: 0.5,
    });

    return response.output_text;
  }

  async selectMedicines(message: string): Promise<string[]> {
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
}

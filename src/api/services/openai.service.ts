import { OpenAI } from "openai";

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

    console.log("response: ", response);
    

    return response.choices[0].message.content || "";
  }

    async recommendateMedicine(message: string): Promise<string> {
        // Placeholder for future implementation
        return "This feature is not yet implemented.";
    }
}

import { Types } from "mongoose";
import { I_Medicine } from "../../interfaces/medicine.interfaces";
import MedicineRepository from "../repositories/medicine.repository";
import StockRepository from "../repositories/stock.repository";
import OpenAIService from "../services/openai.service";
import PharmacyRepository from "../repositories/pharmacy.repository";

export default class OpenAIController {
  private openaiService = new OpenAIService();
  private medicineRepository = new MedicineRepository();
  private stockRepository = new StockRepository();
  private pharmacyRepository = new PharmacyRepository();

  async askChatGPT(message: string): Promise<string> {
    console.log("message: ", message);

    const gptResponse = await this.openaiService.askChatGPT(message);

    return gptResponse;
  }

  async recommendateMedicine(message: string): Promise<string> {
    const medicine: I_Medicine | null =
      await this.medicineRepository.findByName(message);

    if (!medicine?._id) {
      return "Medicine has no ID";
    }

    const stocks = await this.stockRepository.findAvailableByMedicine(
      medicine._id
    );
    console.log("stocks: ", stocks);
    

    if (stocks.length === 0) {
      return "No stock found for this medicine";
    }

    const stockDetails = await Promise.all(
      stocks.map(async (stock) => {
        const pharmacy = await this.pharmacyRepository.findById(
          stock.pharmacyId
        );
        return {
          pharmacyName: pharmacy?.name || "Unknown Pharmacy",
          price: stock.price,
          quantity: stock.quantity,
        };
      })
    );

    console.log("stockDetails: ", stockDetails);

    return "as";
  }
}

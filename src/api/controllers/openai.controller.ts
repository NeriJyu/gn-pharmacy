import OpenAIService from "../services/openai.service";
import MedicineService from "../services/medicine.service";
import StockService from "../services/stock.service";
import PharmacyService from "../services/pharmacy.service";

export default class OpenAIController {
  private openaiService = new OpenAIService();
  private medicineService = new MedicineService();
  private stockService = new StockService();
  private pharmacyService = new PharmacyService();

  async askChatGPT(message: string): Promise<string> {
    const gptResponse = await this.openaiService.askChatGPT(message);

    return gptResponse;
  }

  async recommendateMedicine(
    message: string,
    file?: Express.Multer.File
  ): Promise<any> {
    this.openaiService.validateRecommendateMedicine(message, file);

    const validMedicines = await this.medicineService.validateMedicines(
      message,
      file
    );

    if (!validMedicines.isValid) return validMedicines.message!;

    const validMedicineNames = this.medicineService.validateMedicineName(
      validMedicines.medicines!
    );

    const validStockList = await this.stockService.validateStockList(
      validMedicines.medicines!
    );

    const formatedPharmacyDetails =
      await this.pharmacyService.formatPharmacyDetails(validStockList);

    const recommendateMedicine =
      this.openaiService.formatMedicinesWithPharmacies(
        formatedPharmacyDetails,
        validMedicineNames,
        "-23.555739297468357",
        "-46.690467698734174"
      );

    const formatSimplifiedMedicineInfo =
      this.openaiService.formatSimplifiedMedicineInfo(
        formatedPharmacyDetails,
        validMedicineNames
      );

    const audioUrl = await this.openaiService.generateSpeechFromText(
      formatSimplifiedMedicineInfo
    );

    return {
      recommendateMedicine,
      audio: audioUrl,
    };
  }
}

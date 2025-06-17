import { I_Medicine } from "../../interfaces/medicine.interfaces";
import MedicineRepository from "../repositories/medicine.repository";
import StockRepository from "../repositories/stock.repository";
import OpenAIService from "../services/openai.service";
import PharmacyRepository from "../repositories/pharmacy.repository";
import PharmacyService from "../services/pharmacy.service";

export default class OpenAIController {
  private openaiService = new OpenAIService();
  private pharmacyService = new PharmacyService();

  private medicineRepository = new MedicineRepository();
  private stockRepository = new StockRepository();
  private pharmacyRepository = new PharmacyRepository();

  async askChatGPT(message: string): Promise<string> {
    const gptResponse = await this.openaiService.askChatGPT(message);

    return gptResponse;
  }

  async recommendateMedicine(message: string): Promise<string> {
    const selectedMedicines = await this.openaiService.selectMedicines(message);

    const medicines = await Promise.all(
      selectedMedicines.map(async (medicineName) => {
        return await this.medicineRepository.findByName(medicineName);
      })
    );

    if (medicines.every((med) => med === null))
      return "No medicines found for the provided names";

    const validMedicines = medicines.filter(
      (medicine): medicine is I_Medicine => medicine?._id !== undefined
    );

    const validMedicineNames = validMedicines.map((med) => med.name);

    const stocks = await Promise.all(
      validMedicines.map(async (medicine) => {
        return await this.stockRepository.findAvailableByMedicine(medicine._id);
      })
    );

    if (stocks.length === 0) return "No stock found for this medicine";

    const flatStocks = stocks.flat();

    const pharmacyDetails = await Promise.all(
      flatStocks.map(async (stock) => {
        const pharmacy = await this.pharmacyRepository.findById(
          stock.pharmacyId
        );

        if (!pharmacy) throw new Error("Pharmacy not found");

        return {
          phone: pharmacy.phone,
          address: pharmacy.address,
          pharmacyName: pharmacy.name,
          medicineName: stock.medicineId.name,
          price: stock.price,
          quantity: stock.quantity,
        };
      })
    );

    const formattedPharmacies = this.pharmacyService.formatPharmacyListToString(
      pharmacyDetails,
      validMedicineNames
    );

    const recommendateMedicine = await this.openaiService.recommendateMedicine(
      formattedPharmacies,
      validMedicineNames
    );

    return recommendateMedicine;
  }
}

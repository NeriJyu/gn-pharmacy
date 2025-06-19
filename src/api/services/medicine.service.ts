import { I_Medicine } from "../../interfaces/medicine.interfaces";
import MedicineRepository from "../repositories/medicine.repository";
import OpenAIService from "./openai.service";

export default class MedicineService {
  private openaiService = new OpenAIService();

  private medicineRepository = new MedicineRepository();

  async validateMedicines(message: string, audio?: any): Promise<I_Medicine[]> {
    const selectedMedicines = await this.openaiService.selectMedicines(message, audio);

    const medicines = await Promise.all(
      selectedMedicines.map(async (medicineName) => {
        return await this.medicineRepository.findByName(medicineName);
      })
    );

    const validMedicines = medicines.filter(
      (med): med is I_Medicine => med !== null && med._id !== undefined
    );

    if (validMedicines.length === 0)
      throw new Error("No medicines found for the provided names");

    return validMedicines;
  }

  validateMedicineName(validMedicines: I_Medicine[]): string[]{
    return validMedicines.map((med) => med.name);
  }

}

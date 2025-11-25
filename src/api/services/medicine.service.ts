import { I_Medicine } from "../../interfaces/medicine.interfaces";
import MedicineRepository from "../repositories/medicine.repository";
import OpenAIService from "./openai.service";

export default class MedicineService {
  private openaiService = new OpenAIService();

  private medicineRepository = new MedicineRepository();

  async validateMedicines(
    message: any,
    fileBuffer?: any
  ): Promise<{ isValid: boolean; medicines?: I_Medicine[]; message?: string }> {
    const selectedMedicines = await this.openaiService.selectMedicines(
      message,
      fileBuffer
    );

    const medicines = await Promise.all(
      selectedMedicines.map(async (medicineName) => {
        return await this.medicineRepository.findByName(medicineName);
      })
    );

    const validMedicines = medicines
      .flat()
      .filter((med): med is I_Medicine => med !== null && med.id !== undefined);

    if (validMedicines.length === 0)
      return { isValid: false, message: "Medicamento(s) não encontrado(s)" };

    return { isValid: true, medicines: validMedicines };
  }

  validateMedicineName(validMedicines: I_Medicine[]): string[] {
    return validMedicines.map((med) => med.name);
  }
}

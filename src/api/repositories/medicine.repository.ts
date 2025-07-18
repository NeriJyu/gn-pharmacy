import { I_Medicine } from "../../interfaces/medicine.interfaces";
import MedicineModel from "../models/medicine.model";

export default class MedicineRepository {

  async create(medicine: Omit<I_Medicine, "id" | "createdAt" | "updatedAt">): Promise<I_Medicine> {
    const medicineToSave = {
      ...medicine,
      name: medicine.name.toLowerCase().trim(),
    };

    const newMedicine = await MedicineModel.create(medicineToSave);
    
    return newMedicine.toJSON() as I_Medicine;
  }

  async findById(id: string): Promise<I_Medicine | null> {
    const medicine = await MedicineModel.get(id);
    return medicine ? (medicine.toJSON() as I_Medicine) : null;
  }

  async findByName(name: string): Promise<I_Medicine | null> {
    const result = await MedicineModel.query("name").eq(name.toLowerCase().trim()).exec();

    return result.count > 0 && result[0] ? (result[0].toJSON() as I_Medicine) : null;
  }

  async findAll(): Promise<I_Medicine[]> {
    const results = await MedicineModel.scan().exec();
    return results.toJSON() as I_Medicine[];
  }

  async updateById(
    id: string,
    updateData: Partial<Omit<I_Medicine, "id">>
  ): Promise<I_Medicine | null> {
    await MedicineModel.update({ id }, updateData);
    return this.findById(id);
  }

  async deleteById(id: string): Promise<I_Medicine | null> {
    const medicineToDelete = await this.findById(id);
    if (!medicineToDelete) {
      return null;
    }
    await MedicineModel.delete(id);
    return medicineToDelete;
  }
}
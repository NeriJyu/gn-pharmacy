import { I_Medicine } from "../../interfaces/medicine.interfaces";
import Medicine from "../models/medicine.model";

export default class MedicineRepository {
  async create(medicine: I_Medicine): Promise<I_Medicine> {
    medicine.name = medicine.name.toLowerCase().trim();
    const newMedicine = new Medicine(medicine);
    return await newMedicine.save();
  }

  async findById(id: string): Promise<I_Medicine | null> {
    return await Medicine.findById(id).exec();
  }

  async findByName(name: string): Promise<I_Medicine | null> {
    return await Medicine.findOne({ name }).exec();
  }

  async findAll(): Promise<I_Medicine[]> {
    return await Medicine.find().exec();
  }

  async updateById(
    id: string,
    updateData: Partial<I_Medicine>
  ): Promise<I_Medicine | null> {
    return await Medicine.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();
  }

  async deleteById(id: string): Promise<I_Medicine | null> {
    return await Medicine.findByIdAndDelete(id).exec();
  }
}

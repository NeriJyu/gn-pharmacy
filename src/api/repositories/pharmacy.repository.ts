import { I_Pharmacy } from "../../interfaces/pharmacy.interfaces";
import PharmacyModel from "../models/pharmacy.model";

export default class PharmacyRepository {
  async create(pharmacy: Omit<I_Pharmacy, "id" | "createdAt" | "updatedAt">): Promise<I_Pharmacy> {
    const newPharmacy = await PharmacyModel.create(pharmacy);
    return newPharmacy.toJSON() as I_Pharmacy;
  }

  async findById(id: string): Promise<I_Pharmacy | null> {
    const pharmacy = await PharmacyModel.get(id);
    return pharmacy ? (pharmacy.toJSON() as I_Pharmacy) : null;
  }

  async findByName(name: string): Promise<I_Pharmacy | null> {
    const result = await PharmacyModel.query("name").eq(name).exec();
    return result.count > 0 && result[0] ? (result[0].toJSON() as I_Pharmacy) : null;
  }

  async findAll(): Promise<I_Pharmacy[]> {
    const results = await PharmacyModel.scan().exec();
    return results.toJSON() as I_Pharmacy[];
  }

  async updateById(id: string, updateData: Partial<Omit<I_Pharmacy, "id">>): Promise<I_Pharmacy | null> {
    await PharmacyModel.update({ id }, updateData);
    return this.findById(id);
  }

  async deleteById(id: string): Promise<I_Pharmacy | null> {
    const pharmacyToDelete = await this.findById(id);
    if (!pharmacyToDelete) {
      return null;
    }
    await PharmacyModel.delete(id);
    return pharmacyToDelete;
  }
}

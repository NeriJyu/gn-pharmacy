import { I_Pharmacy } from "../../interfaces/pharmacy.interfaces";
import Pharmacy from "../models/pharmacy.model";

export default class PharmacyRepository {
  async create(pharmacy: I_Pharmacy): Promise<I_Pharmacy> {
    const newPharmacy = new Pharmacy(pharmacy);
    return await newPharmacy.save();
  }

  async findById(id: string): Promise<I_Pharmacy | null> {
    return await Pharmacy.findById(id).exec();
  }

  async findByName(name: string): Promise<I_Pharmacy | null> {
    return await Pharmacy.findOne({ name }).exec();
  }

  async findAll(): Promise<I_Pharmacy[]> {
    return await Pharmacy.find().exec();
  }

  async updateById(
    id: string,
    updateData: Partial<I_Pharmacy>
  ): Promise<I_Pharmacy | null> {
    return await Pharmacy.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();
  }

  async deleteById(id: string): Promise<I_Pharmacy | null> {
    return await Pharmacy.findByIdAndDelete(id).exec();
  }
}

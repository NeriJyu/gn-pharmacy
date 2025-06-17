import { Types } from "mongoose";
import { I_Stock } from "../../interfaces/stock.interfaces";
import Stock from "../models/stock.model";

export default class StockRepository {
  async create(stock: I_Stock): Promise<I_Stock> {
    const newStock = new Stock(stock);
    return await newStock.save();
  }

  async findById(id: string): Promise<I_Stock | null> {
    return await Stock.findById(id)
      .populate("pharmacyId")
      .populate("medicineId")
      .exec();
  }

  async findByPharmacyAndMedicine(
    pharmacyId: string,
    medicineId: string
  ): Promise<I_Stock | null> {
    return await Stock.findOne({
      pharmacy: pharmacyId,
      medicine: medicineId,
    }).exec();
  }

  async findAll(): Promise<I_Stock[]> {
    return await Stock.find().populate("pharmacy").populate("medicine").exec();
  }

  async findAvailableByMedicine(medicineId: string | Types.ObjectId): Promise<I_Stock[]> {
    return await Stock.find({ medicineId })
      .populate("pharmacyId")
      .populate("medicineId")
      .exec();
  }

  async updateById(
    id: string,
    updateData: Partial<I_Stock>
  ): Promise<I_Stock | null> {
    return await Stock.findByIdAndUpdate(id, updateData, { new: true })
      .populate("pharmacyId")
      .populate("medicineId")
      .exec();
  }

  async deleteById(id: string): Promise<I_Stock | null> {
    return await Stock.findByIdAndDelete(id).exec();
  }
}

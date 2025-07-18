import { I_Stock } from "../../interfaces/stock.interfaces";
import StockModel from "../models/stock.model";

export default class StockRepository {
  async create(stock: I_Stock): Promise<I_Stock> {
    const newStock = await StockModel.create(stock);
    return newStock.toJSON() as I_Stock;
  }

  async findByPharmacyAndMedicine(
    pharmacyId: string,
    medicineId: string
  ): Promise<I_Stock | null> {
    const stock = await StockModel.get({ pharmacyId, medicineId });
    return stock ? (stock.toJSON() as I_Stock) : null;
  }

  async findAll(): Promise<I_Stock[]> {
    const results = await StockModel.scan().exec();
    return results.toJSON() as I_Stock[];
  }

  async findAvailableByMedicine(medicineId: string): Promise<I_Stock[]> {
    const results = await StockModel.query("medicineId").eq(medicineId).exec();
    return results.toJSON() as I_Stock[];
  }

  async updateByCompositeKey(
    pharmacyId: string,
    medicineId: string,
    updateData: Partial<I_Stock>
  ): Promise<I_Stock | null> {
    await StockModel.update({ pharmacyId, medicineId }, updateData);
    return this.findByPharmacyAndMedicine(pharmacyId, medicineId);
  }

  async deleteByCompositeKey(
    pharmacyId: string,
    medicineId: string
  ): Promise<I_Stock | null> {
    const stockToDelete = await this.findByPharmacyAndMedicine(
      pharmacyId,
      medicineId
    );
    if (!stockToDelete) {
      return null;
    }
    await StockModel.delete({ pharmacyId, medicineId });
    return stockToDelete;
  }
}
import { I_Stock } from "../../interfaces/stock.interfaces";
import StockModel from "../models/stock.model";
import MedicineRepository from "./medicine.repository";

export default class StockRepository {
  private medicineRepository = new MedicineRepository();

  async create(stock: I_Stock): Promise<I_Stock> {
    const medicine = await this.medicineRepository.findById(stock.medicineId);

    if (!medicine) throw new Error("Medicine not found");

    stock.medicineName = medicine?.name;

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

  async update(
    pharmacyId: string,
    medicineId: string,
    updateData: I_Stock
  ): Promise<I_Stock | null> {
    await StockModel.update({ pharmacyId, medicineId }, updateData);
    return this.findByPharmacyAndMedicine(pharmacyId, medicineId);
  }

  async delete(
    pharmacyId: string,
    medicineId: string
  ): Promise<{ message: string } | null> {
    const stockToDelete = await this.findByPharmacyAndMedicine(
      pharmacyId,
      medicineId
    );
    if (!stockToDelete) return null;

    await StockModel.delete({ pharmacyId, medicineId });

    return { message: "Stock successfuly deleted" };
  }
}

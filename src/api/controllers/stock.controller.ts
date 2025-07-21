import { I_Stock } from "../../interfaces/stock.interfaces";
import StockRepository from "../repositories/stock.repository";

export default class StockController {
  private stockRepository = new StockRepository();

  async create(stock: I_Stock): Promise<I_Stock> {
    return await this.stockRepository.create(stock);
  }

  async findByPharmacyAndMedicine(
    pharmacyId: string,
    medicineId: string
  ): Promise<I_Stock | null> {
    return await this.stockRepository.findByPharmacyAndMedicine(
      pharmacyId,
      medicineId
    );
  }

  async getAll(): Promise<I_Stock[]> {
    return await this.stockRepository.findAll();
  }

  async getByMedicine(medicineId: string): Promise<I_Stock[]> {
    return await this.stockRepository.findAvailableByMedicine(medicineId);
  }

  async update(
    pharmacyId: string,
    medicineId: string,
    data: I_Stock
  ): Promise<I_Stock> {
    const updated = await this.stockRepository.update(
      pharmacyId,
      medicineId,
      data
    );

    if (!updated) {
      throw new Error("Stock entry not found");
    }

    return updated;
  }

  async delete(
    pharmacyId: string,
    medicineId: string
  ): Promise<{ message: string }> {
    const deleted = await this.stockRepository.delete(pharmacyId, medicineId);

    if (!deleted) throw new Error("Stock entry not found");

    return { message: "Stock entry deleted successfully" };
  }
}

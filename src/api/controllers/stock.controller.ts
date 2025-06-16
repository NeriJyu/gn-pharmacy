import { I_Stock } from "../../interfaces/stock.interfaces";
import StockRepository from "../repositories/stock.repository";

export default class StockController {
  private stockRepository = new StockRepository();

  async create(stock: I_Stock): Promise<I_Stock> {
    return await this.stockRepository.create(stock);
  }

  async getById(id: string): Promise<I_Stock> {
    const stock = await this.stockRepository.findById(id);

    if (!stock) {
      throw new Error("Stock entry not found");
    }

    return stock;
  }

  async getAll(): Promise<I_Stock[]> {
    return await this.stockRepository.findAll();
  }

  async getByMedicine(medicineId: string): Promise<I_Stock[]> {
    return await this.stockRepository.findAvailableByMedicine(medicineId);
  }

  async update(id: string, data: I_Stock): Promise<I_Stock> {
    const updated = await this.stockRepository.updateById(id, data);

    if (!updated) {
      throw new Error("Stock entry not found");
    }

    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.stockRepository.deleteById(id);

    if (!deleted) {
      throw new Error("Stock entry not found");
    }

    return { message: "Stock entry deleted successfully" };
  }
}

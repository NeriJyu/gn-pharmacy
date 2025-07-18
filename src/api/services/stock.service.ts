import { I_Medicine } from "../../interfaces/medicine.interfaces";
import { I_Stock } from "../../interfaces/stock.interfaces";
import StockRepository from "../repositories/stock.repository";

export default class StockService {
  private stockRepository = new StockRepository();

  async validateStockList(validMedicines: I_Medicine[]): Promise<I_Stock[]> {
    const stocks = await Promise.all(
      validMedicines.map(async (medicine) => {
        return await this.stockRepository.findAvailableByMedicine(medicine.id);
      })
    );

    if (stocks.length === 0)
      throw new Error("No stock found for this medicine");

    return stocks.flat();
  }
}

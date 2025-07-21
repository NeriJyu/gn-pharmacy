import { I_Medicine } from "../../interfaces/medicine.interfaces";
import MedicineRepository from "../repositories/medicine.repository";
import GeoapifyService from "../services/geoapify.service";

export default class MedicineController {
  private medicineRepository = new MedicineRepository();
  private geoapifyService = new GeoapifyService();

  async create(medicine: I_Medicine): Promise<I_Medicine> {
    return await this.medicineRepository.create(medicine);
  }

  async getById(id: string): Promise<I_Medicine> {
    const medicine = await this.medicineRepository.findById(id);

    if (!medicine) {
      throw new Error("Medicine not found");
    }

    return medicine;
  }

  async getAll(): Promise<I_Medicine[]> {
    return await this.medicineRepository.findAll();
  }

  async update(id: string, data: I_Medicine): Promise<I_Medicine> {
    const updated = await this.medicineRepository.updateById(id, data);

    if (!updated) {
      throw new Error("Medicine not found");
    }

    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.medicineRepository.deleteById(id);

    if (!deleted) {
      throw new Error("Medicine not found");
    }

    return { message: "Medicine deleted successfully" };
  }
}

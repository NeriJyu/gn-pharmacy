import { I_Pharmacy } from "../../interfaces/pharmacy.interfaces";
import PharmacyRepository from "../repositories/pharmacy.repository";
import PharmacyService from "../services/pharmacy.service";

export default class PharmacyController {
  private pharmacyRepository = new PharmacyRepository();
  private pharmacyService = new PharmacyService();

  async create(pharmacy: I_Pharmacy): Promise<I_Pharmacy> {
    const geoapifyAddress = await this.pharmacyService.getPharmacyAddress(pharmacy.address);

    pharmacy.address = geoapifyAddress;

    return await this.pharmacyRepository.create(pharmacy);
  }

  async getById(id: string): Promise<I_Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findById(id);

    if (!pharmacy) {
      throw new Error("Pharmacy not found");
    }

    return pharmacy;
  }

  async getAll(): Promise<I_Pharmacy[]> {
    return await this.pharmacyRepository.findAll();
  }

  async update(id: string, data: I_Pharmacy): Promise<I_Pharmacy> {
    const updated = await this.pharmacyRepository.updateById(id, data);

    if (!updated) {
      throw new Error("Pharmacy not found");
    }

    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.pharmacyRepository.deleteById(id);

    if (!deleted) {
      throw new Error("Pharmacy not found");
    }

    return { message: "Pharmacy deleted successfully" };
  }
}

import {
  I_PharmacyAddress,
  I_PharmacyStock,
} from "../../interfaces/pharmacy.interfaces";
import { I_Stock } from "../../interfaces/stock.interfaces";
import PharmacyRepository from "../repositories/pharmacy.repository";
import GeoapifyService from "./geoapify.service";

export default class PharmacyService {
  private pharmacyRepository = new PharmacyRepository();

  private geoapifyService = new GeoapifyService();

  async getPharmacyAddress(address: I_PharmacyAddress): Promise<I_PharmacyAddress> {
    const geoapifyAddress = await this.geoapifyService.addressByCep(address);

    return geoapifyAddress;
  }

  // async formatPharmacyDetails(
  //   validStockList: I_Stock[]
  // ): Promise<I_PharmacyStock[]> {
  //   return await Promise.all(
  //     validStockList.map(async (stock) => {
  //       const pharmacy = await this.pharmacyRepository.findById(
  //         stock.pharmacyId.id!
  //       );

  //       if (!pharmacy) throw new Error("Pharmacy not found");

  //       return {
  //         phone: pharmacy.phone,
  //         address: pharmacy.address,
  //         pharmacyName: pharmacy.name,
  //         medicineName: stock.medicineId.name,
  //         price: stock.price,
  //         quantity: stock.quantity,
  //       };
  //     })
  //   );
  // }
}

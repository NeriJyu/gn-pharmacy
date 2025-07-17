import { I_Medicine } from "./medicine.interfaces";
import { I_Pharmacy } from "./pharmacy.interfaces";

export interface I_Stock {
  _id?: string;
  pharmacyId: I_Pharmacy;
  medicineId: I_Medicine;
  price: number;
  quantity: number;
}
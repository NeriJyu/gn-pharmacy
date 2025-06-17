import { I_Medicine } from "./medicine.interfaces";

export interface I_Stock {
  _id?: string;
  pharmacyId: string;
  medicineId: I_Medicine;
  price: Number;
  quantity: Number;
}
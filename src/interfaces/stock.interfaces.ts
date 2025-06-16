import { Types } from "mongoose";

export interface I_Stock {
  _id?: string;
  pharmacyId: string;
  medicineId: string;
  price: Number;
  quantity: Number;
}
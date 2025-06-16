import { Types } from "mongoose";

export interface I_Pharmacy {
  _id?: string;
  name: String;
  address: I_PharmacyAddress;
  phone: String;
}

export interface I_PharmacyAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

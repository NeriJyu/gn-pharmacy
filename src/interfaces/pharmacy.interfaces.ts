export interface I_PharmacyAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  lat: string;
  lon: string;
}

export interface I_Pharmacy {
  id: string;
  name: string;
  address: I_PharmacyAddress;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface I_PharmacyStock {
  phone: string;
  address: I_PharmacyAddress;
  medicineName: string;
  pharmacyName: string;
  price: number;
  quantity: number;
}
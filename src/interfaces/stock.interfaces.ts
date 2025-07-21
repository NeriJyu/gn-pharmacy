export interface I_Stock {
  pharmacyId: string;
  medicineId: string;
  medicineName: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

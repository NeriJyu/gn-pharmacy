import mongoose, { Schema } from "mongoose";
import {
  I_Pharmacy,
  I_PharmacyAddress,
} from "../../interfaces/pharmacy.interfaces";

const PharmacyAddressSchema = new Schema<I_PharmacyAddress>({
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  cep: { type: String, required: true },
});

const PharmacySchema = new Schema<I_Pharmacy>(
  {
    name: { type: String, required: true },
    address: { type: PharmacyAddressSchema, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
    toObject: {
      versionKey: false,
    },
  }
);

export default mongoose.model<I_Pharmacy>("Pharmacy", PharmacySchema);

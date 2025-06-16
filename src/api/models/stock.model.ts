import mongoose, { Schema } from "mongoose";
import { I_Stock } from "../../interfaces/stock.interfaces";

const StockSchema = new Schema<I_Stock>(
  {
    pharmacyId: { type: String, ref: "Pharmacy", required: true },
    medicineId: {type: String, ref: "Medicine", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
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

export default mongoose.model<I_Stock>("Stock", StockSchema);
import mongoose, { Schema } from "mongoose";
import { I_Medicine } from "../../interfaces/medicine.interfaces";

const MedicineSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    activeIngredients: { type: [String] },
  },
  { timestamps: true }
);

export default mongoose.model<I_Medicine>("Medicine", MedicineSchema);

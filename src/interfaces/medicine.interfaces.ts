import { Types } from "mongoose";

export interface I_Medicine {
  _id: string;
  name: string;
  description: string;
  activeIngredients: string[];
}

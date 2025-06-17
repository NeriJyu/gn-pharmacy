import { Types } from "mongoose";

export interface I_Medicine {
  _id: string;
  name: String;
  description: String;
  activeIngredients: String[];
}

export interface I_Medicine {
  id: string;
  name: string;
  description: string;
  activeIngredients: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

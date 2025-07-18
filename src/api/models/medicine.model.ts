import dynamoose from "dynamoose";
import { v4 as uuid } from "uuid";

const MedicineSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid,
    },
    name: {
      type: String,
      required: true,
      index: {
        name: "nameIndex",
        type: "global",
      },
    },
    description: {
      type: String,
    },
    activeIngredients: {
      type: Array,
      schema: [String],
    },
  },
  {
    timestamps: true,
  }
);

const MedicineModel = dynamoose.model("Medicine", MedicineSchema, {
    create: true,
    waitForActive: true,
});

export default MedicineModel;
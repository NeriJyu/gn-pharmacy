import dynamoose from "dynamoose";
import { v4 as uuid } from "uuid";

const PharmacyAddressSchema = new dynamoose.Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  cep: { type: String, required: true },
  lat: { type: String, required: true },
  lon: { type: String, required: true },
});

const PharmacySchema = new dynamoose.Schema(
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
    address: {
      type: Object,
      schema: PharmacyAddressSchema,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PharmacyModel = dynamoose.model("Pharmacy", PharmacySchema, {
  create: true,
  waitForActive: true,
});

export default PharmacyModel;
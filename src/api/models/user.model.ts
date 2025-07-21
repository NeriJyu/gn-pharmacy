import dynamoose from "dynamoose";
import { v4 as uuid } from "uuid";
import { UserRoleEnum } from "../enums/user.enum";

const UserAddressSchema = new dynamoose.Schema({
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

const UserSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        name: "emailIndex",
        type: "global",
      },
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      schema: UserAddressSchema,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: "user",
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = dynamoose.model("User", UserSchema, {
  create: true,
  waitForActive: true,
});

export default UserModel;

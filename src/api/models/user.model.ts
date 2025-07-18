import mongoose, { Schema } from "mongoose";
import { I_User, I_UserAddress } from "../../interfaces/user.interfaces";

const UserAddressSchema = new Schema<I_UserAddress>({
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

const UserSchema = new Schema<I_User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    address: { type: UserAddressSchema, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String, required: false },
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

export default mongoose.model<I_User>("User", UserSchema);

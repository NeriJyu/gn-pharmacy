import { UserRoleEnum } from "../api/enums/user.enum";

export interface I_UserAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  lat: string;
  lon: string;
}

export interface I_User {
  id: string;
  name: string;
  email: string;
  password?: string;
  address: I_UserAddress;
  role: UserRoleEnum;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  _id: string;
  name: string;
  email: string;
  password: string;
  address: I_UserAddress;
  role: "user" | "admin";
  refreshToken?: string;
}

export interface I_CreatedUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  address: I_UserAddress;
  role: "user" | "admin";
  refreshToken?: string;
}

import { I_User, I_UserUpdate } from "../../interfaces/user.interfaces";
import UserModel from "../models/user.model";

export default class UserRepository {
  async create(user: I_User): Promise<I_User> {
    const userToSave = {
      ...user,
      email: user.email.toLowerCase().trim(),
    };

    const newUser = await UserModel.create(userToSave);
    const userObject = newUser.toJSON() as I_User;

    delete userObject.password;

    return userObject;
  }

  async findById(id: string): Promise<I_User | null> {
    const user = await UserModel.get(id);
    if (!user) {
      return null;
    }

    const userObject = user.toJSON() as I_User;
    delete userObject.password;

    return userObject;
  }

  async findByEmail(email: string): Promise<I_User | null> {
    const result = await UserModel.query("email")
      .eq(email.toLowerCase().trim())
      .exec();
    if (result.count === 0 || !result[0]) {
      return null;
    }

    const userObject = result[0].toJSON() as I_User;
    delete userObject.password;

    return userObject;
  }

  async findByEmailWithPassword(email: string): Promise<I_User | null> {
    const result = await UserModel.query("email")
      .eq(email.toLowerCase().trim())
      .exec();

    if (result.count === 0 || !result[0]) throw new Error("User not found");

    return result.count > 0 && result[0]
      ? (result[0].toJSON() as I_User)
      : null;
  }

  async findAll(): Promise<I_User[]> {
    const results = await UserModel.scan().exec();
    const users = results.toJSON() as I_User[];

    users.forEach((user) => delete user.password);

    return users;
  }

  async updateById(id: string, updateData: I_UserUpdate): Promise<I_User | null> {  
    await UserModel.update({ id }, updateData);

    return this.findById(id);
  }

  async deleteById(id: string): Promise<I_User | null> {
    const userToDelete = await this.findById(id);
    if (!userToDelete) {
      return null;
    }

    await UserModel.delete(id);

    return userToDelete;
  }
}

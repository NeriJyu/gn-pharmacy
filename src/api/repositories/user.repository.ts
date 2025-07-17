import { I_User } from "../../interfaces/user.interfaces";
import User from "../models/user.model"

export default class UserRepository {
  async create(user: I_User): Promise<I_User> {
    user.email = user.email.toLowerCase().trim();
    const newUser = new User(user);
    return await newUser.save();
  }

  async findById(id: string): Promise<I_User | null> {
    return await User.findById(id).exec();
  }

  async findByEmail(email: string): Promise<I_User | null> {
    return await User.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findAll(): Promise<I_User[]> {
    return await User.find().exec();
  }

  async updateById(id: string, updateData: Partial<I_User>): Promise<I_User | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteById(id: string): Promise<I_User | null> {
    return await User.findByIdAndDelete(id).exec();
  }
}

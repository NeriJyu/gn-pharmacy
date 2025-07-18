import { I_CreatedUser, I_User } from "../../interfaces/user.interfaces";
import User from "../models/user.model";

export default class UserRepository {
  async create(user: I_User): Promise<I_CreatedUser> {
    user.email = user.email.toLowerCase().trim();
    const newUser = new User(user);

    const createdUser = await newUser.save();

    const createdUserWithoutPassword: I_CreatedUser = createdUser.toObject(); // transforma o documento
    delete createdUserWithoutPassword.password;

    return createdUserWithoutPassword;
  }

  async findById(id: string): Promise<I_User | null> {
    return await User.findById(id).exec();
  }

  async findByEmail(email: string): Promise<I_User | null> {
    return await User.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<I_User | null> {
    return await User.findOne({ email: email.toLowerCase().trim() })
      .select("+password")
      .exec();
  }

  async findAll(): Promise<I_User[]> {
    return await User.find().exec();
  }

  async updateById(
    id: string,
    updateData: Partial<I_User>
  ): Promise<I_User | null> {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();

    return updatedUser;
  }

  async deleteById(id: string): Promise<I_User | null> {
    return await User.findByIdAndDelete(id).exec();
  }
}

import { I_User } from "../../interfaces/user.interfaces";
import { generateHash } from "../../utils/hash.util";
import UserRepository from "../repositories/user.repository";

export default class UserController {
  private userRepository = new UserRepository();

  async create(user: I_User): Promise<I_User> {
    user.password = await generateHash(user.password!);

    return await this.userRepository.create(user);
  }

  async getById(id: string): Promise<I_User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getAll(): Promise<I_User[]> {
    return await this.userRepository.findAll();
  }

  async update(id: string, data: Partial<I_User>): Promise<I_User> {
    const updated = await this.userRepository.updateById(id, data);

    if (!updated) {
      throw new Error("User not found");
    }

    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.userRepository.deleteById(id);

    if (!deleted) {
      throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
  }

  async getByEmail(email: string): Promise<I_User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

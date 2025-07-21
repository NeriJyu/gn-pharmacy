import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository";
import { I_Auth } from "../../interfaces/auth.interfaces";
import { I_User, I_UserUpdate } from "../../interfaces/user.interfaces";

class AuthService {
  private userRepository = new UserRepository();

  async signIn(email: string, password: string): Promise<I_Auth> {
    this.validateLogin(email, password);

    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lat: user.address.lat,
      lon: user.address.lon,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "15d",
    });

    const userToUpdate: I_UserUpdate = {
      refreshToken: refreshToken,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

    await this.userRepository.updateById(user.id, userToUpdate);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(oldToken: string): Promise<I_Auth> {
    try {
      const decoded = jwt.verify(
        oldToken,
        process.env.JWT_SECRET || "secret"
      ) as jwt.JwtPayload;

      const user = await this.userRepository.findById(decoded._id);
      if (!user || user.refreshToken !== oldToken) {
        throw new Error("Invalid refresh token");
      }

      const newPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        lat: user.address.lat,
        lon: user.address.lon,
      };

      const newAccessToken = jwt.sign(
        newPayload,
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "15m",
        }
      );

      const newRefreshToken = jwt.sign(
        newPayload,
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "15d",
        }
      );

      const userToUpdate = {
        ...user,
        newRefreshToken,
      };

      await this.userRepository.updateById(user.id, userToUpdate);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Unauthorized");
    }
  }

  validateLogin(email: string, password: string): void {
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
  }
}

export default AuthService;

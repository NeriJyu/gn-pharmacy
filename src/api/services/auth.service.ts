import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository";
import { I_Auth } from "../../interfaces/auth.interfaces";
import { splitAccessToken } from "../../utils/auth.util";

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
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET || "secret",
      { expiresIn: "15d" }
    );

    let currentTokens = user.refreshTokens || [];

    if (currentTokens.length >= 5) {
      currentTokens.shift();
    }

    currentTokens.push(refreshToken);

    await this.userRepository.updateById(user.id, {
      refreshTokens: currentTokens,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string): Promise<I_Auth> {
    try {
      const oldToken = splitAccessToken(oldRefreshToken);

      const decoded = jwt.verify(
        oldToken,
        process.env.REFRESH_JWT_SECRET || "secret"
      ) as jwt.JwtPayload;

      const user = await this.userRepository.findById(decoded.id);

      const currentTokens = user?.refreshTokens || [];

      if (!user || !currentTokens.includes(oldToken)) {
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
        { expiresIn: "5m" }
      );

      const newRefreshToken = jwt.sign(
        newPayload,
        process.env.REFRESH_JWT_SECRET || "secret",
        { expiresIn: "15d" }
      );

      const newRefreshTokensArray = currentTokens
        .filter((token) => token !== oldToken)
        .concat(newRefreshToken);

      await this.userRepository.updateById(user.id, {
        refreshTokens: newRefreshTokensArray,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Unauthorized");
    }
  }

  async logout(oldRefreshToken: string): Promise<void> {
    try {
      const refreshToken = splitAccessToken(oldRefreshToken);

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_JWT_SECRET || "secret"
      ) as jwt.JwtPayload;

      const user = await this.userRepository.findById(decoded.id);

      if (!user) return;

      const currentTokens = user.refreshTokens || [];

      const newTokens = currentTokens.filter(
        (token) => token !== refreshToken
      );

      await this.userRepository.updateById(user.id, {
        refreshTokens: newTokens,
      });
    } catch (error) {
      throw error;
    }
  }

  validateLogin(email: string, password: string): void {
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
  }
}

export default AuthService;

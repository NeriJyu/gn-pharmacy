import { I_Auth } from "../../interfaces/auth.interfaces";
import AuthService from "../services/auth.service";

export default class AuthController {
  private authService = new AuthService();

  signIn(email: string, password: string): Promise<I_Auth> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.authService.signIn(email, password);

        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  refreshToken(existingRefreshToken: string): Promise<I_Auth> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.authService.refreshToken(existingRefreshToken);

        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  logout(accessToken: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.authService.logout(accessToken);

        resolve("Refresh token successfully invalidated");
      } catch (err) {
        reject(err);
      }
    });
  }
}

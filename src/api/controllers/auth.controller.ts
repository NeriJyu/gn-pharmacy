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
}
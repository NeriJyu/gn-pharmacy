import express from "express";
import AuthController from "../controllers/auth.controller";
import { handleError } from "../../utils/err.util";
import { authenticateToken, splitAccessToken } from "../../utils/auth.util";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authController.signIn(email, password);
    const cookieAccessTokenOptions = {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: false,
      path: "/",
      domain: "localhost",
    };

    const refreshTokenCookieOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      path: "/api/auth/refresh",
      domain: "localhost",
    };

    res.cookie("accessToken", token.accessToken, cookieAccessTokenOptions);
    res.cookie("refreshToken", token.refreshToken, refreshTokenCookieOptions);

    res.status(200).send({ status: "SUCCESS", message: "OK" });
  } catch (err) {
    handleError(err, res, "Failed to log in");
  }
});

authRouter.post("/refresh", async (req, res) => {
  try {
    const existingRefreshToken = req.headers.cookie;
    if (!existingRefreshToken) throw new Error("Refresh not provided");

    const newToken = await authController.refreshToken(existingRefreshToken);

    const accessTokenCookieOptions = {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: false,
      path: "/",
      domain: "localhost",
    };

    const refreshTokenCookieOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      path: "/api/auth/refresh",
      domain: "localhost",
    };

    res.cookie("accessToken", newToken.accessToken, accessTokenCookieOptions);
    res.cookie(
      "refreshToken",
      newToken.refreshToken,
      refreshTokenCookieOptions
    );

    res.status(200).send({ status: "SUCCESS", message: "Tokens updated" });
  } catch (err) {
    handleError(err, res, "Failed to refresh tokens");
  }
});

authRouter.post("/logout", authenticateToken, async (req, res) => {
  try {
    await authController.logout(splitAccessToken(req.headers.authorization!));

    const accessTokenCookieOptions = {
      maxAge: -1,
      httpOnly: true,
      secure: false,
      path: "/",
      domain: "localhost",
    };

    const refreshTokenCookieOptions = {
      maxAge: -1,
      httpOnly: true,
      secure: false,
      path: "/api/auth/refresh",
      domain: "localhost",
    };

    res.cookie("accessToken", "", accessTokenCookieOptions);
    res.cookie("refreshToken", "", refreshTokenCookieOptions);

    res.status(200).send({ status: "SUCCESS", message: "Logout with success" });
  } catch (err) {
    handleError(err, res, "Failed to refresh tokens");
  }
});

export default authRouter;

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

    res.status(200).send({ status: "SUCCESS", message: "OK", data: token });
  } catch (err) {
    handleError(err, res, "Failed to log in");
  }
});

authRouter.post("/refresh", async (req, res) => {
  try {
    const existingRefreshToken = req.headers.authorization;

    if (!existingRefreshToken) throw new Error("Refresh not provided");

    const newToken = await authController.refreshToken(existingRefreshToken);

    res.status(200).send({ status: "SUCCESS", message: "OK", data: newToken });
  } catch (err) {
    handleError(err, res, "Failed to refresh tokens");
  }
});

authRouter.post("/logout", authenticateToken, async (req, res) => {
  try {
    const existingRefreshToken = req.headers.authorization;

    if (!existingRefreshToken) throw new Error("Refresh not provided");

    await authController.logout(existingRefreshToken);

    res.status(200).send({ status: "SUCCESS", message: "Logout with success" });
  } catch (err) {
    handleError(err, res, "Failed to refresh tokens");
  }
});

export default authRouter;

import express from "express";
import AuthController from "../controllers/auth.controller";
import { handleError } from "../../utils/err.util";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authController.signIn(email, password);
    res.status(200).send({ status: "SUCCESS", data: token });
  } catch (err) {
    handleError(err, res, "Failed to log in");
  }
});

export default authRouter;
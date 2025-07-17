import express from "express";
import UserController from "../controllers/user.controller";
import { handleError } from "../../utils/err.util";
import { StatusCodeErrorEnum } from "../enums/errors.enum";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", async (req, res) => {
  try {
    const users = await userController.getAll();
    res.status(200).send({ status: "SUCCESS", data: users });
  } catch (err) {
    handleError(err, res, "Error fetching users", StatusCodeErrorEnum.INTERNAL_SERVER_ERROR);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await userController.getById(req.params.id);
    res.status(200).send({ status: "SUCCESS", data: user });
  } catch (err) {
    handleError(err, res, "User not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

userRouter.get("/email/:email", async (req, res) => {
  try {
    const user = await userController.getByEmail(req.params.email);
    res.status(200).send({ status: "SUCCESS", data: user });
  } catch (err) {
    handleError(err, res, "User not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const created = await userController.create(req.body);
    res.status(201).send({ status: "SUCCESS", data: created });
  } catch (err) {
    handleError(err, res, "Error creating user", StatusCodeErrorEnum.BAD_REQUEST);
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const updated = await userController.update(req.params.id, req.body);
    res.status(200).send({ status: "SUCCESS", data: updated });
  } catch (err) {
    handleError(err, res, "User not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const result = await userController.delete(req.params.id);
    res.status(200).send({ status: "SUCCESS", message: result.message });
  } catch (err) {
    handleError(err, res, "User not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

export default userRouter;

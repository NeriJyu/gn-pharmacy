import express from "express";
import MedicineController from "../controllers/medicine.controller";
import { handleError } from "../../utils/err.util";
import { StatusCodeErrorEnum } from "../enums/errors.enum";
import AuthService from "../services/auth.service";
import { authenticateToken, authorizeRole } from "../../utils/auth.util";
import { UserRoleEnum } from "../enums/user.enum";

const medicineRouter = express.Router();
const medicineController = new MedicineController();

const authService = new AuthService();

medicineRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const medicines = await medicineController.getAll();
    res.status(200).send({ status: "SUCCESS", data: medicines });
  } catch (err) {
    handleError(
      err,
      res,
      "Error fetching medicines",
      StatusCodeErrorEnum.INTERNAL_SERVER_ERROR
    );
  }
});

medicineRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const medicine = await medicineController.getById(req.params.id);
    res.status(200).send({ status: "SUCCESS", data: medicine });
  } catch (err) {
    handleError(err, res, "Medicine not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

medicineRouter.post(
  "/",
  authenticateToken,
  authorizeRole([UserRoleEnum.ADMIN]),
  async (req, res) => {
    try {
      const created = await medicineController.create(req.body);

      res.status(201).send({ status: "SUCCESS", data: created });
    } catch (err) {
      handleError(
        err,
        res,
        "Error creating medicine",
        StatusCodeErrorEnum.BAD_REQUEST
      );
    }
  }
);

medicineRouter.patch(
  "/:id",
  authenticateToken,
  authorizeRole([UserRoleEnum.ADMIN]),
  async (req, res) => {
    try {
      const updated = await medicineController.update(req.params.id, req.body);
      res.status(200).send({ status: "SUCCESS", data: updated });
    } catch (err) {
      handleError(
        err,
        res,
        "Medicine not found",
        StatusCodeErrorEnum.NOT_FOUND
      );
    }
  }
);

medicineRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole([UserRoleEnum.ADMIN]),
  async (req, res) => {
    try {
      const result = await medicineController.delete(req.params.id);
      res.status(200).send({ status: "SUCCESS", message: result.message });
    } catch (err) {
      handleError(
        err,
        res,
        "Medicine not found",
        StatusCodeErrorEnum.NOT_FOUND
      );
    }
  }
);

export default medicineRouter;

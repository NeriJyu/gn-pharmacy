import express from "express";
import { handleError } from "../../utils/err.util";
import { StatusCodeErrorEnum } from "../enums/errors.enum";
import PharmacyController from "../controllers/pharmacy.controller";

const pharmacyRouter = express.Router();
const pharmacyController = new PharmacyController();

pharmacyRouter.get("/", async (req, res) => {
  try {
    const pharmacies = await pharmacyController.getAll();
    res.status(200).send({ status: "SUCCESS", data: pharmacies });
  } catch (err) {
    handleError(err, res, "Error fetching pharmacies", StatusCodeErrorEnum.INTERNAL_SERVER_ERROR);
  }
});

pharmacyRouter.get("/:id", async (req, res) => {
  try {
    const pharmacy = await pharmacyController.getById(req.params.id);
    res.status(200).send({ status: "SUCCESS", data: pharmacy });
  } catch (err) {
    handleError(err, res, "Pharmacy not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

pharmacyRouter.post("/", async (req, res) => {
  try {
    const created = await pharmacyController.create(req.body);
    res.status(201).send({ status: "SUCCESS", data: created });
  } catch (err) {
    handleError(err, res, "Error creating pharmacy", StatusCodeErrorEnum.BAD_REQUEST);
  }
});

pharmacyRouter.patch("/:id", async (req, res) => {
  try {
    const updated = await pharmacyController.update(req.params.id, req.body);
    res.status(200).send({ status: "SUCCESS", data: updated });
  } catch (err) {
    handleError(err, res, "Pharmacy not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

pharmacyRouter.delete("/:id", async (req, res) => {
  try {
    const result = await pharmacyController.delete(req.params.id);
    res.status(200).send({ status: "SUCCESS", message: result.message });
  } catch (err) {
    handleError(err, res, "Pharmacy not found", StatusCodeErrorEnum.NOT_FOUND);
  }
});

export default pharmacyRouter;

import express from "express";
import { handleError } from "../../utils/err.util";
import { StatusCodeErrorEnum } from "../enums/errors.enum";
import StockController from "../controllers/stock.controller";
import { authenticateToken } from "../../utils/auth.util";

const stockRouter = express.Router();
const stockController = new StockController();

stockRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const stocks = await stockController.getAll();
    res.status(200).send({ status: "SUCCESS", data: stocks });
  } catch (err) {
    handleError(
      err,
      res,
      "Error fetching stock",
      StatusCodeErrorEnum.INTERNAL_SERVER_ERROR
    );
  }
});

stockRouter.get(
  "/:pharmacyId/:medicineId",
  authenticateToken,
  async (req, res) => {
    try {
      const stock = await stockController.findByPharmacyAndMedicine(
        req.params.pharmacyId,
        req.params.medicineId
      );
      res.status(200).send({ status: "SUCCESS", data: stock });
    } catch (err) {
      handleError(err, res, "Stock not found", StatusCodeErrorEnum.NOT_FOUND);
    }
  }
);

stockRouter.get(
  "/medicine/:medicineId",
  authenticateToken,
  async (req, res) => {
    try {
      const available = await stockController.getByMedicine(
        req.params.medicineId
      );
      res.status(200).send({ status: "SUCCESS", data: available });
    } catch (err) {
      handleError(
        err,
        res,
        "Error fetching stock by medicine",
        StatusCodeErrorEnum.INTERNAL_SERVER_ERROR
      );
    }
  }
);

stockRouter.post("/", authenticateToken, async (req, res) => {
  try {
    const created = await stockController.create(req.body);
    res.status(201).send({ status: "SUCCESS", data: created });
  } catch (err) {
    handleError(
      err,
      res,
      "Error creating stock",
      StatusCodeErrorEnum.BAD_REQUEST
    );
  }
});

stockRouter.patch(
  "/:pharmacyId/:medicineId",
  authenticateToken,
  async (req, res) => {
    try {
      const updated = await stockController.update(
        req.params.pharmacyId,
        req.params.medicineId,
        req.body
      );
      res.status(200).send({ status: "SUCCESS", data: updated });
    } catch (err) {
      handleError(err, res, "Stock not found", StatusCodeErrorEnum.NOT_FOUND);
    }
  }
);

stockRouter.delete(
  "/:pharmacyId/:medicineId",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await stockController.delete(
        req.params.pharmacyId,
        req.params.medicineId
      );
      res.status(200).send({ status: "SUCCESS", message: result.message });
    } catch (err) {
      handleError(err, res, "Stock not found", StatusCodeErrorEnum.NOT_FOUND);
    }
  }
);

export default stockRouter;

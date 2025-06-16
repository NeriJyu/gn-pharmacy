import express from "express";
import medicineRouter from "./medicine.routes";
import pharmacyRouter from "./pharmacy.routes";
import stockRouter from "./stock.routes";
import openaiRouter from "./openai.routes";
const router = express.Router();

router.use("/medicine", medicineRouter);
router.use("/pharmacy", pharmacyRouter);
router.use("/stock", stockRouter);
router.use("/openai", openaiRouter);

export default router;

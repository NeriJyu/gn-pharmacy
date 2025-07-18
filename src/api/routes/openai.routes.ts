import express from "express";
import { handleError } from "../../utils/err.util";
import { StatusCodeErrorEnum } from "../enums/errors.enum";
import OpenAIController from "../controllers/openai.controller";
import { upload } from "../../utils/uploader.util";

const openaiRouter = express.Router();
const openaiController = new OpenAIController();

openaiRouter.post("/chat", async (req, res) => {
  try {
    const askChatGPT = await openaiController.askChatGPT(req.body.message);

    res.status(200).send({
      status: "SUCCESS",
      data: askChatGPT,
    });
  } catch (err) {
    handleError(
      err,
      res,
      "An error occurred while processing your request",
      StatusCodeErrorEnum.BAD_REQUEST
    );
  }
});

// openaiRouter.post(
//   "/recommendate-medicine",
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       const recommendateMedicine = await openaiController.recommendateMedicine(
//         req.body?.message,
//         req.file
//       );

//       res.status(200).send({
//         status: "SUCCESS",
//         data: recommendateMedicine,
//       });
//     } catch (err) {
//       handleError(
//         err,
//         res,
//         "An error occurred while processing your request",
//         StatusCodeErrorEnum.BAD_REQUEST
//       );
//     }
//   }
// );

export default openaiRouter;

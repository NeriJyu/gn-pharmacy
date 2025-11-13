import express from "express";
import { handleError } from "../../utils/err.util";
import { StatusCodeErrorEnum } from "../enums/errors.enum";
import OpenAIController from "../controllers/openai.controller";
import { upload } from "../../utils/uploader.util";
import { authenticateToken, authorizeRole } from "../../utils/auth.util";
import { UserRoleEnum } from "../enums/user.enum";
import { Readable } from "stream";

const openaiRouter = express.Router();
const openaiController = new OpenAIController();

openaiRouter.post(
  "/chat",
  authenticateToken,
  authorizeRole([UserRoleEnum.ADMIN]),
  async (req, res) => {
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
  }
);

openaiRouter.post(
  "/recommendate-medicine",
  upload.single("file"),
  authenticateToken,
  async (req, res) => {
    try {
      const recommendateMedicine = await openaiController.recommendateMedicine(
        req.body?.message,
        req.file
      );
      
      res.status(200).send({
        status: "SUCCESS",
        data: recommendateMedicine,
      });
    } catch (err) {
      handleError(
        err,
        res,
        "An error occurred while processing your request",
        StatusCodeErrorEnum.BAD_REQUEST
      );
    }
  }
);

// openaiRouter.get(
//   "/recommendate-medicine",
//   upload.single("file"),
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const webAudioStream = await openaiController.recommendateMedicineTeste(
//         "Onde posso comprar dipirona?",
//         req.file
//       );

//       const nodeAudioStream = Readable.fromWeb(webAudioStream as any);

//       res.setHeader("Content-Type", "audio/opus");

//       nodeAudioStream.pipe(res);

//       nodeAudioStream.on("error", (err: any) => {
//         console.error("Erro no stream de áudio:", err);
//         if (!res.headersSent) {
//           res.status(500).send("Erro ao gerar áudio");
//         }
//       });

//       nodeAudioStream.on("end", () => {
//         res.end();
//       });
//     } catch (err) {
//       console.log("err: ", err);

//       handleError(
//         err,
//         res,
//         "An error occurred while processing your request",
//         StatusCodeErrorEnum.BAD_REQUEST
//       );
//     }
//   }
// );

// openaiRouter.get(
//   "/recommendate-medicine",
//   async (req, res) => {
//     try {
//       const webAudioStream = await openaiController.recommendateMedicineTeste(
//         "Onde posso comprar dipirona?",
//       );

//       const nodeAudioStream = Readable.fromWeb(webAudioStream as any);

//       res.setHeader("Content-Type", "audio/opus");

//       nodeAudioStream.pipe(res);

//       nodeAudioStream.on("error", (err: any) => {
//         console.error("Erro no stream de áudio:", err);
//         if (!res.headersSent) {
//           res.status(500).send("Erro ao gerar áudio");
//         }
//       });

//       nodeAudioStream.on("end", () => {
//         res.end();
//       });
//     } catch (err) {
//       console.log("err: ", err);

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

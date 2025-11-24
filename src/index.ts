import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import router from "./api/routes/index.routes";
import "./config/database";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://pharmacy.bspprompt.com"],
    credentials: true,
  })
);
const port = process.env.PORT || 3000;

app.use("/api", router);
app.get("/", (req, res) => {
  res.send("API rodando :)");
});

const startServer = async () => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

startServer();

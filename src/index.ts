import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToDatabase } from "./config/database";
import router from "./api/routes/index.routes";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api", router);
app.get("/", (req, res) => {
  res.send("API rodando");
});

const startServer = async () => {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

startServer();

import express from "express";
import { config } from "./config";

export const initializeServer = () => {
  const app = express();
  const port = config.BOT_APP_PORT;

  app.get("/", (_req, res) => {
    res.send("Hello from bot!");
  });

  app.listen(port, () => {
    console.log(`Bot app listening at http://localhost:${port}`);
  });
};

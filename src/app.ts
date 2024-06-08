import express from "express";
import { config } from "./init/config";

export const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/metadata", (req, res) => {
  res.json({
    gitSHA: config.gitSHA,
  });
});

export function start() {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

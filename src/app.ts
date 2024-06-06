import express from "express";
import { config } from "./init/config";

export const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export function start() {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

import express, { Router } from "express";
import { config } from "./init/config";
import { initOtel } from "./init/otel";
import { getOTELMiddleware } from "./middleware/otel";

export const app = express();

const router = Router();
router.use(getOTELMiddleware());
router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/metadata/:id", (req, res) => {
  res.json({
    gitSHA: config.gitSHA,
  });
});

app.use("/", router);

export function start() {
  initOtel();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

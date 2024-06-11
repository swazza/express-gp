import express, { Router } from "express";
import { config } from "./init/config";
import { initOtel } from "./init/otel";
import { getLogger } from "./init/logger";
import { getOTELMiddleware } from "./middleware/otel";
import { getReqMetrics } from "./init/metrics";

export const app = express();

export function start() {
  initOtel();
  const logger = getLogger();
  const reqMetrics = getReqMetrics();

  const router = Router();
  router.use(getOTELMiddleware(logger, reqMetrics));
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });

  router.get("/metadata/:id", (req, res) => {
    res.status(200).json({
      gitSHA: config.gitSHA,
    });
  });

  app.use("/", router);

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

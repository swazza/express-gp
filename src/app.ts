import express, { Router } from "express";
import { config } from "./init/config";
import { initOtel } from "./init/otel";
import { getLogger } from "./init/logger";
import { getOTELMiddleware, getRequestErrorHandler } from "./middleware";
import { getReqMetrics } from "./init/metrics";

export const app = express();

export function start() {
  const shutdownOtel = initOtel();
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

  router.get("/error", (req, res, next) => {
    next(new Error("This is a test error"));
  });

  router.use(getRequestErrorHandler(logger));

  app.use("/", router);

  const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  async function shutdown() {
    server.close(() => {
      console.log("Server is shut down");
    });
    await shutdownOtel();
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

import type { ErrorRequestHandler } from "express";
import type { Logger } from "winston";

export function getRequestErrorHandler(logger: Logger): ErrorRequestHandler {
  return function (err: Error, req, res, next) {
    console.log("request error");
    logger.error("request error", {
      method: req.method,
      path: req.route?.path,
      code: 500,
      error: err.message,
      stackTrace: err.stack,
    });
    res.status(500).send("Something broke!");
  };
}

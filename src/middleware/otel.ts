import type { Handler } from "express";
import type { Span } from "@opentelemetry/api";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import { Logger } from "winston";

export const getOTELMiddleware = (logger: Logger): Handler => {
  return function (req, res, next) {
    const start = process.hrtime();
    const tracer = opentelemetry.trace.getTracer("http-request");

    /**
     * start an active span with an empty name. this is because the matched route path is not available on the
     * the request object (req.route.path) until the request is fully executed by the route handler.
     * we update the span name in the res.on("finish") event listener below.
     */
    tracer.startActiveSpan("", (span: Span) => {
      /**
       * TODO: check if bun runtime's issue with triggering req.on("end") has been resolved.
       * this should ideally be req.on("end"). However, bun runtime  has issues with triggering the end event.
       * the res.on("finish") is being used as a workaround.
       */
      res.on("finish", () => {
        const [_, timeInNanoSeconds] = process.hrtime(start);

        const method = req.method;
        const path = req.route?.path;
        span.updateName(`${method} ${path}`);

        const code = res.statusCode;
        if (code >= 500) {
          span.setStatus({ code: SpanStatusCode.ERROR });
        } else {
          span.setStatus({ code: SpanStatusCode.OK });
        }

        logger.info("request", {
          method,
          path: req.path,
          code,
        });
        span.end();
      });

      // call the next middleware
      next();
    });
  };
};

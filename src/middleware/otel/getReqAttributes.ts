import type { Request } from "express";
import type { Attributes } from "@opentelemetry/api";

export function getReqAttributes(req: Request): Attributes {
  return {
    "http.method": req.method,
    "http.scheme": req.protocol,
    "http.host": req.get("host"),
    "http.target": req.originalUrl,
    "http.user_agent": req.get("user-agent"),
    "http.flavor": req.httpVersion,
    "http.status_code": req.statusCode,
    "http.status_text": req.statusMessage,
    "express.matched_route": `${req.method} ${req.route?.path}`,
  };
}

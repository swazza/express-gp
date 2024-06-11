import { createLogger } from "winston";
import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";

export function getLogger() {
  return createLogger({
    transports: [new OpenTelemetryTransportV3()],
  });
}

import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from "@opentelemetry/semantic-conventions";
import { initLogging } from "./logs";
import { initMetrics } from "./metrics";
import { initTracing } from "./traces";

const resource = Resource.default().merge(
  new Resource({
    // Replace with any string to identify this service in your system
    [SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME,
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.DEPLOYMENT_ENVIRONMENT,
  }),
);

export function initOtel() {
  initLogging(resource);
  initMetrics(resource);
  initTracing(resource);
}

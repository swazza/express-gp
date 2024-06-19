import { Resource } from "@opentelemetry/resources";
import os from "os";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_HOST_NAME,
  SEMRESATTRS_HOST_ARCH,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_PROCESS_PID,
  SEMRESATTRS_PROCESS_EXECUTABLE_NAME,
  SEMRESATTRS_PROCESS_EXECUTABLE_PATH,
  SEMRESATTRS_PROCESS_COMMAND_ARGS,
  SEMRESATTRS_PROCESS_RUNTIME_VERSION,
  SEMRESATTRS_PROCESS_RUNTIME_NAME,
  SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION,
  SEMRESATTRS_PROCESS_COMMAND,
  SEMRESATTRS_PROCESS_OWNER,
} from "@opentelemetry/semantic-conventions";
import { initLogging } from "./logs";
import { initMetrics } from "./metrics";
import { initTracing } from "./traces";

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME,
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.DEPLOYMENT_ENVIRONMENT,
    [SEMRESATTRS_HOST_NAME]: os.hostname(),
    [SEMRESATTRS_HOST_ARCH]: os.arch(),
    [SEMRESATTRS_SERVICE_VERSION]: process.env.GIT_SHA,
    [SEMRESATTRS_PROCESS_PID]: process.pid,
    [SEMRESATTRS_PROCESS_EXECUTABLE_NAME]: process.title,
    [SEMRESATTRS_PROCESS_EXECUTABLE_PATH]: process.argv[0],
    [SEMRESATTRS_PROCESS_COMMAND_ARGS]: process.argv.slice(1),
    [SEMRESATTRS_PROCESS_RUNTIME_VERSION]: process.version,
    [SEMRESATTRS_PROCESS_RUNTIME_NAME]: "bun",
    [SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION]:
      "Node.js compatible runtime for bun.",
    [SEMRESATTRS_PROCESS_COMMAND]: process.argv.join(" "),
    [SEMRESATTRS_PROCESS_OWNER]: os.userInfo().username,
  }),
);

export function initOtel(): () => Promise<void> {
  const logProvider = initLogging(resource);
  const metricsProvider = initMetrics(resource);
  const tracingProvider = initTracing(resource);

  return async function shutdown() {
    await [
      logProvider.shutdown(),
      metricsProvider.shutdown(),
      tracingProvider.shutdown(),
    ];
  };
}

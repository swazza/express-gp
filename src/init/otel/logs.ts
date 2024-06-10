import * as logsAPI from "@opentelemetry/api-logs";
import { Resource } from "@opentelemetry/resources";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

export function initLogging(resource: Resource) {
  const isProduction = process.env.NODE_ENV === "production";
  const loggerProvider = new LoggerProvider({ resource });
  const exporter = isProduction
    ? new OTLPLogExporter()
    : new ConsoleLogRecordExporter();

  const processor = isProduction
    ? new BatchLogRecordProcessor(exporter)
    : new SimpleLogRecordProcessor(exporter);

  loggerProvider.addLogRecordProcessor(processor);
  logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

  registerInstrumentations({
    instrumentations: [
      new WinstonInstrumentation({
        // See below for Winston instrumentation options.
      }),
    ],
  });
}

import { Resource } from "@opentelemetry/resources";
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import type { TracerProvider } from "@opentelemetry/api";

export function initTracing(resource: Resource): NodeTracerProvider {
  const traceProvider = new NodeTracerProvider({ resource });
  const isProduction = process.env.NODE_ENV === "production";
  const exporter = isProduction
    ? new OTLPTraceExporter()
    : new ConsoleSpanExporter();

  const spanProcessor = isProduction
    ? new BatchSpanProcessor(exporter)
    : new SimpleSpanProcessor(exporter);

  traceProvider.addSpanProcessor(spanProcessor);
  traceProvider.register();
  return traceProvider;
}

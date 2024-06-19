import opentelemetry from "@opentelemetry/api";
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { Resource } from "@opentelemetry/resources";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

export function initMetrics(resource: Resource): MeterProvider {
  const isProduction = process.env.NODE_ENV === "production";
  const exporter = isProduction
    ? new OTLPMetricExporter()
    : new ConsoleMetricExporter();

  const metricReader = new PeriodicExportingMetricReader({
    exporter,
  });

  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  opentelemetry.metrics.setGlobalMeterProvider(meterProvider);
  return meterProvider;
}

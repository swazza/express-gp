import { metrics, type Counter, type UpDownCounter } from "@opentelemetry/api";

export interface RequestMetrics {
  totalRequestsCounter: Counter;
  totalErrorsCounter: Counter;
  inProgressRequestsGauge: UpDownCounter;
}

export function getReqMetrics(): RequestMetrics {
  const meter = metrics.getMeter("request");
  return {
    totalRequestsCounter: meter.createCounter("requests.total"),
    totalErrorsCounter: meter.createCounter("requests.errors"),
    inProgressRequestsGauge: meter.createUpDownCounter("requests.in_progress"),
  };
}

import express, { Express, NextFunction, Request, Response } from "express";
import { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } from "prom-client";

const registry = new Registry();

registry.setDefaultLabels({
  app: 'monitoring-ts-app'
});

export const app: Express = express();

collectDefaultMetrics({ register: registry });

const httpMetricsLabelNames = ['method', 'path', 'status'];

const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    registers: [registry],
    labelNames: httpMetricsLabelNames,
  });


const httpRequestTimerBuckets = new Histogram({
    name: 'http_total_requests_duration_ms',
    help: 'Duration of all HTTP requests in ms',
    labelNames: httpMetricsLabelNames,
    registers: [registry],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000],
  });

const httpRequestDuration = new Gauge({
  name: 'http_last_request_duration',
  help: 'Response time of the Last Request',
  labelNames: httpMetricsLabelNames,
  registers: [registry]
});

const updateMetrics = (req: Request, res: Response, next: NextFunction) => {
  const startTime = new Date().valueOf();
    res.addListener('finish', () => {
        const responseTime = (new Date().valueOf() - startTime); // milliseconds
        const labels = { method: req.method, path: req.path, status: res.statusCode.toString() };
        httpRequestDuration.labels(labels.method, labels.path, labels.status).set(responseTime);
        httpRequestCounter.labels(labels.method, labels.path, labels.status).inc();
        httpRequestTimerBuckets.labels(labels.method, labels.path, labels.status).observe(responseTime);
    })
    next();
};



app.get('/metrics', async (_, res: Response) => {
  res.setHeader('Content-Type', registry.contentType)
  res.send(await registry.metrics())
});


export { app as metricsServer, updateMetrics };
  

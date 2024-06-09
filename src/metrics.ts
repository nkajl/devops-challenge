import express, { Express, NextFunction, Request, Response } from "express";
import { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } from "prom-client";
import { createServer } from "http";

const registry = new Registry();

collectDefaultMetrics({ register: registry });

const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    registers: [registry],
    labelNames: ['method', 'path', 'status'],
  })


const httpRequestTimer = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP request in ms',
    labelNames: ['method', 'path', 'status'],
    registers: [registry],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000],
  });



const metricsServer = createServer(app);

export { metricsServer, updateMetrics };

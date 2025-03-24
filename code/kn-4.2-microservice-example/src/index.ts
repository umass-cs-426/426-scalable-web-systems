import express, { Request, Response } from "express";
import { performance } from "perf_hooks";

const app = express();
const port = process.env.PORT || 3000;

// Middleware for logging requests
const logger = (req: Request, res: Response, next: () => void) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

app.use(logger);

// Mock in-memory metrics
let requestCount = 0;
const requestTimes: number[] = [];

const recordMetrics = (handler: (req: Request, res: Response) => void) =>
    (req: Request, res: Response) => {
        requestCount++;
        const start = performance.now();
        res.on("finish", () => requestTimes.push(performance.now() - start));
        handler(req, res);
    };

// Standard health check endpoint
app.get("/health", recordMetrics((_, res) => res.json({ status: "healthy" })));

// Metrics endpoint (Prometheus-style)
app.get("/metrics", recordMetrics((_, res) => {
    const avgResponseTime = requestTimes.length
        ? requestTimes.reduce((a, b) => a + b, 0) / requestTimes.length
        : 0;

    res.set("Content-Type", "text/plain");
    res.send([
        `request_count ${requestCount}`,
        `average_response_time_ms ${avgResponseTime.toFixed(2)}`
    ].join("\n"));
}));

// Example mock endpoint
app.get("/hello", recordMetrics((_, res) => res.json({ message: "Hello, world!" })));

// Example POST endpoint
app.post("/echo", express.json(), recordMetrics((req, res) => res.json({ received: req.body })));

// Start the server
app.listen(port, () => console.log(`Microservice running on port ${port}`));

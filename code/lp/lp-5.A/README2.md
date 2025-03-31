# LP-5.A: Synchronous Microservices with Registry and Logging

Welcome to LP-5.A! In this exercise, you'll integrate a new microservice (`service-d`) into an existing synchronous microservice system built with Node.js and TypeScript. You'll work with service discovery, structured logging, request forwarding, and performance testing — just like in real-world scalable systems.

---

## 🚦 System Overview

The system includes the following services:

| Service       | Role                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| `api-gateway` | Entry point. Forwards requests to `service-a`, `service-b`, and `service-d`.                  |
| `service-a`   | Calls `service-c` and returns merged data.                                                    |
| `service-b`   | Calls `service-c`, then sends data to `service-d`.                                            |
| `service-c`   | (In Python with FastAPI) Enriches data with timestamps.                                       |
| `service-d`   | **You build this one.** Communicates with registry and responds to `gateway` and `service-b`. |
| `registry`    | Simple service discovery system. Keeps track of all service URLs.                             |

All services register themselves with the registry on startup using `POST /register` and discover other services using `GET /lookup?name=...`.

---

## 🗂️ Folder Structure

```text
lp-5a/
├── api-gateway/
├── service-a/
├── service-b/
├── service-c/            # Provided later in Python
├── service-d/            # You implement this!
├── registry/
├── logs/                 # Log files (created at runtime)
├── requests.ts           # Sends test requests to the gateway
├── autocannon.ts         # Load tests the gateway endpoints
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧑‍💻 Your Task

You are responsible for completing `service-d`:

- It must **register with the registry** on startup using retry logic.
- It must accept requests from:
  - `api-gateway` on `/`
  - `service-b` on `/from-b`
- It must **look up other services** using the registry and optionally call them.
- It must **log to both stdout and a file** (`logs/service-d.log`) using `pino`.
- It must **handle errors gracefully** and exit if the registry cannot be reached after retries.

Start editing: `service-d/index.ts`

---

## 🚀 Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Start all services (except service-c)

```bash
npm run start:all
```

### 3. Run manual test requests

```bash
npm run start:test
```

### 4. Run performance test (autocannon)

```bash
npm run start:autocannon
```

---

## 🪵 Logging

All services use `pino` for structured logs.

- `service-d` logs to both stdout and `logs/service-d.log`.
- Logs include timestamps, request paths, and any trace IDs (see optional extensions).

---

## 🧪 Testing & Failure Simulation

You can test system behavior under failure:

- Stop `service-c` while sending `/a` or `/b` requests → observe retry behavior or error propagation
- Kill the registry and try restarting a service → it should retry registration and exit on failure
- Check `logs/service-d.log` for structured entries

---

## 💡 Optional Extensions

If you finish early or want a challenge, try these!

### 🔷 1. Trace ID Propagation

Add a `traceId` to each request at the API Gateway and pass it through all services via headers. Log it in each service to trace request flow.

```ts
const traceId = req.headers['x-trace-id'] || crypto.randomUUID();
log.info({ traceId });
```

### 🔷 2. Artificial Latency

Add random delays to `service-d` (or others) using:

```ts
await new Promise(resolve => setTimeout(resolve, Math.random() * 300));
```

Then observe how it affects `/b` response times.

### 🔷 3. Retry on Downstream Failures

Wrap `fetch()` to other services with retry logic (e.g., 3 attempts + delay) to handle temporary failures.

### 🔷 4. In-Memory Metrics

Track number of requests and errors in each service and log them every 30 seconds:

```ts
setInterval(() => log.info({ requestsHandled, errorsSeen }), 30000);
```

---

## 🔗 Helpful References

- [Pino Logging](https://github.com/pinojs/pino)
- [Autocannon](https://www.npmjs.com/package/autocannon)
- [FastAPI (for service-c)](https://fastapi.tiangolo.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📤 Submitting

Submit to Gradescope:

1. Your completed `service-d` folder
2. Your updated `package.json`
3. Your `logs/service-d.log` file
4. Output of `npm run start:test` (copied to a file or screenshot)

---
Happy coding! 🚀

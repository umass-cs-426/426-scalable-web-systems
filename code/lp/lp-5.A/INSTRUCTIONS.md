# INSTRUCTIONS

## 🧩 LP-5.A: Integrating a New Microservice into a Synchronous Architecture

### 🧠 Learning Objectives

By completing this practice exercise, you will:

- Create a new microservice that communicates with other services synchronously over HTTP.
- Register your service with a registry and perform service discovery at runtime.
- Implement retry logic when the registry is temporarily unavailable.
- Use structured logging with `pino`, including both console and file-based logs.
- Forward requests between services and handle failures gracefully.
- Run and manage a local multi-service environment using `nodemon`, `ts-node`, and `concurrently`.
- Perform latency and performance testing with `autocannon`.

---

## 🏗️ Provided Architecture

You are working with a system composed of the following microservices:

| Service       | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `api-gateway` | Forwards client requests to other services (`/a`, `/b`, `/d`).          |
| `service-a`   | Forwards requests to `service-c`.                                       |
| `service-b`   | Forwards requests to `service-c`, then forwards results to `service-d`. |
| `service-c`   | (Python/FastAPI) Returns enriched data with a timestamp.                |
| `service-d`   | **You implement this** — talks to registry, handles requests, and logs. |
| `registry`    | Allows services to register and discover each other at runtime.         |

All services communicate using `fetch` over HTTP. A registry service runs at `http://localhost:3005`.

---

## 🎯 Your Task

You will complete the implementation of `service-d`:

### ✅ Functional Requirements

- Register `service-d` with the registry on startup.
- Accept **two types of requests**:
  - From the API Gateway (`POST /`)
  - From `service-b` (`POST /from-b`)
- Log all incoming requests using `pino`, and log to:
  - Standard output
  - A file at `logs/service-d.log`
- Use the registry to look up other services dynamically.
- Respond with structured JSON objects that show:
  - What was received
  - Where it came from
  - What it did (or didn’t do)

### 🛑 Error Handling

- If the registry is down at startup:
  - Retry registration up to 5 times (use exponential or linear backoff)
  - Log each failure attempt
  - Exit with an error if registration fails

---

## 🧪 Testing Your Implementation

### Manual Requests

Run:

```bash
npm run start:test
```

This sends test messages to `/a`, `/b`, and `/d` via the API Gateway and logs the results.

### Load Testing

Run:

```bash
npm run start:autocannon
```

This uses [`autocannon`](https://www.npmjs.com/package/autocannon) to benchmark the system under load for each endpoint.

### Failure Simulation

- Stop `service-c` before testing `/a` or `/b` to observe graceful degradation.
- Kill the registry and restart a service to observe retry behavior.

---

## 🧪 Example Request/Response for `/d`

**Request:**

```json
{
  "message": "hello from api-gateway"
}
```

**Response from service-d:**

```json
{
  "from": "service-d",
  "received": {
    "message": "hello from api-gateway"
  },
  "timestamp": "2025-03-29T19:00:00.000Z"
}
```

---

## 💡 Optional Extensions (Extra Credit / Stretch Goals)

These are *not required* but demonstrate advanced understanding:

### 🔷 Trace ID Propagation

- Generate a `traceId` at the gateway
- Forward it as a header
- Log it in each service

### 🔷 Artificial Latency

- Use `setTimeout` to simulate 50–300 ms delays in `service-d`
- Observe impact with `autocannon`

### 🔷 Downstream Retry

- Add retry logic for `fetch()` calls to `service-c` or other services

### 🔷 Basic Metrics

- Count and log the number of handled requests and errors

---

## 📝 Submission Instructions

Submit to Gradescope:

1. Your completed `service-d/` folder
2. Your updated `package.json`
3. Your `logs/service-d.log` file
4. A copy-paste or screenshot of the terminal output from `npm run start:test`

Make sure all required functionality works before submitting.

---

## 🧵 Rubric (20 pts total)

| Criteria                                 | Points |
| ---------------------------------------- | ------ |
| Registers with registry + retry logic    | 4 pts  |
| Handles `/` and `/from-b` requests       | 4 pts  |
| Uses `lookup` to discover other services | 3 pts  |
| Logs to stdout and to a file             | 3 pts  |
| Graceful error handling on failure       | 3 pts  |
| Code clarity, structure, and comments    | 3 pts  |

Optional extensions may earn instructor bonus points.

---

## 📚 References

- [Pino Logging](https://github.com/pinojs/pino)
- [Autocannon](https://www.npmjs.com/package/autocannon)
- [FastAPI](https://fastapi.tiangolo.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Good luck — and have fun building real-world systems! 🚀

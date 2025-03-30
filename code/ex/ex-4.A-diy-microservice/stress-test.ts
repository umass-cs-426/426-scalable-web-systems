import autocannon, { Result } from 'autocannon';

const url = 'http://localhost:3000/users';

type TestOptions = {
  title: string;
  connections: number;
  duration: number;
  body: object;
};

const runTest = (options: TestOptions): void => {
  const { title, connections, duration, body } = options;

  const instance = autocannon({
    title,
    url,
    method: 'POST',
    connections,
    duration,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, (err: any, result: Result) => {
    if (err) {
      console.error(`[${title}] Test failed:`, err);
    } else {
      console.log(`[${title}] Test complete. Requests per second: ${result.requests.average}`);
    }
  });

  autocannon.track(instance, { renderProgressBar: true });
};

// Load test: expected input and concurrency
runTest({
  title: 'Load Test (Valid Users)',
  connections: 20,
  duration: 10,
  body: { name: 'Alice', email: 'alice@example.com', age: 28 },
});

// Negative test: bad input that should fail validation
setTimeout(() => runTest({
  title: 'Negative Test (Bad Email)',
  connections: 10,
  duration: 5,
  body: { name: '', email: 'not-an-email', age: 10 },
}), 12000);

// Stress test: high concurrency
setTimeout(() => runTest({
  title: 'Stress Test (Overload)',
  connections: 100,
  duration: 10,
  body: { name: 'Stressy', email: 'stress@example.com', age: 35 },
}), 19000);
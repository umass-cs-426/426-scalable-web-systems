import fs from 'fs/promises';
import path from 'path';

const logDir = path.resolve(__dirname, 'logs');

type LogEntry = {
  title: string;
  timestamp: string;
  requestsPerSecond: number;
  latency: number;
  throughput: number;
  non2xx: number;
};

const compareLatest = async (testName: string): Promise<void> => {
  const files = await fs.readdir(logDir);
  const matching = files
    .filter(f => f.startsWith(testName))
    .sort()
    .slice(-2);

  if (matching.length < 2) {
    console.log('Not enough logs to compare.');
    return;
  }

  const [prevFile, currFile] = matching;
  const [prev, curr] = await Promise.all([
    fs.readFile(path.join(logDir, prevFile), 'utf-8'),
    fs.readFile(path.join(logDir, currFile), 'utf-8'),
  ]);

  const prevData = JSON.parse(prev) as LogEntry;
  const currData = JSON.parse(curr) as LogEntry;

  const delta = {
    rpsChange: currData.requestsPerSecond - prevData.requestsPerSecond,
    latencyChange: currData.latency - prevData.latency,
    non2xxChange: currData.non2xx - prevData.non2xx,
  };

  console.log(`📈 Comparison for ${testName}`);
  console.log(`Previous: ${prevData.timestamp}, Current: ${currData.timestamp}`);
  console.log(`Requests/sec: ${prevData.requestsPerSecond} → ${currData.requestsPerSecond} (${delta.rpsChange >= 0 ? '+' : ''}${delta.rpsChange.toFixed(2)})`);
  console.log(`Latency (ms): ${prevData.latency} → ${currData.latency} (${delta.latencyChange >= 0 ? '+' : ''}${delta.latencyChange.toFixed(2)})`);
  console.log(`Non-2xx: ${prevData.non2xx} → ${currData.non2xx} (${delta.non2xxChange})`);
};

compareLatest('load_test_(valid_users)');
import express from 'express';
import pino from 'pino';

const PORT = 3005;
const log = pino({ transport: { target: 'pino-pretty' } });

const app = express();
app.use(express.json());

// In-memory service registry
const services: Record<string, string> = {};

// POST /register { name, url }
app.post('/register', (req, res) => {
  const { name, url } = req.body;

  if (!name || !url) {
    log.warn('Bad register request', req.body);
    return res.status(400).json({ error: 'Missing name or url' });
  }

  services[name] = url;
  log.info(`Registered service: ${name} at ${url}`);
  res.json({ status: 'ok' });
});

// GET /lookup?name=service-name
app.get('/lookup', (req, res) => {
  const name = req.query.name as string;

  if (!name) {
    return res.status(400).json({ error: 'Missing service name' });
  }

  const url = services[name];
  if (!url) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({ url });
});

app.listen(PORT, () => {
  log.info(`Registry service listening on port ${PORT}`);
});

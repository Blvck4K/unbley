import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.API_DEV_PORT || 3001);

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', async (req, res) => {
  const pathname = req.path.replace(/^\/api\/?/, '');
  const normalized = pathname.replace(/^\/|\/$/g, '');

  if (!normalized) {
    return json(res, 404, { error: 'API endpoint not found.' });
  }

  const routeParts = normalized.split('/');
  const filePath = path.join(__dirname, 'api', ...routeParts) + '.js';
  const routeFile = path.resolve(filePath);

  if (!existsSync(routeFile)) {
    return json(res, 404, { error: `API route not found: /api/${normalized}` });
  }

  try {
    const module = await import(pathToFileURL(routeFile).href);
    const handler = module.default || module.handler;
    if (typeof handler !== 'function') {
      return json(res, 500, { error: 'API route does not export a handler.' });
    }

    await handler(req, res);
  } catch (error) {
    console.error('[api-dev-server]', error);
    return json(res, 500, { error: error.message || 'API request failed.' });
  }
});

app.use((req, res) => {
  return json(res, 404, { error: `Unknown route: ${req.originalUrl}` });
});

app.listen(port, () => {
  console.log(`Unbley API dev server listening on http://localhost:${port}`);
});

function json(res, status, body) {
  return res.status(status).json(body);
}

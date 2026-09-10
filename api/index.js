import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  const incoming = req.url || req.originalUrl || req.path || '/';
  const clean = incoming.replace(/^\/api\/?/, '');
  const normalized = clean.replace(/^\/|\/$/g, '');

  if (!normalized) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }

  const routeParts = normalized.split('/').filter(Boolean);
  const filePath = path.join(__dirname, '..', 'src', 'api', ...routeParts) + '.js';
  const routeFile = path.resolve(filePath);

  if (!existsSync(routeFile)) {
    return res.status(404).json({ error: `API route not found: /api/${normalized}` });
  }

  try {
    const module = await import(pathToFileURL(routeFile).href);
    const handlerFn = module.default || module.handler;
    if (typeof handlerFn !== 'function') {
      return res.status(500).json({ error: 'API route does not export a handler.' });
    }

    return await handlerFn(req, res);
  } catch (error) {
    console.error('[api-router]', error);
    return res.status(500).json({ error: error.message || 'API request failed.' });
  }
}

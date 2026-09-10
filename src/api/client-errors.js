const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });

  const payload = req.body || {};
  const message = String(payload.message || '').slice(0, 500);
  const source = String(payload.source || 'browser').slice(0, 80);
  const path = String(payload.path || '').slice(0, 300);

  if (!message) return json(res, 400, { ok: false, error: 'Error message is required.' });

  console.error('[client-error]', {
    source,
    path,
    message,
    status: Number.isFinite(Number(payload.status)) ? Number(payload.status) : undefined,
    timestamp: new Date().toISOString()
  });

  return json(res, 202, { ok: true });
}
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const host = String(req.query?.host || '').toLowerCase().trim();
  if (!host || host.length > 253 || /[^a-z0-9.-]/.test(host)) {
    return res.status(400).json({ error: 'A valid host is required.' });
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Store domain lookup is not configured.' });
  }

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('id')
    .or(`unbley_domain.eq.${host},custom_domain.eq.${host}`)
    .eq('store_active', true)
    .maybeSingle();

  if (error) {
    console.error('Store domain lookup failed:', error.message);
    return res.status(500).json({ error: 'Could not resolve store domain.' });
  }

  if (!data) return res.status(404).json({ error: 'Store domain not found.' });
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  return res.status(200).json({ storeId: data.id });
}

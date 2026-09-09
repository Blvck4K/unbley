import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  const expectedToken = process.env.STORE_OWNERS_EXPORT_TOKEN;
  const providedToken = req.headers['x-store-owners-token'] || req.query?.token;

  if (!expectedToken || providedToken !== expectedToken) {
    return json(res, 401, { error: 'Unauthorized.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 503, { error: 'Store owner export is not configured.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Store owner export failed:', error.message);
    return json(res, 500, { error: 'Could not load store owner details.' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return json(res, 200, {
    generated_at: new Date().toISOString(),
    count: data?.length || 0,
    data: data || []
  });
}
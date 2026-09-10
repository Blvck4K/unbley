import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const paymentId = req.body?.paymentId;
  if (!token || !paymentId) return res.status(400).json({ error: 'Authentication and payment reference are required.' });
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return res.status(401).json({ error: 'Invalid session.' });
  const { data, error } = await supabase.from('payment_records').select('id, order_id, provider_reference, status, metadata').eq('provider_reference', paymentId).eq('user_id', authData.user.id).maybeSingle();
  if (error) return res.status(500).json({ error: 'Could not read payment status.' });
  if (!data) return res.status(404).json({ error: 'Payment not found.' });
  return res.status(200).json({ orderId: data.order_id, paymentId: data.provider_reference, status: data.status, message: data.metadata?.message });
}

import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const signature = req.headers['x-paystack-signature'];
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const expected = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '').update(rawBody).digest('hex');
  const signatureBuffer = Buffer.from(String(signature || ''));
  const expectedBuffer = Buffer.from(expected);
  if (!signature || signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return res.status(401).json({ error: 'Invalid signature.' });

  const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (event?.event !== 'charge.success' || !event.data?.reference) return res.status(200).json({ received: true });
  const reference = event.data.reference;
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: payment, error } = await supabase.from('payment_records').select('id, order_id, amount, currency').eq('provider_reference', reference).maybeSingle();
  if (error || !payment) return res.status(200).json({ received: true });
  if (Number(event.data.amount) !== Math.round(Number(payment.amount) * 100) || event.data.currency !== payment.currency) return res.status(400).json({ error: 'Payment amount mismatch.' });
  const now = new Date().toISOString();
  await supabase.from('payment_records').update({ status: 'paid', paid_at: now, updated_at: now }).eq('id', payment.id).eq('status', 'pending');
  if (payment.order_id) await supabase.from('orders').update({ status: 'paid', transaction_id: reference, payment_method: 'paystack' }).eq('id', payment.order_id);
  return res.status(200).json({ received: true });
}

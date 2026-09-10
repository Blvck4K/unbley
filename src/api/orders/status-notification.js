import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => res.status(status).json(body);
const statuses = new Set(['paid', 'processing', 'shipped', 'delivered', 'cancelled']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const { orderId, status } = req.body || {};
  if (!token || !orderId || !statuses.has(status)) return json(res, 400, { error: 'Authentication, order, and valid status are required.' });
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return json(res, 503, { error: 'Order notification service is not configured.' });

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return json(res, 401, { error: 'Invalid session.' });

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, brand_id, order_number, customer_email, customer_name')
    .eq('id', orderId)
    .eq('brand_id', authData.user.id)
    .maybeSingle();
  if (orderError) return json(res, 500, { error: 'Could not load order.' });
  if (!order) return json(res, 404, { error: 'Order not found.' });
  if (!order.customer_email) return json(res, 200, { sent: false, reason: 'Customer has no email address.' });
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return json(res, 200, { sent: false, reason: 'Email provider is not configured.' });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [order.customer_email],
      subject: `Order ${order.order_number} update`,
      text: `Hello ${order.customer_name || 'there'},\n\nYour order ${order.order_number} is now: ${status.toUpperCase()}.\n\nThank you for shopping with us.`
    })
  });
  if (!response.ok) return json(res, 502, { error: 'Customer notification could not be sent.' });
  return json(res, 200, { sent: true });
}

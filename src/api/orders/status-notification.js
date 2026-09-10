import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../../lib/notifications/resend.js';
import { recordNotification } from '../../../lib/notifications/notificationStore.js';

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
    .select('id, brand_id, order_number, customer_email, customer_name, items')
    .eq('id', orderId)
    .eq('brand_id', authData.user.id)
    .maybeSingle();
  if (orderError) return json(res, 500, { error: 'Could not load order.' });
  if (!order) return json(res, 404, { error: 'Order not found.' });
  if (!order.customer_email) return json(res, 200, { sent: false, reason: 'Customer has no email address.' });
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return json(res, 200, { sent: false, reason: 'Email provider is not configured.' });

  const { data: brand, error: brandError } = await supabase
    .from('brand_profiles')
    .select('brand_name, logo_url')
    .eq('id', order.brand_id)
    .maybeSingle();
  if (brandError) return json(res, 500, { error: 'Could not load store branding.' });

  const subject = `Order ${order.order_number} update`;
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const storeName = brand?.brand_name || 'Unbley Store';
  const itemNames = (Array.isArray(order.items) ? order.items : []).map((item) => `${item.qty || 1}x ${item.title || item.name || 'Product'}`).join(', ');
  const text = `Hello ${order.customer_name || 'there'},\n\n${storeName} updated your order ${order.order_number}.\nStatus: ${statusLabel}.\nProducts: ${itemNames || 'Order items'}\nCustomer email: ${order.customer_email}\n\nThank you for shopping with us.`;
  const html = `<h1 style="margin:0 0 12px;color:#2b211c;font-size:26px;line-height:1.2;">Order status updated</h1>
    <p style="margin:0 0 22px;">Hello ${order.customer_name || 'there'}, <strong>${storeName}</strong> updated your order.</p>
    <div style="background:#f8f4ef;border-radius:10px;padding:18px 20px;">
      <div style="color:#75675e;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Order</div>
      <strong style="font-size:18px;">${order.order_number}</strong>
      <div style="margin-top:14px;color:#75675e;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Current status</div>
      <strong style="color:#8a552f;font-size:18px;">${statusLabel}</strong>
      <div style="margin-top:14px;color:#75675e;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Products</div>
      <div style="font-size:15px;">${itemNames || 'Order items'}</div>
    </div>
    <p style="margin:22px 0 0;color:#75675e;">Customer email: ${order.customer_email}<br />Thank you for shopping with us.</p>`;
  const result = await sendEmail({ to: order.customer_email, subject, html, text, storeName, storeLogoUrl: brand?.logo_url || undefined }).catch((error) => ({ ok: false, error: error.message }));

  await recordNotification({
    eventType: 'order_status_updated',
    templateSlug: 'order_status_updated',
    brandId: order.brand_id,
    orderId: order.id,
    recipient: order.customer_email,
    subject,
    body: text,
    html,
    providerMessageId: result?.data?.id || null,
    status: result?.ok ? 'sent' : 'failed',
    payload: { orderNumber: order.order_number, status },
    errorMessage: result?.error || null
  });

  if (!result.ok) return json(res, 502, { error: result.error || 'Customer notification could not be sent.' });
  return json(res, 200, { sent: true, messageId: result.data?.id || null });
}

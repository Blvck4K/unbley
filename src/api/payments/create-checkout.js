import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../../lib/notifications/resend.js';
import { recordNotification } from '../../lib/notifications/notificationStore.js';

const json = (res, status, body) => res.status(status).json(body);
const serverClient = () => createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.PAYSTACK_SECRET_KEY) return json(res, 503, { error: 'Payment service is not configured.' });

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return json(res, 401, { error: 'Authentication required.' });
  const supabase = serverClient();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return json(res, 401, { error: 'Invalid session.' });

  const { brandId, items, customer, provider = 'paystack' } = req.body || {};
  if (provider !== 'paystack') return json(res, 400, { error: 'This payment provider is not enabled on the server yet.' });
  if (!brandId || !Array.isArray(items) || items.length === 0 || !customer?.email) return json(res, 400, { error: 'Incomplete checkout details.' });

  const productIds = [...new Set(items.map((item) => item?.id).filter(Boolean))];
  const { data: products, error: productsError } = await supabase.from('products').select('id, brand_id, title, price, status').eq('brand_id', brandId).in('id', productIds);
  if (productsError) return json(res, 500, { error: 'Could not load products.' });
  const productMap = new Map((products || []).map((product) => [product.id, product]));
  const normalizedItems = [];
  let total = 0;
  for (const item of items) {
    const product = productMap.get(item?.id);
    const quantity = Number(item?.qty);
    if (!product || product.status !== 'active' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return json(res, 400, { error: 'Cart contains an unavailable product or invalid quantity.' });
    total += Number(product.price) * quantity;
    normalizedItems.push({ id: product.id, title: product.title, price: Number(product.price), qty: quantity, size: item.size || null, color: item.color || null });
  }

  const reference = `UNB-PSTK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const { data: order, error: orderError } = await supabase.from('orders').insert({ brand_id: brandId, order_number: orderNumber, total_amount: total, status: 'processing', product_name_snapshot: normalizedItems.map((item) => `${item.qty}x ${item.title}`).join(', '), customer_name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(), customer_email: customer.email, customer_phone: customer.phone || null, customer_address: customer.address || null, customer_city: customer.city || null, customer_zip: customer.zip || null, items: normalizedItems, payment_method: 'paystack' }).select('id').single();
  if (orderError) return json(res, 500, { error: 'Could not create pending order.' });

  const { error: paymentError } = await supabase.from('payment_records').insert({ order_id: order.id, user_id: authData.user.id, brand_id: brandId, provider: 'paystack', provider_reference: reference, amount: total, currency: 'NGN', status: 'pending', metadata: { customerEmail: customer.email } });
  if (paymentError) return json(res, 500, { error: 'Could not create payment record.' });

  const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', { method: 'POST', headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: customer.email, amount: Math.round(total * 100), currency: 'NGN', reference, callback_url: process.env.PAYSTACK_CALLBACK_URL || undefined, metadata: { orderId: order.id, paymentId: reference } }) });
  const payload = await paystackResponse.json().catch(() => ({}));
  if (!paystackResponse.ok || !payload.status) return json(res, 502, { error: 'Payment provider initialization failed.' });

  const { data: merchantProfile, error: merchantProfileError } = await supabase.from('brand_profiles').select('email_address, brand_name, owner_name').eq('id', brandId).maybeSingle();
  const merchantEmail = merchantProfile?.email_address || null;

  const subject = 'Your Unbley checkout is ready';
  const html = `<p>Hi ${customer.firstName || 'there'},</p><p>Your checkout has started.</p><p>Order reference: ${reference}</p><p>Amount: ₦${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>`;
  const text = `Hi ${customer.firstName || 'there'}, your Unbley checkout is ready. Order reference: ${reference}. Amount: ₦${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2 })}.`;
  const emailResult = await sendEmail({ to: customer.email, subject, html, text }).catch(() => ({ ok: false, skipped: true, error: 'Email send failed.' }));

  await recordNotification({
    eventType: 'checkout_started',
    templateSlug: 'checkout_started',
    userId: authData.user.id,
    brandId,
    orderId: order.id,
    recipient: customer.email,
    subject,
    body: text,
    html,
    channel: 'email',
    provider: 'resend',
    providerMessageId: emailResult?.data?.id || null,
    status: emailResult?.ok ? 'sent' : 'skipped',
    payload: { orderNumber, provider, reference, amount: total, items: normalizedItems },
    errorMessage: emailResult?.error || null
  });

  if (merchantEmail && !merchantProfileError) {
    const merchantSubject = `New order placed: ${orderNumber}`;
    const merchantHtml = `<p>Hi ${merchantProfile.owner_name || merchantProfile.brand_name || 'Merchant'},</p><p>A customer just placed a new order.</p><p>Order: ${orderNumber}</p><p>Reference: ${reference}</p><p>Amount: ₦${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p><p>Customer: ${customer.firstName || ''} ${customer.lastName || ''} (${customer.email})</p>`;
    const merchantText = `Hi ${merchantProfile.owner_name || merchantProfile.brand_name || 'Merchant'}, a customer just placed a new order. Order: ${orderNumber}. Reference: ${reference}. Amount: ₦${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2 })}. Customer: ${customer.email}.`;
    const merchantEmailResult = await sendEmail({ to: merchantEmail, subject: merchantSubject, html: merchantHtml, text: merchantText }).catch(() => ({ ok: false, skipped: true, error: 'Merchant notification email send failed.' }));

    await recordNotification({
      eventType: 'merchant_new_order',
      templateSlug: 'merchant_new_order',
      userId: authData.user.id,
      brandId,
      orderId: order.id,
      recipient: merchantEmail,
      subject: merchantSubject,
      body: merchantText,
      html: merchantHtml,
      channel: 'email',
      provider: 'resend',
      providerMessageId: merchantEmailResult?.data?.id || null,
      status: merchantEmailResult?.ok ? 'sent' : 'skipped',
      payload: { orderNumber, provider, reference, amount: total, customer: customer.email },
      errorMessage: merchantEmailResult?.error || null
    });
  }

  return json(res, 200, { orderId: order.id, paymentId: reference, checkoutUrl: payload.data.authorization_url, status: 'pending' });
}

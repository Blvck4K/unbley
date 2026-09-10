import { createClient } from '@supabase/supabase-js';

const json = (res, status, body) => res.status(status).json(body);
const serverClient = () => createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const getPlatformFeeConfig = () => {
  const percentage = Number(process.env.PLATFORM_FEE_PERCENTAGE ?? '0');
  const fixedAmount = Number(process.env.PLATFORM_FEE_FIXED_AMOUNT ?? '0');
  return {
    percentage: Number.isFinite(percentage) ? percentage : 0,
    fixedAmount: Number.isFinite(fixedAmount) ? fixedAmount : 0
  };
};

const calculatePlatformFeeMinor = (grossMinorAmount) => {
  const { percentage, fixedAmount } = getPlatformFeeConfig();
  const percentageFee = Math.floor((Number(grossMinorAmount || 0) * percentage) / 100);
  const fixedFeeMinor = Math.round(fixedAmount * 100);
  return Math.max(0, percentageFee + fixedFeeMinor);
};

const createLedgerEntries = async ({ supabase, merchantId, orderId, provider, reference, grossMinorAmount, settlementOffsetDays = 1 }) => {
  const { data: existingPayment, error: existingError } = await supabase
    .from('merchant_financial_transactions')
    .select('id')
    .eq('merchant_id', merchantId)
    .eq('provider_transaction_id', reference)
    .eq('type', 'PAYMENT')
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingPayment?.id) return;

  const platformFeeMinor = calculatePlatformFeeMinor(grossMinorAmount);
  const netMinorAmount = Math.max(0, Number(grossMinorAmount || 0) - platformFeeMinor);
  const now = new Date();
  const availableAt = new Date(now.getTime() + settlementOffsetDays * 24 * 60 * 60 * 1000).toISOString();

  const paymentInsert = {
    merchant_id: merchantId,
    order_id: orderId,
    payment_provider: provider,
    provider_transaction_id: reference,
    type: 'PAYMENT',
    amount: netMinorAmount,
    currency: 'NGN',
    status: 'PENDING',
    available_at: availableAt,
    metadata: {
      grossAmountMinor: Number(grossMinorAmount || 0),
      platformFeeMinor: platformFeeMinor,
      settlementOffsetDays
    }
  };

  const feeInsert = {
    merchant_id: merchantId,
    order_id: orderId,
    payment_provider: provider,
    provider_transaction_id: reference,
    type: 'PLATFORM_FEE',
    amount: -Math.abs(platformFeeMinor),
    currency: 'NGN',
    status: 'POSTED',
    available_at: null,
    metadata: { grossAmountMinor: Number(grossMinorAmount || 0) }
  };

  const { error: paymentLedgerError } = await supabase.from('merchant_financial_transactions').insert(paymentInsert);
  if (paymentLedgerError) throw paymentLedgerError;

  if (platformFeeMinor > 0) {
    const { error: feeLedgerError } = await supabase.from('merchant_financial_transactions').insert(feeInsert);
    if (feeLedgerError) throw feeLedgerError;
  }
};

const clean = (value, pattern = /[^a-zA-Z0-9, .+@_-]/g) => String(value || '').replace(pattern, '').trim();

const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function verifyPayment(provider, reference, expectedAmount) {
  if (provider === 'paystack') {
    if (!process.env.PAYSTACK_SECRET_KEY) throw new Error('Paystack verification is not configured.');
    if (!/^(sk_test_|sk_live_)/.test(process.env.PAYSTACK_SECRET_KEY)) {
      throw new Error('Paystack verification is misconfigured: PAYSTACK_SECRET_KEY must be a secret key starting with sk_test_ or sk_live_.');
    }
    let response;
    let payload;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      });
      payload = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error('Paystack rejected PAYSTACK_SECRET_KEY. Use the matching sk_test_ or sk_live_ secret key.');
      if (response.ok && payload.status && payload.data?.status === 'success') break;
      if (attempt === 0 && response.status === 400) await wait(1200);
    }
    if (!response.ok || !payload.status || payload.data?.status !== 'success') {
      throw new Error(payload.message || payload.data?.gateway_response || `Paystack could not verify this transaction (${response.status}).`);
    }
    if (payload.data.currency !== 'NGN' || Number(payload.data.amount) !== Math.round(expectedAmount * 100)) throw new Error('Payment amount could not be verified.');
    return payload.data.reference;
  }

  if (provider === 'flutterwave') {
    if (!process.env.FLUTTERWAVE_SECRET_KEY) throw new Error('Flutterwave verification is not configured.');
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(reference)}/verify`, {
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` }
    });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('Flutterwave rejected FLUTTERWAVE_SECRET_KEY. Use the matching test or live secret key from the same Flutterwave account.');
    const payment = payload.data;
    if (!response.ok || payload.status !== 'success' || payment?.status !== 'successful') {
      throw new Error(payload.message || payment?.processor_response || `Flutterwave could not verify this transaction (${response.status}).`);
    }
    if (payment.currency !== 'NGN' || Number(payment.amount) !== Number(expectedAmount)) throw new Error('Payment amount could not be verified.');
    return String(payment.id || reference);
  }

  throw new Error('Unsupported payment provider.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return json(res, 503, { error: 'Order service is not configured.' });

  const { brandId, items, customer, provider = 'paystack', transactionReference } = req.body || {};
  if (!brandId || !Array.isArray(items) || items.length === 0 || !customer?.email || !transactionReference) {
    return json(res, 400, { error: 'Incomplete order details.' });
  }

  try {
    const supabase = serverClient();
    const { data: brandRecord, error: brandError } = await supabase
      .from('brand_profiles')
      .select('id, brand_name, email_address, owner_name')
      .eq('id', brandId)
      .maybeSingle();
    if (brandError) return json(res, 500, { error: 'Could not load the store for this order.' });
    if (!brandRecord) return json(res, 400, { error: 'The selected store could not be found.' });

    let deliveryDuration = null;
    const { data: deliveryProfile } = await supabase
      .from('brand_profiles')
      .select('delivery_duration')
      .eq('id', brandId)
      .maybeSingle();
    if (deliveryProfile?.delivery_duration) deliveryDuration = deliveryProfile.delivery_duration;

    // Keep checkout usable before the optional shipping_fee migration is applied.
    let configuredShippingFee = 0;
    const { data: shippingProfile } = await supabase
      .from('brand_profiles')
      .select('shipping_fee')
      .eq('id', brandId)
      .maybeSingle();
    if (shippingProfile?.shipping_fee !== undefined && shippingProfile?.shipping_fee !== null) {
      configuredShippingFee = Number(shippingProfile.shipping_fee);
    }
    const shippingFee = Math.max(0, Number.isFinite(configuredShippingFee) ? configuredShippingFee : 0);
    const productIds = [...new Set(items.map(item => item?.id).filter(Boolean))];
    if (productIds.length !== items.length) return json(res, 400, { error: 'Cart contains invalid products.' });

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, brand_id, title, price, status, image_url')
      .eq('brand_id', brandId)
      .in('id', productIds);
    if (productsError) return json(res, 500, { error: 'Could not load products.' });

    const productMap = new Map((products || []).map(product => [product.id, product]));
    const normalizedItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = productMap.get(item?.id);
      const quantity = Number(item?.qty);
      if (!product || product.status !== 'active' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return json(res, 400, { error: 'Cart contains an unavailable product or invalid quantity.' });
      }
      const price = Number(product.price);
      subtotal += price * quantity;
      normalizedItems.push({ id: product.id, name: product.title, title: product.title, price, qty: quantity, image_url: product.image_url || null, size: item.size || null, color: item.color || null, fulfillment_status: 'paid' });
    }

    const total = subtotal + shippingFee;
    const verifiedReference = await verifyPayment(provider, transactionReference, total);
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('transaction_id', verifiedReference)
      .maybeSingle();
    if (existingOrder) return json(res, 200, { order: existingOrder, alreadyExists: true });

    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const customerName = clean(`${customer.firstName || ''} ${customer.lastName || ''}`);
    const order = {
      brand_id: brandId,
      order_number: orderNumber,
      total_amount: total,
      shipping_fee: shippingFee,
      delivery_duration: deliveryDuration,
      status: 'paid',
      product_name_snapshot: normalizedItems.map(item => `${item.qty}x ${item.title}`).join(', '),
      customer_name: customerName,
      customer_email: clean(customer.email),
      customer_phone: clean(customer.phone, /[^0-9+]/g),
      customer_address: clean(customer.address),
      customer_address_line: clean(customer.address),
      customer_state: clean(customer.state),
      customer_city: clean(customer.city),
      customer_zip: clean(customer.zip),
      items: normalizedItems,
      transaction_id: verifiedReference,
      payment_method: provider,
      confirmation_status: 'confirmed',
      confirmed_at: new Date().toISOString()
    };

    let { data: savedOrder, error: orderError } = await supabase.from('orders').insert(order).select('*').single();

    if (!orderError && savedOrder) {
      await createLedgerEntries({
        supabase,
        merchantId: brandId,
        orderId: savedOrder.id,
        provider,
        reference: verifiedReference,
        grossMinorAmount: Math.round(Number(total) * 100),
        settlementOffsetDays: Number(process.env.SETTLEMENT_OFFSET_DAYS ?? '1')
      });
    }

    // Older deployments may not have the optional fulfillment columns yet.
    // Keep a verified payment recoverable by retrying with the legacy order shape.
    if (orderError && orderError.code === '23505' && /transaction_id|orders_transaction_id_unique_idx/i.test(orderError.message || '')) {
      const { data: duplicateOrder, error: duplicateLookupError } = await supabase
        .from('orders')
        .select('*')
        .eq('transaction_id', verifiedReference)
        .maybeSingle();
      if (!duplicateLookupError && duplicateOrder) return json(res, 200, { order: duplicateOrder, alreadyExists: true });
    }

    if (orderError && /column .* does not exist|schema cache/i.test(orderError.message || '')) {
      const legacyOrder = { ...order };
      delete legacyOrder.shipping_fee;
      delete legacyOrder.delivery_duration;
      delete legacyOrder.customer_state;
      delete legacyOrder.customer_address_line;
      delete legacyOrder.confirmation_status;
      delete legacyOrder.confirmation_error;
      delete legacyOrder.confirmed_at;
      const legacyResult = await supabase.from('orders').insert(legacyOrder).select('*').single();
      savedOrder = legacyResult.data;
      orderError = legacyResult.error;
    }

    if (orderError) {
      console.error('Order save failed after verified payment:', orderError);
      return json(res, 500, { error: `Payment was verified, but the order could not be saved: ${orderError.message || 'database error'}` });
    }
    return json(res, 200, { order: savedOrder });
  } catch (error) {
    return json(res, 400, { error: error.message || 'Could not confirm payment.' });
  }
}

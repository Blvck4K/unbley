import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { calculateCommerceFees, CUSTOMER_PAYS_PAYMENT_FEE } from '../../../src/lib/commerceFees.js';

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
  if (payment.order_id) {
    const { data: orderRecord } = await supabase.from('orders').select('brand_id, total_amount, subtotal, shipping_fee, gateway_payment_fee, platform_revenue, payment_fee_responsibility').eq('id', payment.order_id).maybeSingle();
    await supabase.from('orders').update({ status: 'paid', transaction_id: reference, payment_method: 'paystack' }).eq('id', payment.order_id);

    if (orderRecord?.brand_id) {
      const settlementOffsetDays = Number(process.env.SETTLEMENT_OFFSET_DAYS ?? '1');
      const grossMinorAmount = Math.round(Number(orderRecord.total_amount || 0) * 100);
      const commerceFees = calculateCommerceFees({
        subtotal: orderRecord.subtotal ?? Math.max(0, Number(orderRecord.total_amount || 0) - Number(orderRecord.shipping_fee || 0)),
        deliveryFee: orderRecord.shipping_fee,
        provider: 'paystack',
        responsibility: orderRecord.payment_fee_responsibility || CUSTOMER_PAYS_PAYMENT_FEE,
        env: process.env
      });
      const platformFeeMinor = Math.round((Number(orderRecord.platform_revenue ?? commerceFees.platformRevenue) || 0) * 100);
      const gatewayFeeMinor = Math.round((Number(orderRecord.gateway_payment_fee ?? commerceFees.gatewayFee) || 0) * 100);
      const netMinorAmount = Math.max(0, grossMinorAmount - platformFeeMinor - gatewayFeeMinor);
      const availableAt = new Date(Date.now() + settlementOffsetDays * 24 * 60 * 60 * 1000).toISOString();

      const { data: existingLedger } = await supabase
        .from('merchant_financial_transactions')
        .select('id')
        .eq('merchant_id', orderRecord.brand_id)
        .eq('provider_transaction_id', reference)
        .eq('type', 'PAYMENT')
        .maybeSingle();

      if (!existingLedger?.id) {
        await supabase.from('merchant_financial_transactions').insert({
          merchant_id: orderRecord.brand_id,
          order_id: payment.order_id,
          payment_provider: 'paystack',
          provider_transaction_id: reference,
          type: 'PAYMENT',
          amount: netMinorAmount,
          currency: 'NGN',
          status: 'PENDING',
          available_at: availableAt,
          metadata: { grossAmountMinor: grossMinorAmount, platformFeeMinor, gatewayFeeMinor, settlementOffsetDays }
        });

        if (platformFeeMinor > 0) {
          await supabase.from('merchant_financial_transactions').insert({
            merchant_id: orderRecord.brand_id,
            order_id: payment.order_id,
            payment_provider: 'paystack',
            provider_transaction_id: reference,
            type: 'PLATFORM_FEE',
            amount: -Math.abs(platformFeeMinor),
            currency: 'NGN',
            status: 'POSTED',
            metadata: { grossAmountMinor: grossMinorAmount, gatewayFeeMinor }
          });
        }
      }
    }
  }
  return res.status(200).json({ received: true });
}

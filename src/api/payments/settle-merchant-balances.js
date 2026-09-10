import { getProviderPayoutAdapter, getSettlementOffsetDays, serverClient, createMerchantLedgerEntry, createPayoutAttemptEntry } from './settlement-lib.js';

const json = (res, status, body) => res.status(status).json(body);

const getRetryLimit = () => {
  const parsed = Number(process.env.MERCHANT_PAYOUT_RETRY_LIMIT ?? '3');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
};

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 503, { error: 'Settlement service is not configured.' });
  }

  try {
    const supabase = serverClient();
    const offsetDays = getSettlementOffsetDays();
    const now = new Date();
    const retryLimit = getRetryLimit();

    const { data: eligiblePayments, error } = await supabase
      .from('merchant_financial_transactions')
      .select('*')
      .eq('type', 'PAYMENT')
      .eq('status', 'PENDING')
      .lte('available_at', now.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const results = [];
    for (const payment of eligiblePayments || []) {
      const merchantId = payment.merchant_id;
      const merchantResult = await supabase
        .from('brand_profiles')
        .select('id, payout_bank_name, payout_account_number, payout_account_name, payout_bank_code, payout_provider, payout_recipient_code, paystack_subaccount_code, flutterwave_subaccount_code')
        .eq('id', merchantId)
        .maybeSingle();

      if (merchantResult.error) throw merchantResult.error;
      const merchant = merchantResult.data;
      if (!merchant || !merchant.payout_bank_name || !merchant.payout_account_number || !merchant.payout_account_name) {
        results.push({ merchantId, status: 'skipped', reason: 'missing_payout_account' });
        continue;
      }

      const payoutAmount = Number(payment.amount || 0);
      const provider = merchant.payout_provider || payment.payment_provider || 'paystack';
      const providerRecipientCode = provider === 'flutterwave'
        ? merchant.flutterwave_subaccount_code || merchant.payout_recipient_code || merchant.payout_bank_code
        : merchant.payout_recipient_code || merchant.paystack_subaccount_code || merchant.payout_bank_code;
      const transferReference = `UNB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const payoutRef = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      if (!providerRecipientCode) {
        results.push({ merchantId, status: 'skipped', reason: `missing_${provider}_payout_code` });
        continue;
      }

      const { data: existingPayout, error: existingError } = await supabase
        .from('merchant_payouts')
        .select('*')
        .eq('merchant_id', merchantId)
        .eq('metadata->>settlementPaymentId', String(payment.id))
        .maybeSingle();

      if (existingError) throw existingError;

      let payoutRecord = existingPayout;
      if (!payoutRecord) {
        const { data: createdPayout, error: payoutError } = await supabase
          .from('merchant_payouts')
          .insert({
            merchant_id: merchantId,
            payout_reference: payoutRef,
            provider,
            amount: payoutAmount,
            currency: 'NGN',
            status: 'PENDING',
            provider_recipient_code: providerRecipientCode,
            provider_transfer_reference: transferReference,
            available_at: payment.available_at,
            retry_count: 0,
            metadata: { orderId: payment.order_id, transactionId: payment.provider_transaction_id, settlementPaymentId: payment.id, providerPayload: {} }
          })
          .select('*')
          .single();

        if (payoutError) throw payoutError;
        payoutRecord = createdPayout;
      }

      const nextAttempt = Number(payoutRecord.retry_count || 0) + 1;
      if (payoutRecord.status === 'FAILED' && nextAttempt > retryLimit) {
        results.push({ merchantId, status: 'blocked', reason: 'max_retries_exceeded', payoutReference: payoutRecord.payout_reference, retryCount: payoutRecord.retry_count || 0 });
        continue;
      }

      try {
        const adapter = getProviderPayoutAdapter(provider);
        await createPayoutAttemptEntry({
          supabase,
          payoutId: payoutRecord.id,
          attemptNumber: nextAttempt,
          status: 'PROCESSING'
        });

        const payload = await adapter.initiateTransfer({
          recipientCode: providerRecipientCode,
          amountMinor: payoutAmount,
          reason: `Settlement for merchant ${merchantId}`,
          reference: transferReference
        });

        const payoutStatus = payload?.status === 'success' || payload?.status === 'SUCCESS' || payload?.status === 'successful' ? 'SUCCESS' : 'PROCESSING';
        const providerTransferRef = payload?.reference || payload?.id || transferReference;

        await supabase
          .from('merchant_payouts')
          .update({
            status: payoutStatus,
            provider_recipient_code: providerRecipientCode,
            provider_transfer_reference: providerTransferRef,
            failure_reason: null,
            retry_count: nextAttempt,
            updated_at: now.toISOString(),
            metadata: {
              ...(payoutRecord.metadata || {}),
              orderId: payment.order_id,
              transactionId: payment.provider_transaction_id,
              settlementPaymentId: payment.id,
              providerPayload: payload || {}
            }
          })
          .eq('id', payoutRecord.id);

        await createPayoutAttemptEntry({
          supabase,
          payoutId: payoutRecord.id,
          attemptNumber: nextAttempt,
          status: payoutStatus === 'SUCCESS' ? 'SUCCESS' : 'PENDING',
          providerResponse: payload || {}
        });

        await createMerchantLedgerEntry({
          supabase,
          merchantId,
          orderId: payment.order_id,
          paymentProvider: provider,
          providerTransactionId: payoutRecord.payout_reference,
          type: 'PAYOUT',
          amount: -Math.abs(payoutAmount),
          status: payoutStatus,
          metadata: { payoutId: payoutRecord.id, settlementReference: providerTransferRef }
        });

        if (payoutStatus === 'SUCCESS') {
          await supabase
            .from('merchant_financial_transactions')
            .update({ status: 'AVAILABLE', available_at: now.toISOString(), updated_at: now.toISOString() })
            .eq('id', payment.id)
            .eq('status', 'PENDING');
        } else {
          await supabase
            .from('merchant_financial_transactions')
            .update({ status: 'PENDING', updated_at: now.toISOString() })
            .eq('id', payment.id)
            .eq('status', 'PENDING');
        }

        results.push({ merchantId, status: payoutStatus, payoutId: payoutRecord.id, amount: payoutAmount, retryCount: nextAttempt });
      } catch (error) {
        const failedRetryCount = Number(payoutRecord.retry_count || 0) + 1;
        const shouldBlock = failedRetryCount >= retryLimit;

        await createPayoutAttemptEntry({
          supabase,
          payoutId: payoutRecord.id,
          attemptNumber: failedRetryCount,
          status: 'FAILED',
          errorMessage: error.message || 'Payout transfer failed',
          providerResponse: { error: error.message || 'Payout transfer failed' }
        });

        await supabase
          .from('merchant_payouts')
          .update({
            status: shouldBlock ? 'FAILED' : 'PENDING',
            failure_reason: String(error.message || 'Payout transfer failed').slice(0, 500),
            retry_count: failedRetryCount,
            updated_at: now.toISOString()
          })
          .eq('id', payoutRecord.id);

        await createMerchantLedgerEntry({
          supabase,
          merchantId,
          orderId: payment.order_id,
          paymentProvider: provider,
          providerTransactionId: `${payoutRecord.payout_reference}-failed-${failedRetryCount}`,
          type: 'PAYOUT_FAILED',
          amount: -Math.abs(payoutAmount),
          status: 'FAILED',
          metadata: {
            payoutId: payoutRecord.id,
            settlementPaymentId: payment.id,
            reason: error.message || 'Payout transfer failed',
            retryCount: failedRetryCount
          }
        });

        results.push({ merchantId, status: shouldBlock ? 'failed' : 'retry_scheduled', reason: error.message || 'Payout transfer failed', payoutReference: payoutRecord.payout_reference, retryCount: failedRetryCount });
      }
    }

    return json(res, 200, { ok: true, offsetDays, processed: results.length, results });
  } catch (error) {
    console.error('Settlement service failed:', error);
    return json(res, 500, { error: error.message || 'Settlement processing failed.' });
  }
}

import { createClient } from '@supabase/supabase-js';

export const serverClient = () => createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export const toMinorUnits = (value) => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.round(numericValue * 100);
};

export const fromMinorUnits = (value) => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) return 0;
  return numericValue / 100;
};

export const getPlatformFeeConfig = () => {
  const percentage = Number(process.env.PLATFORM_FEE_PERCENTAGE ?? '0');
  const fixedAmount = Number(process.env.PLATFORM_FEE_FIXED_AMOUNT ?? '0');
  return {
    percentage: Number.isFinite(percentage) ? percentage : 0,
    fixedAmount: Number.isFinite(fixedAmount) ? fixedAmount : 0
  };
};

export const calculatePlatformFee = (grossMinorAmount) => {
  const { percentage, fixedAmount } = getPlatformFeeConfig();
  const gross = Number(grossMinorAmount ?? 0);
  const percentageFee = Math.floor((gross * percentage) / 100);
  const fixedFeeMinor = Math.round(fixedAmount * 100);
  return Math.max(0, percentageFee + fixedFeeMinor);
};

export const getSettlementOffsetDays = () => {
  const parsed = Number(process.env.SETTLEMENT_OFFSET_DAYS ?? '1');
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1;
};

const normalizeBankName = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '');

const resolveBankCode = async ({ provider, bankName, secretKey }) => {
  const target = normalizeBankName(bankName);
  const url = provider === 'paystack'
    ? 'https://api.paystack.co/bank'
    : 'https://api.flutterwave.com/v3/banks/NG';
  const response = await fetch(url, { headers: { Authorization: `Bearer ${secretKey}` } });
  const payload = await response.json().catch(() => ({}));
  const banks = Array.isArray(payload?.data) ? payload.data : [];
  const match = banks.find((bank) => normalizeBankName(bank.name) === target)
    || banks.find((bank) => normalizeBankName(bank.name).includes(target) || target.includes(normalizeBankName(bank.name)));
  if (!match?.code) throw new Error(`Could not resolve bank code for ${bankName}.`);
  return String(match.code);
};

export const nextSettlementAt = (offsetDays = getSettlementOffsetDays()) => {
  const ms = Number(offsetDays || 0) * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms).toISOString();
};

export const createMerchantLedgerEntry = async ({
  supabase,
  merchantId,
  orderId = null,
  paymentProvider,
  providerTransactionId,
  type,
  amount,
  status = 'POSTED',
  availableAt = null,
  metadata = {}
}) => {
  if (!merchantId || !paymentProvider || !providerTransactionId || !type || amount === undefined || amount === null) {
    throw new Error('Incomplete merchant ledger payload.');
  }

  const existing = await supabase
    .from('merchant_financial_transactions')
    .select('id')
    .eq('merchant_id', merchantId)
    .eq('provider_transaction_id', providerTransactionId)
    .eq('type', type)
    .maybeSingle();

  if (existing?.error) {
    throw existing.error;
  }

  if (existing?.data?.id) {
    return existing.data;
  }

  const payload = {
    merchant_id: merchantId,
    order_id: orderId,
    payment_provider: paymentProvider,
    provider_transaction_id: providerTransactionId,
    type,
    amount: Number(amount),
    currency: 'NGN',
    status,
    available_at: availableAt || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: metadata || {}
  };

  const { data, error } = await supabase
    .from('merchant_financial_transactions')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createPayoutAttemptEntry = async ({
  supabase,
  payoutId,
  attemptNumber,
  status = 'PENDING',
  errorMessage = null,
  providerResponse = null
}) => {
  if (!payoutId || !attemptNumber) {
    throw new Error('Incomplete payout attempt payload.');
  }

  const { data, error } = await supabase
    .from('merchant_payout_attempts')
    .insert({
      payout_id: payoutId,
      attempt_number: Number(attemptNumber),
      status,
      error_message: errorMessage || null,
      provider_response: providerResponse || {}
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const recordRefundLedgerEntry = async ({
  supabase,
  merchantId,
  orderId = null,
  paymentProvider,
  providerTransactionId,
  amount,
  reason = 'refund',
  metadata = {}
}) => {
  if (!merchantId || !paymentProvider || !providerTransactionId || amount === undefined || amount === null) {
    throw new Error('Incomplete refund ledger payload.');
  }

  return createMerchantLedgerEntry({
    supabase,
    merchantId,
    orderId,
    paymentProvider,
    providerTransactionId: String(providerTransactionId),
    type: 'REFUND',
    amount: -Math.abs(Number(amount)),
    status: 'POSTED',
    metadata: {
      ...metadata,
      reason
    }
  });
};

export const getProviderPayoutAdapter = (provider) => {
  if (provider === 'paystack') {
    return {
      async createTransferRecipient({ accountNumber, bankCode, accountName, reason }) {
        if (!process.env.PAYSTACK_SECRET_KEY) {
          throw new Error('Paystack payout is not configured.');
        }

        const response = await fetch('https://api.paystack.co/transferrecipient', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'nuban',
            name: accountName,
            account_number: String(accountNumber).replace(/\D/g, ''),
            bank_code: String(bankCode),
            currency: 'NGN',
            description: reason || 'Unbley merchant payout'
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || 'Paystack transfer recipient creation failed.');
        }

        return {
          recipientCode: payload?.data?.recipient_code,
          providerResponse: payload?.data
        };
      },

      async initiateTransfer({ bankName, accountNumber, accountName, amountMinor, reason, reference }) {
        if (!process.env.PAYSTACK_SECRET_KEY) {
          throw new Error('Paystack payout is not configured.');
        }

        const bankCode = await resolveBankCode({ provider: 'paystack', bankName, secretKey: process.env.PAYSTACK_SECRET_KEY });
        const recipient = await this.createTransferRecipient({
          accountNumber,
          bankCode,
          accountName,
          reason
        });
        if (!recipient.recipientCode) throw new Error('Paystack did not return a transfer recipient code.');

        const response = await fetch('https://api.paystack.co/transfer', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'balance',
            amount: Number(amountMinor),
            recipient: recipient.recipientCode,
            reason: reason || 'Unbley merchant settlement',
            currency: 'NGN',
            reference
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || 'Paystack transfer failed.');
        }

        return payload?.data || payload;
      }
    };
  }

  if (provider === 'flutterwave') {
    return {
      async createTransferRecipient({ accountNumber, bankCode, accountName, reason }) {
        if (!process.env.FLUTTERWAVE_SECRET_KEY) {
          throw new Error('Flutterwave payout is not configured.');
        }

        const response = await fetch('https://api.flutterwave.com/v3/beneficiaries', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            account_number: String(accountNumber).replace(/\D/g, ''),
            account_bank: String(bankCode),
            beneficiary_name: accountName,
            bank_name: reason || 'Unbley payout',
            currency: 'NGN'
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || 'Flutterwave beneficiary setup failed.');
        }

        return {
          recipientCode: payload?.data?.beneficiary_id || payload?.data?.id,
          providerResponse: payload?.data
        };
      },

      async initiateTransfer({ bankName, accountNumber, amountMinor, reason, reference }) {
        if (!process.env.FLUTTERWAVE_SECRET_KEY) {
          throw new Error('Flutterwave payout is not configured.');
        }

        const bankCode = await resolveBankCode({ provider: 'flutterwave', bankName, secretKey: process.env.FLUTTERWAVE_SECRET_KEY });

        const response = await fetch('https://api.flutterwave.com/v3/transfers', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            account_bank: bankCode,
            account_number: String(accountNumber).replace(/\D/g, ''),
            amount: Number(amountMinor) / 100,
            narration: reason || 'Unbley merchant settlement',
            currency: 'NGN',
            reference,
            beneficiary_name: 'Unbley Merchant'
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || 'Flutterwave transfer failed.');
        }

        return payload?.data || payload;
      }
    };
  }

  throw new Error(`Unsupported payout provider: ${provider}`);
};

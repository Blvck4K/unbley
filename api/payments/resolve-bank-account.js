const normalizeBankName = (value = '') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')
  .trim();

const findBankCodeFromPaystack = async (bankName, secretKey) => {
  const target = normalizeBankName(bankName);
  if (!target) return '';

  const bankListResponse = await fetch('https://api.paystack.co/bank', {
    headers: { Authorization: `Bearer ${secretKey}` }
  });

  const bankListPayload = await bankListResponse.json().catch(() => ({}));
  const banks = Array.isArray(bankListPayload?.data) ? bankListPayload.data : [];

  const directMatch = banks.find((bank) => normalizeBankName(bank.name) === target);
  if (directMatch?.code) return String(directMatch.code);

  const fuzzyMatch = banks.find((bank) => {
    const bankName = normalizeBankName(bank.name);
    return bankName.includes(target) || target.includes(bankName);
  });

  if (fuzzyMatch?.code) return String(fuzzyMatch.code);

  return '';
};

const findBankCodeFromFlutterwave = async (bankName, secretKey) => {
  const target = normalizeBankName(bankName);
  if (!target || !secretKey) return '';

  const bankListResponse = await fetch('https://api.flutterwave.com/v3/banks/NG', {
    headers: { Authorization: `Bearer ${secretKey}` }
  });

  const bankListPayload = await bankListResponse.json().catch(() => ({}));
  const banks = Array.isArray(bankListPayload?.data) ? bankListPayload.data : [];

  const directMatch = banks.find((bank) => normalizeBankName(bank.name) === target);
  if (directMatch?.code) return String(directMatch.code);

  const fuzzyMatch = banks.find((bank) => {
    const bankName = normalizeBankName(bank.name);
    return bankName.includes(target) || target.includes(bankName);
  });

  if (fuzzyMatch?.code) return String(fuzzyMatch.code);

  return '';
};

const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

  const { account_number, bank_code, bank_name } = req.body || {};
  const cleanAccountNumber = String(account_number || '').replace(/\D/g, '');
  const rawBankName = String(bank_name || '').trim();
  let resolvedBankCode = String(bank_code || '').trim();

  if (!cleanAccountNumber || cleanAccountNumber.length < 10) {
    return json(res, 400, { error: 'Please enter a valid account number.' });
  }

  if (!resolvedBankCode && rawBankName) {
    try {
      resolvedBankCode = await findBankCodeFromPaystack(rawBankName, process.env.PAYSTACK_SECRET_KEY || '');
      if (!resolvedBankCode) {
        resolvedBankCode = await findBankCodeFromFlutterwave(rawBankName, process.env.FLUTTERWAVE_SECRET_KEY || '');
      }
    } catch (error) {
      console.error('Bank lookup failed:', error);
    }
  }

  if (!resolvedBankCode) {
    return json(res, 400, { error: 'Please select a valid bank and enter a valid account number.' });
  }

  const providers = [];
  if (process.env.PAYSTACK_SECRET_KEY) providers.push({ name: 'paystack', secret: process.env.PAYSTACK_SECRET_KEY, url: 'https://api.paystack.co/bank/resolve', body: { account_number: cleanAccountNumber, bank_code: resolvedBankCode } });
  if (process.env.FLUTTERWAVE_SECRET_KEY) providers.push({ name: 'flutterwave', secret: process.env.FLUTTERWAVE_SECRET_KEY, url: 'https://api.flutterwave.com/v3/accounts/resolve', body: { account_number: cleanAccountNumber, account_bank: resolvedBankCode } });

  if (providers.length === 0) {
    return json(res, 503, { error: 'Account verification is not configured.' });
  }

  try {
    for (const provider of providers) {
      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${provider.secret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(provider.body)
      });

      const payload = await response.json().catch(() => ({}));
      const accountName = provider.name === 'paystack' ? payload?.data?.account_name : payload?.data?.account_name;
      if (response.ok && payload?.status !== false && accountName) {
        return json(res, 200, {
          account_name: String(accountName).trim(),
          bank_code: resolvedBankCode,
          account_number: cleanAccountNumber,
          provider: provider.name
        });
      }
    }

    const errorMessage = providers[0]?.name === 'paystack'
      ? 'We could not verify that account number. Please check your details and try again.'
      : 'We could not verify that account number with the configured bank provider. Please check your details and try again.';

    return json(res, 400, { error: errorMessage });
  } catch (error) {
    return json(res, 500, {
      error: 'Unable to verify your bank account right now. Please try again in a moment.'
    });
  }
}

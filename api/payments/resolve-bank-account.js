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

const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  if (!process.env.PAYSTACK_SECRET_KEY) return json(res, 503, { error: 'Paystack verification is not configured.' });

  const { account_number, bank_code, bank_name } = req.body || {};
  const cleanAccountNumber = String(account_number || '').replace(/\D/g, '');
  const rawBankName = String(bank_name || '').trim();
  let resolvedBankCode = String(bank_code || '').trim();

  if (!cleanAccountNumber || cleanAccountNumber.length < 10) {
    return json(res, 400, { error: 'Please enter a valid account number.' });
  }

  if (!resolvedBankCode && rawBankName) {
    try {
      resolvedBankCode = await findBankCodeFromPaystack(rawBankName, process.env.PAYSTACK_SECRET_KEY);
    } catch (error) {
      console.error('Paystack bank lookup failed:', error);
    }
  }

  if (!resolvedBankCode) {
    return json(res, 400, { error: 'Please select a valid bank and enter a valid account number.' });
  }

  try {
    const response = await fetch('https://api.paystack.co/bank/resolve', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account_number: cleanAccountNumber, bank_code: resolvedBankCode })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.status || !payload.data?.account_name) {
      return json(res, 400, { error: payload.message || 'We could not verify that account number. Please check your details and try again.' });
    }

    return json(res, 200, {
      account_name: payload.data.account_name,
      bank_code: payload.data.bank_code || resolvedBankCode,
      account_number: cleanAccountNumber
    });
  } catch (error) {
    return json(res, 500, {
      error: 'Unable to verify your bank account right now. Please try again in a moment.'
    });
  }
}

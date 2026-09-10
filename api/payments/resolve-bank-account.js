const BANK_NAME_TO_CODE = {
  'Access Bank': '044',
  'ALAT by WEMA': '035',
  'Apex MFB': '770',
  'ASO Savings': '401',
  'Citibank Nigeria': '023',
  'Ecobank Nigeria': '050',
  'Fidelity Bank': '070',
  'First Bank of Nigeria': '011',
  'FCMB': '214',
  'Globus Bank': '00103',
  'Greenwich Bank': '562',
  'GTBank': '058',
  'Jaiz Bank': '301',
  'Keystone Bank': '082',
  'Kuda MFB': '50211',
  'Lotus Bank': '303',
  'Moniepoint MFB': '110',
  'Opay': '329',
  'PalmPay': '999991',
  'Parkway - ReadyCash': '311',
  'Paycom': '559',
  'Polaris Bank': '076',
  'Providus Bank': '101',
  'Rubies MFB': '125',
  'Sparkle Microfinance Bank': '377',
  'Stanbic IBTC': '221',
  'Sterling Bank': '232',
  'SunTrust Bank': '100',
  'TAJ Bank': '302',
  'Titan Trust Bank': '102',
  'UBA': '033',
  'Union Bank': '032',
  'Unity Bank': '215',
  'Wema Bank': '035',
  'Zenith Bank': '057'
};

const normalizeBankName = (value = '') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')
  .trim();

const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  if (!process.env.PAYSTACK_SECRET_KEY) return json(res, 503, { error: 'Paystack verification is not configured.' });

  const { account_number, bank_code, bank_name } = req.body || {};
  const cleanAccountNumber = String(account_number || '').replace(/\D/g, '');
  let resolvedBankCode = String(bank_code || '').trim();

  if (!resolvedBankCode && bank_name) {
    const normalizedName = String(bank_name).trim();
    resolvedBankCode = BANK_NAME_TO_CODE[normalizedName] || '';
  }

  if (!cleanAccountNumber || cleanAccountNumber.length < 10) {
    return json(res, 400, { error: 'Please enter a valid account number.' });
  }

  if (!resolvedBankCode && bank_name) {
    try {
      const bankListResponse = await fetch('https://api.paystack.co/bank', {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      });
      const bankListPayload = await bankListResponse.json().catch(() => ({}));
      const banks = Array.isArray(bankListPayload?.data) ? bankListPayload.data : [];
      const targetName = normalizeBankName(bank_name);
      const match = banks.find((bank) => normalizeBankName(bank.name).includes(targetName) || targetName.includes(normalizeBankName(bank.name)));
      if (match?.code) resolvedBankCode = String(match.code);
    } catch (error) {
      console.error('Paystack bank list lookup failed:', error);
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

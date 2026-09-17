const DEFAULT_GATEWAY_FEES = {
  paystack: { percentage: 1.5, fixed: 100, cap: 2000 },
  flutterwave: { percentage: 1.4, fixed: 0, cap: 2000 }
};

const toPositiveNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const CUSTOMER_PAYS_PAYMENT_FEE = 'customer';
export const MERCHANT_PAYS_PAYMENT_FEE = 'merchant';

export const calculatePlatformRevenue = (subtotal) => {
  const amount = toPositiveNumber(subtotal);
  if (amount < 10000) return 0;
  if (amount <= 50000) return 1000;
  return Math.min(10000, Math.round(amount * 0.02));
};

export const getGatewayFeeConfig = (provider, env = {}) => {
  const key = provider === 'flutterwave' ? 'FLUTTERWAVE' : 'PAYSTACK';
  const defaults = DEFAULT_GATEWAY_FEES[provider] || DEFAULT_GATEWAY_FEES.paystack;
  return {
    percentage: toPositiveNumber(env[`${key}_FEE_PERCENTAGE`], defaults.percentage),
    fixed: toPositiveNumber(env[`${key}_FEE_FIXED`], defaults.fixed),
    cap: toPositiveNumber(env[`${key}_FEE_CAP`], defaults.cap)
  };
};

export const calculateGatewayFee = (amount, provider, env = {}) => {
  const config = getGatewayFeeConfig(provider, env);
  const calculated = Math.round((toPositiveNumber(amount) * config.percentage) / 100 + config.fixed);
  return Math.min(config.cap, calculated);
};

export const calculateCommerceFees = ({ subtotal, deliveryFee = 0, provider = 'paystack', responsibility = CUSTOMER_PAYS_PAYMENT_FEE, env = {} }) => {
  const merchandiseSubtotal = toPositiveNumber(subtotal);
  const delivery = toPositiveNumber(deliveryFee);
  const orderTotal = merchandiseSubtotal + delivery;
  const providerFee = calculateGatewayFee(orderTotal, provider, env);
  const gatewayFee = responsibility === CUSTOMER_PAYS_PAYMENT_FEE ? providerFee : 0;
  const customerTotal = orderTotal + gatewayFee + calculatePlatformRevenue(merchandiseSubtotal);

  return {
    subtotal: merchandiseSubtotal,
    deliveryFee: delivery,
    orderTotal,
    gatewayFee,
    providerFee,
    platformRevenue: calculatePlatformRevenue(merchandiseSubtotal),
    customerTotal
  };
};

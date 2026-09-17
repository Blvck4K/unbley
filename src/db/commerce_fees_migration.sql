-- Commerce fee policy for store checkout and merchant settlement.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS payment_fee_responsibility text NOT NULL DEFAULT 'customer';

ALTER TABLE public.brand_profiles
  DROP CONSTRAINT IF EXISTS brand_profiles_payment_fee_responsibility_check;

ALTER TABLE public.brand_profiles
  ADD CONSTRAINT brand_profiles_payment_fee_responsibility_check
  CHECK (payment_fee_responsibility IN ('customer', 'merchant'));

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS subtotal numeric(15, 2),
  ADD COLUMN IF NOT EXISTS gateway_payment_fee numeric(15, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_revenue numeric(15, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_fee_responsibility text NOT NULL DEFAULT 'customer';

CREATE INDEX IF NOT EXISTS idx_orders_platform_revenue
  ON public.orders (brand_id, created_at DESC);

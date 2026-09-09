-- Owner-managed order fulfillment state.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(15, 2) NOT NULL DEFAULT 0;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(15, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_duration TEXT;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_fulfillment_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_fulfillment_status_check
  CHECK (fulfillment_status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'));

CREATE INDEX IF NOT EXISTS orders_fulfillment_status_idx
  ON public.orders(brand_id, fulfillment_status);

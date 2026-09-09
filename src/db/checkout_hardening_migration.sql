-- Checkout integrity and structured delivery address fields.
-- Apply after mobile_payments_migration.sql.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_state TEXT,
  ADD COLUMN IF NOT EXISTS customer_address_line TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_status TEXT NOT NULL DEFAULT 'confirmed',
  ADD COLUMN IF NOT EXISTS confirmation_error TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_confirmation_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_confirmation_status_check
  CHECK (confirmation_status IN ('pending', 'confirmed', 'needs_retry', 'failed'));

CREATE UNIQUE INDEX IF NOT EXISTS orders_transaction_id_unique_idx
  ON public.orders(transaction_id)
  WHERE transaction_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_confirmation_status_idx
  ON public.orders(brand_id, confirmation_status);

-- Keep the structured address fields separate for new orders while preserving
-- customer_address for older dashboard and notification consumers.
UPDATE public.orders
SET customer_address_line = customer_address
WHERE customer_address_line IS NULL AND customer_address IS NOT NULL;
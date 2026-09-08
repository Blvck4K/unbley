-- Server-verified payment records for native and web checkout.
-- Apply this migration before deploying the payment API endpoints.

CREATE TABLE IF NOT EXISTS public.payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  provider text NOT NULL CHECK (provider IN ('paystack', 'flutterwave')),
  provider_reference text UNIQUE NOT NULL,
  amount numeric(15, 2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payment records" ON public.payment_records;
CREATE POLICY "Users can view their own payment records"
  ON public.payment_records FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS customer_address text,
  ADD COLUMN IF NOT EXISTS customer_city text,
  ADD COLUMN IF NOT EXISTS customer_zip text,
  ADD COLUMN IF NOT EXISTS items jsonb,
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS payment_method text;

CREATE INDEX IF NOT EXISTS payment_records_provider_reference_idx ON public.payment_records(provider_reference);
CREATE INDEX IF NOT EXISTS payment_records_user_id_idx ON public.payment_records(user_id);
CREATE INDEX IF NOT EXISTS payment_records_order_id_idx ON public.payment_records(order_id);

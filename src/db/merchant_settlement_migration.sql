-- Merchant settlement/ledger system
CREATE TABLE IF NOT EXISTS public.merchant_financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  payment_provider text NOT NULL CHECK (payment_provider IN ('paystack', 'flutterwave')),
  provider_transaction_id text NOT NULL,
  type text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'POSTED',
  available_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.merchant_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  payout_reference text NOT NULL UNIQUE,
  provider text NOT NULL CHECK (provider IN ('paystack', 'flutterwave')),
  amount bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','SUCCESS','FAILED','REVERSED')),
  provider_recipient_code text,
  provider_transfer_reference text,
  failure_reason text,
  retry_count integer NOT NULL DEFAULT 0,
  available_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.merchant_payout_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id uuid NOT NULL REFERENCES public.merchant_payouts(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','SUCCESS','FAILED')),
  error_message text,
  provider_response jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS bank_code text,
  ADD COLUMN IF NOT EXISTS paystack_subaccount_code text,
  ADD COLUMN IF NOT EXISTS flutterwave_subaccount_code text,
  ADD COLUMN IF NOT EXISTS merchant_settlement_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS settlement_offset_days integer DEFAULT 1;

-- Payouts use the existing bank_name, account_name, and account_number fields.
-- Provider subaccount codes remain available for checkout settlement/splits.
ALTER TABLE public.brand_profiles
  DROP COLUMN IF EXISTS payout_bank_code,
  DROP COLUMN IF EXISTS payout_bank_name,
  DROP COLUMN IF EXISTS payout_account_number,
  DROP COLUMN IF EXISTS payout_account_name,
  DROP COLUMN IF EXISTS payout_account_verified,
  DROP COLUMN IF EXISTS payout_provider,
  DROP COLUMN IF EXISTS payout_recipient_code;

ALTER TABLE public.merchant_financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_payout_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_merchant_transactions_merchant_id
  ON public.merchant_financial_transactions (merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_transactions_order_id
  ON public.merchant_financial_transactions (order_id);
CREATE INDEX IF NOT EXISTS idx_merchant_transactions_provider_ref
  ON public.merchant_financial_transactions (provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_merchant_transactions_available_at
  ON public.merchant_financial_transactions (available_at);
CREATE INDEX IF NOT EXISTS idx_merchant_payouts_merchant_id
  ON public.merchant_payouts (merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_payouts_status
  ON public.merchant_payouts (status, created_at DESC);

ALTER TABLE public.merchant_financial_transactions
  ADD CONSTRAINT merchant_financial_transactions_amount_check CHECK (amount <> 0);

DROP POLICY IF EXISTS "merchant users can read their financial ledger" ON public.merchant_financial_transactions;
CREATE POLICY "merchant users can read their financial ledger"
ON public.merchant_financial_transactions FOR SELECT
USING (auth.uid() = merchant_id);

DROP POLICY IF EXISTS "merchant users can insert their own ledger entries" ON public.merchant_financial_transactions;
CREATE POLICY "merchant users can insert their own ledger entries"
ON public.merchant_financial_transactions FOR INSERT
WITH CHECK (auth.uid() = merchant_id);

DROP POLICY IF EXISTS "admins can read all financial ledger" ON public.merchant_financial_transactions;
CREATE POLICY "admins can read all financial ledger"
ON public.merchant_financial_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.brand_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

DROP POLICY IF EXISTS "merchant users can read their payouts" ON public.merchant_payouts;
CREATE POLICY "merchant users can read their payouts"
ON public.merchant_payouts FOR SELECT
USING (auth.uid() = merchant_id);

DROP POLICY IF EXISTS "admins can read all payouts" ON public.merchant_payouts;
CREATE POLICY "admins can read all payouts"
ON public.merchant_payouts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.brand_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

DROP POLICY IF EXISTS "admins can update payouts" ON public.merchant_payouts;
CREATE POLICY "admins can update payouts"
ON public.merchant_payouts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.brand_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.brand_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

DROP POLICY IF EXISTS "merchant users can read their payout attempts" ON public.merchant_payout_attempts;
CREATE POLICY "merchant users can read their payout attempts"
ON public.merchant_payout_attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.merchant_payouts mp
    WHERE mp.id = payout_id AND mp.merchant_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "admins can read all payout attempts" ON public.merchant_payout_attempts;
CREATE POLICY "admins can read all payout attempts"
ON public.merchant_payout_attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.brand_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Helper function to compute merchant balances
CREATE OR REPLACE FUNCTION public.calculate_merchant_balance(p_merchant_id uuid)
RETURNS TABLE (
  available_amount bigint,
  pending_amount bigint,
  total_sales bigint,
  total_paid_out bigint,
  failed_payouts bigint,
  refunded_amount bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH tx AS (
    SELECT
      merchant_id,
      SUM(CASE WHEN type IN ('PAYMENT','ADJUSTMENT') AND amount > 0 THEN amount ELSE 0 END) AS gross_in,
      SUM(CASE WHEN type IN ('REFUND','PAYOUT','PAYOUT_FAILED','PAYOUT_REVERSED','PLATFORM_FEE') AND amount < 0 THEN ABS(amount) ELSE 0 END) AS gross_out,
      SUM(CASE WHEN type = 'PAYMENT' THEN amount ELSE 0 END) AS total_sales,
      SUM(CASE WHEN type = 'REFUND' THEN ABS(amount) ELSE 0 END) AS refunded_amount,
      SUM(CASE WHEN type = 'PAYOUT' AND status = 'SUCCESS' THEN amount ELSE 0 END) AS total_paid_out,
      SUM(CASE WHEN type = 'PAYOUT_FAILED' THEN ABS(amount) ELSE 0 END) AS failed_payouts
    FROM public.merchant_financial_transactions
    WHERE merchant_id = p_merchant_id
    GROUP BY merchant_id
  )
  SELECT
    COALESCE((SELECT SUM(amount)
      FROM public.merchant_financial_transactions
      WHERE merchant_id = p_merchant_id
        AND status IN ('POSTED','AVAILABLE')
        AND available_at IS NOT NULL
        AND available_at <= now()), 0)::bigint AS available_amount,
    COALESCE((SELECT SUM(amount)
      FROM public.merchant_financial_transactions
      WHERE merchant_id = p_merchant_id
        AND type = 'PAYMENT'
        AND status = 'PENDING'), 0)::bigint AS pending_amount,
    COALESCE((SELECT SUM(CASE WHEN type = 'PAYMENT' THEN amount ELSE 0 END)
      FROM public.merchant_financial_transactions
      WHERE merchant_id = p_merchant_id), 0)::bigint AS total_sales,
    COALESCE((SELECT SUM(CASE WHEN type = 'PAYOUT' AND status = 'SUCCESS' THEN amount ELSE 0 END)
      FROM public.merchant_financial_transactions
      WHERE merchant_id = p_merchant_id), 0)::bigint AS total_paid_out,
    COALESCE((SELECT SUM(CASE WHEN type = 'PAYOUT_FAILED' THEN ABS(amount) ELSE 0 END)
      FROM public.merchant_financial_transactions
      WHERE merchant_id = p_merchant_id), 0)::bigint AS failed_payouts,
    COALESCE((SELECT SUM(CASE WHEN type = 'REFUND' THEN ABS(amount) ELSE 0 END)
      FROM public.merchant_financial_transactions
      WHERE merchant_id = p_merchant_id), 0)::bigint AS refunded_amount;
END;
$$;

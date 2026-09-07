ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  account_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid_out')),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brands can view their own withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Brands can view their own withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  USING (auth.uid() = brand_id);

DROP POLICY IF EXISTS "Admins can view all withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Admins can view all withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.brand_profiles
      WHERE brand_profiles.id = auth.uid() AND brand_profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Brands can create their own withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Brands can create their own withdrawal requests"
  ON public.withdrawal_requests FOR INSERT
  WITH CHECK (auth.uid() = brand_id);

DROP POLICY IF EXISTS "Admins can update withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Admins can update withdrawal requests"
  ON public.withdrawal_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.brand_profiles
      WHERE brand_profiles.id = auth.uid() AND brand_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brand_profiles
      WHERE brand_profiles.id = auth.uid() AND brand_profiles.is_admin = true
    )
  );

CREATE OR REPLACE FUNCTION public.set_withdrawal_request_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_withdrawal_request_updated_at ON public.withdrawal_requests;
CREATE TRIGGER set_withdrawal_request_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_withdrawal_request_updated_at();

ALTER TABLE public.withdrawal_requests REPLICA IDENTITY FULL;

GRANT SELECT, INSERT, UPDATE ON public.withdrawal_requests TO authenticated;

CREATE OR REPLACE FUNCTION public.validate_withdrawal_balance()
RETURNS trigger AS $$
DECLARE
  completed_sales numeric;
  reserved_withdrawals numeric;
BEGIN
  IF NEW.status IN ('pending', 'approved') THEN
    SELECT COALESCE(SUM(total_amount), 0)
      INTO completed_sales
      FROM public.orders
      WHERE brand_id = NEW.brand_id AND status = 'completed';

    SELECT COALESCE(SUM(amount), 0)
      INTO reserved_withdrawals
      FROM public.withdrawal_requests
      WHERE brand_id = NEW.brand_id
        AND status IN ('pending', 'approved')
        AND id IS DISTINCT FROM NEW.id;

    IF reserved_withdrawals + NEW.amount > completed_sales THEN
      RAISE EXCEPTION 'Withdrawal amount exceeds available balance';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_withdrawal_balance ON public.withdrawal_requests;
CREATE TRIGGER validate_withdrawal_balance
  BEFORE INSERT OR UPDATE OF amount, status, brand_id ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION public.validate_withdrawal_balance();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'withdrawal_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawal_requests;
  END IF;
END;
$$;
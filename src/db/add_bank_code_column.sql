-- Bank code used internally for account verification and merchant payouts.
-- Store owners still select a bank by name; the application fills this value.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS bank_code text;
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS plan_id text,
  ADD COLUMN IF NOT EXISTS plan_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_used boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_transaction_id text;

-- Existing paid users should be assigned an expiry manually if their billing history exists.
-- Do not set store_active or plan_ends_at for users who have not paid or started a trial.
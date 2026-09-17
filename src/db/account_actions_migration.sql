-- Account controls and auditable ownership transfer requests.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS deactivated_at timestamptz,
  ADD COLUMN IF NOT EXISTS ownership_transfer_email text;

CREATE TABLE IF NOT EXISTS public.store_ownership_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  current_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  target_email text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled', 'expired')),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_store_ownership_transfers_store
  ON public.store_ownership_transfers (store_id, created_at DESC);

ALTER TABLE public.store_ownership_transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ownership transfers are private" ON public.store_ownership_transfers;
CREATE POLICY "ownership transfers are private"
  ON public.store_ownership_transfers FOR ALL USING (false) WITH CHECK (false);

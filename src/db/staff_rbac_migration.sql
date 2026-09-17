-- Staff management and store-scoped RBAC.
CREATE TABLE IF NOT EXISTS public.store_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (store_id, name)
);

CREATE TABLE IF NOT EXISTS public.store_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.store_roles(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'removed')),
  joined_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  last_activity_at timestamptz,
  UNIQUE (store_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.staff_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role_id uuid NOT NULL REFERENCES public.store_roles(id) ON DELETE RESTRICT,
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz NOT NULL,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  accepted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.staff_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_store_members_store ON public.store_members(store_id, status);
CREATE INDEX IF NOT EXISTS idx_store_members_user ON public.store_members(user_id, status);
CREATE INDEX IF NOT EXISTS idx_staff_invites_store ON public.staff_invitations(store_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_activity_store ON public.staff_activity_logs(store_id, created_at DESC);

ALTER TABLE public.store_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_activity_logs ENABLE ROW LEVEL SECURITY;

-- Staff records are accessed through service-role API authorization checks.
DROP POLICY IF EXISTS "staff roles are private" ON public.store_roles;
CREATE POLICY "staff roles are private" ON public.store_roles FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "store members are private" ON public.store_members;
CREATE POLICY "store members are private" ON public.store_members FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "staff invitations are private" ON public.staff_invitations;
CREATE POLICY "staff invitations are private" ON public.staff_invitations FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "staff activity is private" ON public.staff_activity_logs;
CREATE POLICY "staff activity is private" ON public.staff_activity_logs FOR ALL USING (false) WITH CHECK (false);

-- System roles are created per store by the staff API when the owner first opens Staff settings.

-- Store domain identity and host-based storefront resolution.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS store_slug text,
  ADD COLUMN IF NOT EXISTS unbley_domain text,
  ADD COLUMN IF NOT EXISTS custom_domain text,
  ADD COLUMN IF NOT EXISTS custom_domain_verified boolean DEFAULT false;

DROP TRIGGER IF EXISTS assign_store_domain_before_write ON public.brand_profiles;

CREATE OR REPLACE FUNCTION public.assign_store_domain()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  candidate_slug text;
  suffix_number integer := 2;
BEGIN
  IF NEW.store_slug IS NULL OR NEW.store_slug = '' THEN
    base_slug := trim(both '-' from regexp_replace(lower(coalesce(NEW.brand_name, 'store')), '[^a-z0-9]+', '-', 'g'));
    base_slug := coalesce(nullif(base_slug, ''), 'store');
    candidate_slug := base_slug;

    LOOP
      PERFORM pg_advisory_xact_lock(hashtext(candidate_slug));
      EXIT WHEN NOT EXISTS (
        SELECT 1
        FROM public.brand_profiles
        WHERE store_slug = candidate_slug
          AND id IS DISTINCT FROM NEW.id
      );
      candidate_slug := base_slug || '-' || suffix_number;
      suffix_number := suffix_number + 1;
    END LOOP;

    NEW.store_slug := candidate_slug;
  END IF;

  IF NEW.unbley_domain IS NULL OR NEW.unbley_domain = '' THEN
    NEW.unbley_domain := NEW.store_slug || '.unbley.tech';
  END IF;

  IF NEW.custom_domain IS NOT NULL AND NEW.custom_domain <> '' THEN
    NEW.custom_domain := lower(regexp_replace(regexp_replace(trim(NEW.custom_domain), '^https?://', ''), '/.*$', ''));
  END IF;

  RETURN NEW;
END;
$$;

DO $$
DECLARE
  store_record record;
  base_slug text;
  candidate_slug text;
  suffix_number integer;
BEGIN
  UPDATE public.brand_profiles SET store_slug = NULL, unbley_domain = NULL;

  FOR store_record IN
    SELECT id, brand_name
    FROM public.brand_profiles
    ORDER BY created_at NULLS FIRST, id
  LOOP
    base_slug := trim(both '-' from regexp_replace(lower(coalesce(store_record.brand_name, 'store')), '[^a-z0-9]+', '-', 'g'));
    base_slug := coalesce(nullif(base_slug, ''), 'store');
    candidate_slug := base_slug;
    suffix_number := 2;

    LOOP
      PERFORM pg_advisory_xact_lock(hashtext(candidate_slug));
      EXIT WHEN NOT EXISTS (
        SELECT 1
        FROM public.brand_profiles
        WHERE store_slug = candidate_slug
      );
      candidate_slug := base_slug || '-' || suffix_number;
      suffix_number := suffix_number + 1;
    END LOOP;

    UPDATE public.brand_profiles
    SET store_slug = candidate_slug,
        unbley_domain = candidate_slug || '.unbley.tech'
    WHERE id = store_record.id;
  END LOOP;
END;
$$;

CREATE TRIGGER assign_store_domain_before_write
  BEFORE INSERT OR UPDATE OF brand_name, store_slug, unbley_domain, custom_domain
  ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_store_domain();

CREATE UNIQUE INDEX IF NOT EXISTS brand_profiles_store_slug_key
  ON public.brand_profiles (store_slug);
CREATE UNIQUE INDEX IF NOT EXISTS brand_profiles_unbley_domain_key
  ON public.brand_profiles (unbley_domain);

CREATE UNIQUE INDEX IF NOT EXISTS brand_profiles_custom_domain_key
  ON public.brand_profiles (custom_domain)
  WHERE custom_domain IS NOT NULL AND custom_domain <> '';

-- Public storefront lookup needs only the domain identity, not private profile fields.
DROP POLICY IF EXISTS "Public can resolve active store domains" ON public.brand_profiles;
CREATE POLICY "Public can resolve active store domains"
ON public.brand_profiles FOR SELECT
USING (
  store_active = true
  AND (unbley_domain IS NOT NULL OR custom_domain IS NOT NULL)
);

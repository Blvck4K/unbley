-- Store domain identity and host-based storefront resolution.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS store_slug text,
  ADD COLUMN IF NOT EXISTS unbley_domain text,
  ADD COLUMN IF NOT EXISTS custom_domain text,
  ADD COLUMN IF NOT EXISTS custom_domain_verified boolean DEFAULT false;

CREATE OR REPLACE FUNCTION public.assign_store_domain()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
BEGIN
  IF NEW.store_slug IS NULL OR NEW.store_slug = '' THEN
    base_slug := trim(both '-' from regexp_replace(lower(coalesce(NEW.brand_name, 'store')), '[^a-z0-9]+', '-', 'g'));
    NEW.store_slug := coalesce(nullif(base_slug, ''), 'store') || '-' || substr(NEW.id::text, 1, 8);
  END IF;

  IF NEW.unbley_domain IS NULL OR NEW.unbley_domain = '' THEN
    NEW.unbley_domain := NEW.store_slug || '.unbley.com';
  END IF;

  IF NEW.custom_domain IS NOT NULL AND NEW.custom_domain <> '' THEN
    NEW.custom_domain := lower(regexp_replace(regexp_replace(trim(NEW.custom_domain), '^https?://', ''), '/.*$', ''));
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_store_domain_before_write ON public.brand_profiles;
CREATE TRIGGER assign_store_domain_before_write
  BEFORE INSERT OR UPDATE OF brand_name, store_slug, unbley_domain, custom_domain
  ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_store_domain();

UPDATE public.brand_profiles
SET store_slug = coalesce(
  nullif(store_slug, ''),
  trim(both '-' from regexp_replace(lower(coalesce(brand_name, 'store')), '[^a-z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 8)
)
WHERE store_slug IS NULL OR store_slug = '';

UPDATE public.brand_profiles
SET unbley_domain = coalesce(nullif(unbley_domain, ''), store_slug || '.unbley.com')
WHERE store_slug IS NULL OR store_slug = '' OR unbley_domain IS NULL OR unbley_domain = '';

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

-- Store owner-selected storefront font.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS store_font TEXT NOT NULL DEFAULT 'inter';
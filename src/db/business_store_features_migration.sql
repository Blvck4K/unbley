-- Business storefront features
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS banner_url_2 text,
  ADD COLUMN IF NOT EXISTS banner_url_3 text,
  ADD COLUMN IF NOT EXISTS banner_url_4 text,
  ADD COLUMN IF NOT EXISTS refund_policy text,
  ADD COLUMN IF NOT EXISTS shipping_policy text,
  ADD COLUMN IF NOT EXISTS brand_name_font text,
  ADD COLUMN IF NOT EXISTS brand_name_case text DEFAULT 'original';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS product_type text;
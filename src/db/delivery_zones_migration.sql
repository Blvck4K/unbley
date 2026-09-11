-- Location-aware delivery fees for store owners.
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS same_city_delivery_fee NUMERIC(15, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS same_state_delivery_fee NUMERIC(15, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS outside_state_delivery_fee NUMERIC(15, 2) NOT NULL DEFAULT 0;

UPDATE public.brand_profiles
SET same_city_delivery_fee = shipping_fee,
    same_state_delivery_fee = shipping_fee,
    outside_state_delivery_fee = shipping_fee
WHERE COALESCE(shipping_fee, 0) > 0
  AND COALESCE(same_city_delivery_fee, 0) = 0
  AND COALESCE(same_state_delivery_fee, 0) = 0
  AND COALESCE(outside_state_delivery_fee, 0) = 0;
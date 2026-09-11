-- Optional customer note captured during checkout.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_note TEXT;
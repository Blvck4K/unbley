-- ==========================================
-- Product Management Migration
-- ==========================================

-- 1. Add new columns for storefront display
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tag TEXT;

-- Quick fix to expand numeric size for Naira values (Prevents Numeric Overflow Error)
ALTER TABLE public.products ALTER COLUMN price TYPE NUMERIC(15, 2);

-- 2. Fix RLS so public visitors can see the products!
DROP POLICY IF EXISTS "Anyone can view products." ON public.products;
CREATE POLICY "Anyone can view products." ON public.products
FOR SELECT USING (true);

-- 3. Ensure Brand Owners can manage their own specific products
DROP POLICY IF EXISTS "Brands can insert their own products." ON public.products;
CREATE POLICY "Brands can insert their own products." ON public.products
FOR INSERT WITH CHECK ( auth.uid() = brand_id );

DROP POLICY IF EXISTS "Brands can update their own products." ON public.products;
CREATE POLICY "Brands can update their own products." ON public.products
FOR UPDATE USING ( auth.uid() = brand_id );

DROP POLICY IF EXISTS "Brands can delete their own products." ON public.products;
CREATE POLICY "Brands can delete their own products." ON public.products
FOR DELETE USING ( auth.uid() = brand_id );

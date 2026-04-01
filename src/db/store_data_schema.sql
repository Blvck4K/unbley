-- ==========================================
-- Store Metrics Architecture
-- ==========================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'processing',
  product_name_snapshot TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Store Traffic (Simple Visitor Logging)
CREATE TABLE IF NOT EXISTS public.store_traffic (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE NOT NULL,
  visitor_ip TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_traffic ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Brands can only view/manage their OWN products, orders, and traffic.
DROP POLICY IF EXISTS "Brands see their own products." ON public.products;
CREATE POLICY "Brands see their own products." ON public.products FOR ALL USING ( auth.uid() = brand_id );

DROP POLICY IF EXISTS "Brands see their own orders." ON public.orders;
CREATE POLICY "Brands see their own orders." ON public.orders FOR ALL USING ( auth.uid() = brand_id );

DROP POLICY IF EXISTS "Brands see their own traffic logs." ON public.store_traffic;
CREATE POLICY "Brands see their own traffic logs." ON public.store_traffic FOR ALL USING ( auth.uid() = brand_id );

    

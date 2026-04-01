-- 1. Safely migrate existing 'brand_owners' table to 'brand_profiles'
DO $$ 
BEGIN
  -- Rename table if the old one exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'brand_owners') THEN
    ALTER TABLE public.brand_owners RENAME TO brand_profiles;
  END IF;
  
  -- Rename columns to match the new React component mapping
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='brand_profiles' and column_name='business_name') THEN
    ALTER TABLE public.brand_profiles RENAME COLUMN business_name TO brand_name;
  END IF;

  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='brand_profiles' and column_name='email') THEN
    ALTER TABLE public.brand_profiles RENAME COLUMN email TO email_address;
  END IF;

  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='brand_profiles' and column_name='phone') THEN
    ALTER TABLE public.brand_profiles RENAME COLUMN phone TO phone_number;
  END IF;

  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='brand_profiles' and column_name='category') THEN
    ALTER TABLE public.brand_profiles RENAME COLUMN category TO brand_category;
  END IF;
END $$;

-- 2. Create the brand_profiles table if it entirely doesn't exist
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name text,
  email_address text,
  phone_number text,
  brand_category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Add all the new columns required by the new comprehensive Edit page
ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS owner_name text,
  ADD COLUMN IF NOT EXISTS delivery_duration text,
  ADD COLUMN IF NOT EXISTS brand_narrative text,
  ADD COLUMN IF NOT EXISTS manifesto text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS state_province text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS address_line_1 text,
  ADD COLUMN IF NOT EXISTS address_line_2 text,
  ADD COLUMN IF NOT EXISTS primary_color text,
  ADD COLUMN IF NOT EXISTS secondary_color text,
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS product_1_url text,
  ADD COLUMN IF NOT EXISTS product_2_url text,
  ADD COLUMN IF NOT EXISTS product_3_url text,
  ADD COLUMN IF NOT EXISTS product_4_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS tiktok_url text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS account_number text,
  ADD COLUMN IF NOT EXISTS account_name text,
  ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS store_active boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 4. Create customers table if it doesn't exist (protecting your prior logic)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Turn on Row Level Security (RLS)
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 6. Setup Policies safely
DROP POLICY IF EXISTS "Users can view their own profile." ON public.brand_profiles;
CREATE POLICY "Users can view their own profile." ON public.brand_profiles FOR SELECT USING ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update their own profile." ON public.brand_profiles;
CREATE POLICY "Users can update their own profile." ON public.brand_profiles FOR UPDATE USING ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.brand_profiles;
CREATE POLICY "Users can insert their own profile." ON public.brand_profiles FOR INSERT WITH CHECK ( auth.uid() = id );

-- 7. Function that combines both your previous customer flow AND the new brand flow
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- If the user signed up as a brand owner
  IF NEW.raw_user_meta_data->>'role' = 'brand' THEN
    INSERT INTO public.brand_profiles (
      id, 
      brand_name, 
      owner_name, 
      email_address, 
      phone_number,
      brand_category,
      profile_completed,
      store_active
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'category',
      false,
      false
    );
    
  -- If the user signed up as a customer (restoring your previous flow)
  ELSIF NEW.raw_user_meta_data->>'role' = 'customer' THEN
    INSERT INTO public.customers (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. THE CRITICAL FIX: Drop the previous trigger before making the new one!
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 9. SUPABASE STORAGE POLICIES FOR IMAGE UPLOADS
-- Fixes "new row violates row-level security policy" on image upload
-- ==============================================================================

-- Create the bucket automatically if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies just in case to avoid conflict errors
DROP POLICY IF EXISTS "Public Viewers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects;

-- Allow completely public read access (so anyone visiting the website can see the images)
CREATE POLICY "Public Viewers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'brand-assets' );

-- Allow ONLY authenticated logged-in users to upload newly created files
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' AND bucket_id = 'brand-assets' );

-- Allow users to update their existing uploads
CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
USING ( auth.role() = 'authenticated' AND bucket_id = 'brand-assets' AND owner = auth.uid() );

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING ( auth.role() = 'authenticated' AND bucket_id = 'brand-assets' AND owner = auth.uid() );

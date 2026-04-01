-- ============================================
-- Activation Security Update
-- ============================================

-- Add the new lockdown payment tracking field to brand_profiles
ALTER TABLE public.brand_profiles 
ADD COLUMN IF NOT EXISTS store_active boolean DEFAULT false;

-- (Optional Admin Command): If you want to force all EXISTING users to bypass payment and act as if they already paid, uncomment the line below before running:
-- UPDATE public.brand_profiles SET store_active = true WHERE profile_completed = true;

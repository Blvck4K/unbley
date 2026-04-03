-- 1. Add 'is_admin' column to brand_profiles table
ALTER TABLE public.brand_profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Update specific administrator emails to have admin access
-- This ensures these users bypass payment and see the Support tab.
UPDATE public.brand_profiles
SET is_admin = true
WHERE email_address IN (
  'diorbaron2@gmail.com', 
  'isaacakpasu06@gmail.com', 
  'akpasuazeh@gmail.com'
);

-- 3. Update the handle_new_user trigger function to handle is_admin if needed
-- (Currently, new users are never admins by default, so this is just for safety)
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
      store_active,
      is_admin
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'category',
      false,
      false,
      false -- NEW USERS are NOT admins by default
    );
    
  -- If the user signed up as a customer
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

-- Migration: Add paystack_subaccount_code to brand_profiles

-- 1. Add column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='brand_profiles' AND column_name='paystack_subaccount_code') THEN 
        ALTER TABLE public.brand_profiles 
        ADD COLUMN paystack_subaccount_code TEXT;
    END IF;
END $$;

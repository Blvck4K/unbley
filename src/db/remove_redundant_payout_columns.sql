-- Keep the canonical bank_name, account_name, account_number fields and the
-- provider subaccount columns. Remove duplicated payout_* profile fields.
ALTER TABLE public.brand_profiles
  DROP COLUMN IF EXISTS payout_provider,
  DROP COLUMN IF EXISTS payout_bank_name,
  DROP COLUMN IF EXISTS payout_bank_code,
  DROP COLUMN IF EXISTS payout_account_number,
  DROP COLUMN IF EXISTS payout_account_name,
  DROP COLUMN IF EXISTS payout_account_verified,
  DROP COLUMN IF EXISTS payout_recipient_code;
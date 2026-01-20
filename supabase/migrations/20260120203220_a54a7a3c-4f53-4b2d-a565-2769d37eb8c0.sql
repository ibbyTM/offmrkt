-- Add new columns to mortgage_referrals for enhanced lead data
ALTER TABLE public.mortgage_referrals
ADD COLUMN IF NOT EXISTS enquiry_type TEXT,
ADD COLUMN IF NOT EXISTS annual_income INTEGER,
ADD COLUMN IF NOT EXISTS is_uk_resident BOOLEAN,
ADD COLUMN IF NOT EXISTS prefers_remote BOOLEAN,
ADD COLUMN IF NOT EXISTS is_first_time_btl BOOLEAN,
ADD COLUMN IF NOT EXISTS property_type TEXT,
ADD COLUMN IF NOT EXISTS property_value INTEGER,
ADD COLUMN IF NOT EXISTS property_address TEXT;
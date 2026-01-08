ALTER TABLE properties
ADD COLUMN IF NOT EXISTS tenure text,
ADD COLUMN IF NOT EXISTS is_tenanted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_required integer,
ADD COLUMN IF NOT EXISTS refurb_cost integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS end_value_gdv integer,
ADD COLUMN IF NOT EXISTS roce_percentage integer,
ADD COLUMN IF NOT EXISTS market_discount_percentage integer,
ADD COLUMN IF NOT EXISTS investment_highlights text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS property_reference text;
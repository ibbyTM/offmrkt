-- Create enum for investment strategy types
CREATE TYPE public.investment_strategy AS ENUM (
  'cash_roi',
  'brrr',
  'leveraged',
  'capital_growth',
  'hands_on',
  'hands_off',
  'btl',
  'social_housing'
);

-- Create enum for property listing status
CREATE TYPE public.listing_status AS ENUM (
  'available',
  'reserved',
  'under_offer',
  'sold'
);

-- Create the properties table for live listings
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Info
  title TEXT NOT NULL,
  property_address TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_postcode TEXT NOT NULL,
  property_type public.property_type NOT NULL,
  
  -- Pricing
  asking_price INTEGER NOT NULL,
  
  -- Property Details
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  property_description TEXT,
  
  -- Investment Details
  strategies investment_strategy[] DEFAULT '{}',
  estimated_rental_income INTEGER,
  current_rental_income INTEGER,
  
  -- ROI Calculations (stored as percentages * 100 for precision)
  cash_roi_percentage INTEGER,
  leveraged_roi_percentage INTEGER,
  gross_yield_percentage INTEGER,
  
  -- Status
  listing_status listing_status NOT NULL DEFAULT 'available',
  current_status public.property_status,
  
  -- Compliance Documents
  has_epc BOOLEAN DEFAULT FALSE,
  has_gas_safety BOOLEAN DEFAULT FALSE,
  has_eicr BOOLEAN DEFAULT FALSE,
  has_floor_plans BOOLEAN DEFAULT FALSE,
  epc_rating TEXT,
  
  -- Media
  photo_urls TEXT[] DEFAULT '{}',
  floor_plan_urls TEXT[] DEFAULT '{}',
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  
  -- Relationship to original submission (optional)
  submission_id UUID REFERENCES public.seller_submissions(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view available properties (public marketplace)
CREATE POLICY "Anyone can view available properties"
ON public.properties
FOR SELECT
USING (listing_status = 'available');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX idx_properties_status ON public.properties(listing_status);
CREATE INDEX idx_properties_city ON public.properties(property_city);
CREATE INDEX idx_properties_price ON public.properties(asking_price);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_strategies ON public.properties USING GIN(strategies);

-- Insert some sample properties for development
INSERT INTO public.properties (
  title, property_address, property_city, property_postcode, property_type,
  asking_price, bedrooms, bathrooms, square_feet, property_description,
  strategies, estimated_rental_income, cash_roi_percentage, gross_yield_percentage,
  listing_status, has_epc, epc_rating, photo_urls
) VALUES
(
  'High-Yield Terraced in Salford',
  '45 Chapel Street',
  'Salford',
  'M3 5DW',
  'terraced',
  125000,
  3,
  1,
  950,
  'Excellent buy-to-let opportunity in popular rental area. Recently refurbished with new kitchen and bathroom. Close to Media City and excellent transport links.',
  ARRAY['btl', 'cash_roi']::investment_strategy[],
  850,
  820,
  816,
  'available',
  true,
  'C',
  '{}'
),
(
  'BRRR Opportunity in Birmingham',
  '128 Stratford Road',
  'Birmingham',
  'B11 1AG',
  'semi_detached',
  185000,
  4,
  2,
  1200,
  'Perfect BRRR project. Needs cosmetic refurbishment. ARV estimated at £245,000. Strong rental demand in area.',
  ARRAY['brrr', 'capital_growth']::investment_strategy[],
  1100,
  750,
  713,
  'available',
  true,
  'D',
  '{}'
),
(
  'Modern City Centre Flat',
  '15 Piccadilly Gardens',
  'Manchester',
  'M1 1RG',
  'flat',
  165000,
  2,
  1,
  680,
  'Stylish apartment in prime city centre location. Ideal for professional tenants. Building has 24/7 concierge.',
  ARRAY['btl', 'hands_off', 'capital_growth']::investment_strategy[],
  950,
  680,
  691,
  'available',
  true,
  'B',
  '{}'
),
(
  'HMO Conversion Potential',
  '78 Wavertree Road',
  'Liverpool',
  'L7 1PG',
  'detached',
  220000,
  5,
  2,
  1800,
  'Large detached property perfect for HMO conversion. Planning guidance positive. Near universities and hospitals.',
  ARRAY['hands_on', 'cash_roi']::investment_strategy[],
  2200,
  1200,
  1200,
  'available',
  true,
  'D',
  '{}'
),
(
  'Social Housing Ready',
  '32 Northgate',
  'Leeds',
  'LS2 7PN',
  'terraced',
  145000,
  3,
  1,
  900,
  'Suitable for social housing lease. 5-year guaranteed rent available. Fully compliant with all regulations.',
  ARRAY['social_housing', 'hands_off']::investment_strategy[],
  780,
  650,
  645,
  'available',
  true,
  'C',
  '{}'
),
(
  'Student Let Near University',
  '22 Oxford Road',
  'Manchester',
  'M13 9PL',
  'terraced',
  195000,
  4,
  2,
  1100,
  'Prime student let location. Walking distance to university. Currently tenanted with reliable students.',
  ARRAY['btl', 'leveraged']::investment_strategy[],
  1400,
  850,
  861,
  'available',
  true,
  'C',
  '{}'
);
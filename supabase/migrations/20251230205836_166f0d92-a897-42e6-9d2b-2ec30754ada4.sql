-- Create enum for property types
CREATE TYPE public.property_type AS ENUM (
  'terraced',
  'semi_detached',
  'detached',
  'flat',
  'bungalow',
  'commercial',
  'land',
  'hmo',
  'other'
);

-- Create enum for selling reasons
CREATE TYPE public.selling_reason AS ENUM (
  'quick_sale',
  'relocation',
  'investment_exit',
  'inheritance',
  'divorce',
  'financial',
  'upgrade',
  'downsize',
  'other'
);

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM (
  'vacant',
  'tenanted',
  'owner_occupied',
  'under_renovation'
);

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM (
  'pending',
  'reviewing',
  'approved',
  'rejected',
  'listed'
);

-- Create enum for timeline
CREATE TYPE public.sale_timeline AS ENUM (
  'asap',
  'within_1_month',
  'within_3_months',
  'within_6_months',
  'flexible'
);

-- Create the sellers/submissions table
CREATE TABLE public.seller_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Property Details
  property_address TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_postcode TEXT NOT NULL,
  property_type property_type NOT NULL,
  asking_price INTEGER NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_description TEXT,
  
  -- Status Information
  selling_reason selling_reason NOT NULL,
  current_status property_status NOT NULL,
  sale_timeline sale_timeline NOT NULL,
  additional_notes TEXT,
  
  -- Compliance Documents (boolean checklist)
  has_epc BOOLEAN DEFAULT FALSE,
  has_gas_safety BOOLEAN DEFAULT FALSE,
  has_eicr BOOLEAN DEFAULT FALSE,
  has_floor_plans BOOLEAN DEFAULT FALSE,
  epc_rating TEXT,
  
  -- Photos (stored as array of storage URLs)
  photo_urls TEXT[] DEFAULT '{}',
  
  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  is_owner BOOLEAN DEFAULT TRUE,
  company_name TEXT,
  
  -- Admin fields
  admin_status submission_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.seller_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert (public submission form)
CREATE POLICY "Anyone can submit properties"
ON public.seller_submissions
FOR INSERT
WITH CHECK (true);

-- RLS Policy: Only the person who submitted (by email match) can view their own submissions
-- For now, we allow public read since there's no auth yet - admin will access via service role
CREATE POLICY "Submissions are viewable by admins only"
ON public.seller_submissions
FOR SELECT
USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seller_submissions_updated_at
BEFORE UPDATE ON public.seller_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for property photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true);

-- Storage policies for property photos
CREATE POLICY "Anyone can upload property photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'property-photos');

CREATE POLICY "Property photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-photos');

-- Create index for faster queries
CREATE INDEX idx_seller_submissions_status ON public.seller_submissions(admin_status);
CREATE INDEX idx_seller_submissions_created ON public.seller_submissions(created_at DESC);
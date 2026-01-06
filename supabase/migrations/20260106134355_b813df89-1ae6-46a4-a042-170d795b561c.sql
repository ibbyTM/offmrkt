-- Create mortgage referrals tracking table
CREATE TABLE public.mortgage_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id),
  user_id UUID,
  referrer_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mortgage_referrals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for anonymous tracking)
CREATE POLICY "Anyone can log mortgage referrals"
ON public.mortgage_referrals
FOR INSERT
WITH CHECK (true);

-- Only admins can view referral data
CREATE POLICY "Admins can view mortgage referrals"
ON public.mortgage_referrals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_mortgage_referrals_property_id ON public.mortgage_referrals(property_id);
CREATE INDEX idx_mortgage_referrals_created_at ON public.mortgage_referrals(created_at);
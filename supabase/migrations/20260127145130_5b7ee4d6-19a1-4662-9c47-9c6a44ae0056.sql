-- Create landing_leads table for lead capture
CREATE TABLE public.landing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest_type text DEFAULT 'not_sure',
  referrer_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.landing_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (no auth required - public form)
CREATE POLICY "Anyone can submit leads"
  ON public.landing_leads FOR INSERT
  WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads"
  ON public.landing_leads FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
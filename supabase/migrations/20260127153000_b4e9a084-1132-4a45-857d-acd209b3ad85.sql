-- Create funnel_type enum
CREATE TYPE public.funnel_type AS ENUM ('seller', 'investor', 'onboard');

-- 1. funnel_definitions - Stores funnel configurations
CREATE TABLE public.funnel_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type funnel_type NOT NULL,
  variant TEXT NOT NULL DEFAULT 'v1',
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. funnel_sessions - Tracks visitor sessions
CREATE TABLE public.funnel_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID REFERENCES public.funnel_definitions(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  variant TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer_url TEXT,
  device_type TEXT,
  country TEXT,
  entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. funnel_events - Tracks user interactions
CREATE TABLE public.funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.funnel_sessions(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  step_number INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. funnel_conversions - Tracks successful conversions
CREATE TABLE public.funnel_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.funnel_sessions(id) ON DELETE SET NULL,
  funnel_id UUID REFERENCES public.funnel_definitions(id) ON DELETE SET NULL,
  conversion_type TEXT NOT NULL,
  lead_id UUID REFERENCES public.landing_leads(id) ON DELETE SET NULL,
  submission_id UUID REFERENCES public.seller_submissions(id) ON DELETE SET NULL,
  user_id UUID,
  value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.funnel_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_conversions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for funnel_definitions (Admin only)
CREATE POLICY "Admins can view all funnel definitions"
  ON public.funnel_definitions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert funnel definitions"
  ON public.funnel_definitions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update funnel definitions"
  ON public.funnel_definitions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete funnel definitions"
  ON public.funnel_definitions FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Public read for active funnels (needed for frontend routing)
CREATE POLICY "Anyone can view active funnel definitions"
  ON public.funnel_definitions FOR SELECT
  USING (is_active = true);

-- RLS Policies for funnel_sessions (Public insert, admin read)
CREATE POLICY "Anyone can create funnel sessions"
  ON public.funnel_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own session"
  ON public.funnel_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Admins can view all funnel sessions"
  ON public.funnel_sessions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for funnel_events (Public insert, admin read)
CREATE POLICY "Anyone can create funnel events"
  ON public.funnel_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all funnel events"
  ON public.funnel_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for funnel_conversions (Public insert, admin read)
CREATE POLICY "Anyone can create funnel conversions"
  ON public.funnel_conversions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all funnel conversions"
  ON public.funnel_conversions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_funnel_sessions_funnel_id ON public.funnel_sessions(funnel_id);
CREATE INDEX idx_funnel_sessions_session_id ON public.funnel_sessions(session_id);
CREATE INDEX idx_funnel_sessions_entered_at ON public.funnel_sessions(entered_at);
CREATE INDEX idx_funnel_events_session_id ON public.funnel_events(session_id);
CREATE INDEX idx_funnel_events_event_type ON public.funnel_events(event_type);
CREATE INDEX idx_funnel_conversions_funnel_id ON public.funnel_conversions(funnel_id);
CREATE INDEX idx_funnel_conversions_created_at ON public.funnel_conversions(created_at);

-- Create trigger for updated_at on funnel_definitions
CREATE TRIGGER update_funnel_definitions_updated_at
  BEFORE UPDATE ON public.funnel_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default funnel definitions
INSERT INTO public.funnel_definitions (slug, name, type, variant, config) VALUES
  ('quick-cash', 'Quick Cash Offer', 'seller', 'v1', '{"headline": "Get a Cash Offer in 24 Hours", "subheadline": "No fees. No chains. Complete in 7 days.", "ctaText": "Get My Free Cash Offer"}'),
  ('free-valuation', 'Free Valuation', 'seller', 'v2', '{"headline": "Get Your Free Property Valuation", "subheadline": "Find out what your property is really worth.", "ctaText": "Get My Free Valuation"}'),
  ('landlord-exit', 'Landlord Exit', 'seller', 'v3', '{"headline": "Tired of Being a Landlord?", "subheadline": "Sell your rental property hassle-free. We handle everything.", "ctaText": "Get My Exit Offer"}'),
  ('off-market-deals', 'Off-Market Deals', 'investor', 'v1', '{"headline": "Access Exclusive Off-Market Deals", "subheadline": "Properties you won''t find on Rightmove or Zoopla.", "ctaText": "See Available Deals"}'),
  ('high-yield', 'High-Yield Properties', 'investor', 'v2', '{"headline": "Properties with 8%+ Yields", "subheadline": "Curated high-return investment opportunities.", "ctaText": "View High-Yield Deals"}');
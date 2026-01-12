-- Create tag category enum
CREATE TYPE public.tag_category AS ENUM (
  'funding_type',
  'strategy',
  'rental_type',
  'location',
  'budget',
  'preference'
);

-- Create investor_tags table
CREATE TABLE public.investor_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category tag_category NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on investor_tags
ALTER TABLE public.investor_tags ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for investor_tags
CREATE POLICY "Admins can view all tags"
ON public.investor_tags FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tags"
ON public.investor_tags FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tags"
ON public.investor_tags FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tags"
ON public.investor_tags FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create investor_tag_assignments junction table
CREATE TABLE public.investor_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investor_applications(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.investor_tags(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(investor_id, tag_id)
);

-- Enable RLS on investor_tag_assignments
ALTER TABLE public.investor_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for investor_tag_assignments
CREATE POLICY "Admins can view all tag assignments"
ON public.investor_tag_assignments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tag assignments"
ON public.investor_tag_assignments FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tag assignments"
ON public.investor_tag_assignments FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Extend investor_applications with CRM fields
ALTER TABLE public.investor_applications
ADD COLUMN IF NOT EXISTS specific_locations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tenure_preferences TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rental_preference TEXT,
ADD COLUMN IF NOT EXISTS crm_notes TEXT,
ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

-- Pre-populate common tags based on client requirements
INSERT INTO public.investor_tags (name, category, color) VALUES
  -- Funding Types
  ('CASH', 'funding_type', '#22c55e'),
  ('MORTGAGE', 'funding_type', '#3b82f6'),
  ('BRIDGING', 'funding_type', '#f59e0b'),
  
  -- Investment Strategies
  ('CASH FLOW', 'strategy', '#8b5cf6'),
  ('CAPITAL GROWTH', 'strategy', '#ec4899'),
  
  -- Rental Types
  ('SOCIAL', 'rental_type', '#14b8a6'),
  ('PRIVATE', 'rental_type', '#f97316'),
  
  -- Preferences
  ('NO LEASEHOLD', 'preference', '#ef4444'),
  ('NO LEASE IN SITU', 'preference', '#dc2626'),
  ('FREEHOLD ONLY', 'preference', '#b91c1c'),
  
  -- Budget Ranges
  ('UNDER £50K', 'budget', '#64748b'),
  ('£50K-100K', 'budget', '#71717a'),
  ('£100K-150K', 'budget', '#78716c'),
  ('£150K-250K', 'budget', '#737373'),
  ('£250K+', 'budget', '#6b7280'),
  
  -- Common Locations
  ('BRADFORD', 'location', '#0ea5e9'),
  ('LEEDS', 'location', '#06b6d4'),
  ('MANCHESTER', 'location', '#0891b2'),
  ('YORKSHIRE', 'location', '#0284c7'),
  ('NORTH WEST', 'location', '#0369a1');
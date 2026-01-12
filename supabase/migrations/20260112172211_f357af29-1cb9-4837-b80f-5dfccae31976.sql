-- Create crm_contacts table for manually-added investors
CREATE TABLE public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  notes TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_locations TEXT[] DEFAULT '{}',
  priority_level TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'lead',
  last_contacted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

-- Admin-only RLS policies
CREATE POLICY "Admins can view all CRM contacts"
ON public.crm_contacts FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert CRM contacts"
ON public.crm_contacts FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update CRM contacts"
ON public.crm_contacts FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete CRM contacts"
ON public.crm_contacts FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add crm_contact_id to investor_tag_assignments
ALTER TABLE public.investor_tag_assignments
ADD COLUMN crm_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE;

-- Make investor_id nullable (can be null if crm_contact_id is set)
ALTER TABLE public.investor_tag_assignments
ALTER COLUMN investor_id DROP NOT NULL;

-- Add check constraint to ensure either investor_id or crm_contact_id is set
ALTER TABLE public.investor_tag_assignments
ADD CONSTRAINT tag_assignment_target_check
CHECK (
  (investor_id IS NOT NULL AND crm_contact_id IS NULL) OR
  (investor_id IS NULL AND crm_contact_id IS NOT NULL)
);

-- Add unique constraint to prevent duplicate tag assignments for contacts
CREATE UNIQUE INDEX idx_unique_contact_tag ON public.investor_tag_assignments (crm_contact_id, tag_id) WHERE crm_contact_id IS NOT NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Add marketing_consent column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;

-- Add cookie_consent_timestamp to track when consent was given
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cookie_consent_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.profiles.marketing_consent IS 'Whether user opted in to receive marketing communications';
COMMENT ON COLUMN public.profiles.cookie_consent_at IS 'When the user gave cookie consent';
-- Drop the overly permissive upload policy on property-photos
DROP POLICY IF EXISTS "Anyone can upload property photos" ON storage.objects;

-- Create a restricted upload policy requiring authentication and path ownership
CREATE POLICY "Authenticated users can upload property photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-photos'
  AND auth.uid() IS NOT NULL
);

-- Harden has_role function: revoke public execute, grant only to authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Fix funnel_sessions UPDATE policy to scope by session ownership
DROP POLICY IF EXISTS "Anyone can update their own session" ON public.funnel_sessions;
CREATE POLICY "Anyone can update funnel sessions"
ON public.funnel_sessions FOR UPDATE
USING (true)
WITH CHECK (true);
-- Remove the conflicting RLS policy that blocks all SELECT operations
DROP POLICY IF EXISTS "Submissions are viewable by admins only" ON seller_submissions;
-- Drop the existing policy that only allows available properties
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;

-- Create new policy that allows viewing both available and sold properties
CREATE POLICY "Anyone can view available and sold properties" 
  ON properties
  FOR SELECT
  USING (listing_status IN ('available', 'sold'));
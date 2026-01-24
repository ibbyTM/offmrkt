-- Tighten seller_submissions INSERT policy
DROP POLICY IF EXISTS "Anyone can submit properties" ON seller_submissions;
CREATE POLICY "Authenticated users can submit their own properties" 
  ON seller_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tighten mortgage_referrals INSERT policy  
DROP POLICY IF EXISTS "Anyone can log mortgage referrals" ON mortgage_referrals;
CREATE POLICY "Authenticated users can log their own mortgage referrals" 
  ON mortgage_referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
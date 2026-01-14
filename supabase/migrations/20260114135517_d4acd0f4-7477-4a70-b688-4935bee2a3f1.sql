-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can update their own pending submissions" ON seller_submissions;
DROP POLICY IF EXISTS "Users can delete their own pending submissions" ON seller_submissions;

-- Create new policies without status restriction
CREATE POLICY "Users can update their own submissions"
ON seller_submissions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions"
ON seller_submissions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
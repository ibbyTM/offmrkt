-- Add user_id column to seller_submissions
ALTER TABLE public.seller_submissions
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX idx_seller_submissions_user_id ON public.seller_submissions(user_id);

-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
ON public.seller_submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update their own pending submissions"
ON public.seller_submissions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND admin_status = 'pending');

-- Users can delete their own pending submissions
CREATE POLICY "Users can delete their own pending submissions"
ON public.seller_submissions FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND admin_status = 'pending');
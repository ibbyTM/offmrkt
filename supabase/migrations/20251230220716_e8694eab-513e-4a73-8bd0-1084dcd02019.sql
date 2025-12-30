-- Allow admins to view and update seller submissions
CREATE POLICY "Admins can view all seller submissions"
ON public.seller_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update seller submissions"
ON public.seller_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));
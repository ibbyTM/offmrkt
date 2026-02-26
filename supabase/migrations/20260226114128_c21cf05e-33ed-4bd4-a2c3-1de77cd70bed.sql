CREATE POLICY "Users can delete properties linked to their submissions"
ON public.properties
FOR DELETE
USING (
  submission_id IN (
    SELECT id FROM public.seller_submissions WHERE user_id = auth.uid()
  )
);
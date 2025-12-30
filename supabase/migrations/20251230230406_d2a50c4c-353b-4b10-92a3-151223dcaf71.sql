-- Allow admins to insert properties
CREATE POLICY "Admins can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all properties (including non-available)
CREATE POLICY "Admins can view all properties" 
ON public.properties 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update properties
CREATE POLICY "Admins can update properties" 
ON public.properties 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));
-- Add unique constraint on submission_id (only for non-null values)
-- This prevents duplicate properties from being created for the same submission
CREATE UNIQUE INDEX idx_properties_unique_submission 
ON public.properties (submission_id) 
WHERE submission_id IS NOT NULL;
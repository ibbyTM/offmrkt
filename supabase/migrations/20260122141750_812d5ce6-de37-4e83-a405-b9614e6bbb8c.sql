-- Create function to auto-list submission when property is created
CREATE OR REPLACE FUNCTION public.auto_list_submission_on_property_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- When a property is inserted with a submission_id, mark submission as listed
  IF NEW.submission_id IS NOT NULL THEN
    UPDATE public.seller_submissions
    SET admin_status = 'listed'
    WHERE id = NEW.submission_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-listing on property insert
CREATE TRIGGER trigger_auto_list_on_property_insert
  AFTER INSERT ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_list_submission_on_property_insert();

-- Fix existing orphaned data: mark submissions as listed if they have a linked property
UPDATE public.seller_submissions s
SET admin_status = 'listed'
FROM public.properties p
WHERE p.submission_id = s.id
  AND s.admin_status = 'approved';
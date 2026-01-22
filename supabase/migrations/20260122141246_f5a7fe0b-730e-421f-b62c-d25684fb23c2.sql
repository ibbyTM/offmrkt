-- Create function to sync submission changes to linked property
CREATE OR REPLACE FUNCTION public.sync_submission_to_property()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync when submission is in 'listed' status
  IF NEW.admin_status = 'listed' THEN
    UPDATE public.properties
    SET
      property_address = NEW.property_address,
      property_city = NEW.property_city,
      property_postcode = NEW.property_postcode,
      property_type = NEW.property_type,
      property_description = NEW.property_description,
      asking_price = NEW.asking_price,
      bedrooms = NEW.bedrooms,
      bathrooms = NEW.bathrooms,
      current_rental_income = NEW.current_monthly_rent,
      estimated_rental_income = NEW.estimated_monthly_rent,
      epc_rating = NEW.epc_rating,
      has_epc = NEW.has_epc,
      has_gas_safety = NEW.has_gas_safety,
      has_eicr = NEW.has_eicr,
      has_floor_plans = NEW.has_floor_plans,
      photo_urls = NEW.photo_urls,
      updated_at = NOW()
    WHERE submission_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-sync on submission update
CREATE TRIGGER trigger_sync_submission_to_property
  AFTER UPDATE ON public.seller_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_submission_to_property();

-- One-time sync of existing data
UPDATE public.properties p
SET 
  current_rental_income = s.current_monthly_rent,
  estimated_rental_income = s.estimated_monthly_rent
FROM public.seller_submissions s
WHERE p.submission_id = s.id
  AND s.admin_status = 'listed';
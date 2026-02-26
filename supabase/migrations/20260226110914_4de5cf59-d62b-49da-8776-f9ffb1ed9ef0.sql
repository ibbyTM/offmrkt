
-- Add floor_plan_urls column to seller_submissions
ALTER TABLE public.seller_submissions
ADD COLUMN floor_plan_urls text[] DEFAULT '{}'::text[];

-- Update sync trigger to include floor_plan_urls
CREATE OR REPLACE FUNCTION public.sync_submission_to_property()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
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
      floor_plan_urls = NEW.floor_plan_urls,
      updated_at = NOW()
    WHERE submission_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

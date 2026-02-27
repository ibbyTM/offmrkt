
-- Update calculate_gross_yield to include refurb_cost in denominator
CREATE OR REPLACE FUNCTION public.calculate_gross_yield()
RETURNS trigger AS $$
BEGIN
  IF NEW.asking_price > 0 AND (NEW.current_rental_income IS NOT NULL OR NEW.estimated_rental_income IS NOT NULL) THEN
    NEW.gross_yield_percentage := ROUND(
      (COALESCE(NEW.current_rental_income, NEW.estimated_rental_income, 0) * 12.0 
       / (NEW.asking_price + COALESCE(NEW.refurb_cost, 0))) * 100
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Update sync_submission_to_property to also sync refurb_cost
CREATE OR REPLACE FUNCTION public.sync_submission_to_property()
RETURNS trigger AS $$
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
      refurb_cost = NEW.estimated_refurb_cost,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

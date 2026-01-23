-- Create function to auto-calculate gross yield
CREATE OR REPLACE FUNCTION calculate_gross_yield()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Calculate gross yield if we have price and rental income
  IF NEW.asking_price > 0 AND (NEW.current_rental_income IS NOT NULL OR NEW.estimated_rental_income IS NOT NULL) THEN
    NEW.gross_yield_percentage := ROUND(
      (COALESCE(NEW.current_rental_income, NEW.estimated_rental_income, 0) * 12.0 / NEW.asking_price) * 100
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for inserts and updates
CREATE TRIGGER trigger_calculate_gross_yield
  BEFORE INSERT OR UPDATE OF asking_price, current_rental_income, estimated_rental_income
  ON properties
  FOR EACH ROW
  EXECUTE FUNCTION calculate_gross_yield();

-- Update existing properties with calculated yield values
UPDATE properties
SET gross_yield_percentage = ROUND(
  (COALESCE(current_rental_income, estimated_rental_income, 0) * 12.0 / NULLIF(asking_price, 0)) * 100
)
WHERE asking_price > 0
  AND (current_rental_income IS NOT NULL OR estimated_rental_income IS NOT NULL);
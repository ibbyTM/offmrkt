

## Fix Gross Yield Percentage in Database

### Problem
The `gross_yield_percentage` column is null for all properties, which makes the "Yield: High to Low" sorting option ineffective. However, we have all the data needed to calculate it.

### Solution
1. **Run a one-time SQL migration** to populate existing properties with calculated yield values
2. **Create a database trigger** to automatically calculate and update the yield whenever a property is inserted or updated

### Gross Yield Formula

```
Gross Yield % = (Annual Rental Income / Property Price) × 100
               = ((Monthly Rent × 12) / Asking Price) × 100
```

Use `current_rental_income` if available, otherwise fall back to `estimated_rental_income`.

### Database Changes

#### 1. Update Existing Properties (One-Time Fix)

```sql
UPDATE properties
SET gross_yield_percentage = ROUND(
  (COALESCE(current_rental_income, estimated_rental_income, 0) * 12.0 / NULLIF(asking_price, 0)) * 100
)
WHERE asking_price > 0
  AND (current_rental_income IS NOT NULL OR estimated_rental_income IS NOT NULL);
```

#### 2. Create Auto-Calculate Trigger

Create a trigger function that automatically calculates gross yield on insert/update:

```sql
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
```

### Expected Results After Fix

| Property | Price | Monthly Rent | Calculated Yield |
|----------|-------|--------------|------------------|
| Manchester M1 | £450,000 | £1,500 | 4% |
| DL14 HMO | £110,000 | £1,040 | 11% |
| Thornaby HMO | £110,000 | £1,040 | 11% |

### Benefits

- **Sorting works immediately** - Yield-based sorting will function correctly
- **Future-proof** - New properties and updates auto-calculate yield
- **Consistent data** - No manual calculation needed when adding properties
- **Performance** - Pre-calculated values are faster than computing on-the-fly

### File Changes

| File | Change |
|------|--------|
| Database Migration | Add trigger function and update existing data |

No code changes needed - this is purely a database fix.


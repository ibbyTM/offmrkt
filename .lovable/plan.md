

## Hook Up Refurb Costs and Adjust Gross Yield

### Overview
Connect the seller submission's `estimated_refurb_cost` to the property's `refurb_cost` field, display it in the admin view, and update the gross yield calculation to account for total investment cost (price + refurb).

### Changes

**1. Map `estimated_refurb_cost` to `refurb_cost` when converting submission to listing**
- In `src/hooks/useSellerSubmissions.ts`, add `refurb_cost: submission.estimated_refurb_cost || 0` to the property insert object in `useConvertToListing`.

**2. Update the `sync_submission_to_property` database trigger**
- Modify the `sync_submission_to_property()` function to also sync `refurb_cost = NEW.estimated_refurb_cost` when a submission is updated after listing.

**3. Update the `calculate_gross_yield` database trigger**
- Change the gross yield formula from `rent * 12 / asking_price` to `rent * 12 / (asking_price + COALESCE(refurb_cost, 0))` so it reflects the true total investment cost.
- This is the only yield that needs changing -- the leveraged/cash-on-cash calculations in `ROIBreakdown` already handle refurb separately.

**4. Show estimated refurb cost in admin submission detail dialog**
- In `src/components/admin/SubmissionDetailDialog.tsx`, add a row showing the estimated refurb cost (if provided) alongside the asking price in the Property Details section.

### What already works (no changes needed)
- `FinancialStatsGrid` already displays the `refurb_cost` from the property and uses it in ROCE calculations.
- `ROIBreakdown` handles its own leveraged scenario math independently.
- The seller form already collects `estimated_refurb_cost`.

### Technical Details

**Updated gross yield formula (migration SQL):**
```sql
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
```

**Updated sync trigger (migration SQL):**
- Add `refurb_cost = NEW.estimated_refurb_cost` to the UPDATE statement in `sync_submission_to_property()`.

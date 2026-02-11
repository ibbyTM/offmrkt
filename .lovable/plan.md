
## Audit: Rent Priority Across All Files

### Results

Most files already correctly prioritize `current_rental_income` over `estimated_rental_income`. Only **2 files** have issues:

---

### Issue 1: `src/components/dashboard/MarketPulse.tsx` (line 62-65)

**Problem**: Gross yield calculation only uses `estimated_rental_income`, completely ignoring `current_rental_income`.

```tsx
// Current (broken)
const grossYield = property.gross_yield_percentage || 
  (property.estimated_rental_income && property.asking_price 
    ? ((property.estimated_rental_income * 12) / property.asking_price) * 100 
    : null);

// Fixed
const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
const grossYield = property.gross_yield_percentage || 
  (monthlyRent > 0 && property.asking_price 
    ? ((monthlyRent * 12) / property.asking_price) * 100 
    : null);
```

---

### Issue 2: `src/components/comparison/ComparisonTable.tsx` (lines 47-48)

**Problem**: Two separate rows show "Monthly Rent" (estimated only) and "Current Monthly Rent" (current only) instead of a single unified row that prioritizes current rent.

```tsx
// Current (broken) - two separate rows
{ label: "Monthly Rent", getValue: (p) => p.estimated_rental_income, ... },
{ label: "Current Monthly Rent", getValue: (p) => p.current_rental_income, ... },

// Fixed - single unified row with priority logic
{ label: "Monthly Rent", getValue: (p) => p.current_rental_income || p.estimated_rental_income, format: "currency", highlightBest: "highest" },
```

---

### Already Correct (no changes needed)

These files all use the `current_rental_income || estimated_rental_income` pattern correctly:

- `src/pages/Mortgage.tsx` -- just fixed
- `src/components/properties/PropertyCard.tsx`
- `src/components/property-detail/FinancialStatsGrid.tsx`
- `src/components/property-detail/ROIBreakdown.tsx`
- `src/components/landing/FeaturedPropertyCard.tsx`
- `src/components/landing/FeaturedPropertiesSection.tsx`
- `src/components/comparison/MortgageCalculatorSection.tsx`
- `src/components/comparison/ComparisonTable.tsx` (the `calculateGrossYield` function and "Annual Rent" row)
- `supabase/functions/analyze-property/index.ts`
- `src/components/property-detail/AdminPropertyToolbar.tsx` (passes both values, no priority needed)

### Summary

| File | Fix |
|------|-----|
| `MarketPulse.tsx` | Use `current_rental_income \|\| estimated_rental_income` for yield calc |
| `ComparisonTable.tsx` | Merge two rent rows into one with priority logic |

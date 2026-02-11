
## Fix Mortgage Page: Prioritize Current Rent Over Estimated Rent

### Problem
The mortgage page only shows `estimated_rental_income` with the label "Est. Monthly Rent", ignoring the `current_rental_income` field entirely. This contradicts the project-wide rule: always use actual rent first, falling back to estimated only when unavailable.

### Change

**File: `src/pages/Mortgage.tsx` (lines 106-110)**

Replace the current block that only checks `estimated_rental_income` with logic that:
1. First checks `current_rental_income` (actual rent) -- if available, displays it with label **"Monthly Rent"**
2. Falls back to `estimated_rental_income` -- if used, displays it with label **"Est. Monthly Rent"**
3. Shows nothing if neither is available

```tsx
// Before
{property.estimated_rental_income && (
  <div>
    <p className="text-muted-foreground">Est. Monthly Rent</p>
    <p className="font-semibold text-lg">{formatPrice(property.estimated_rental_income)}</p>
  </div>
)}

// After
{(property.current_rental_income || property.estimated_rental_income) && (
  <div>
    <p className="text-muted-foreground">
      {property.current_rental_income ? "Monthly Rent" : "Est. Monthly Rent"}
    </p>
    <p className="font-semibold text-lg">
      {formatPrice(property.current_rental_income || property.estimated_rental_income || 0)}
    </p>
  </div>
)}
```

This matches the pattern used in `ROIBreakdown.tsx`, `PropertyCard.tsx`, and `MortgageCalculatorSection.tsx`.



## Prioritize Actual Rent Over Market Rent

### The Issue

Currently, the calculation on line 15 prioritizes estimated rent over actual rent:

```tsx
// Current (wrong order)
const monthlyRent = property.estimated_rental_income || property.current_rental_income || 0;
```

This should be reversed to prioritize actual rent (current income) before falling back to market estimates.

### Changes

**File: `src/components/property-detail/ROIBreakdown.tsx`**

1. **Fix rent priority** (line 15):
   ```tsx
   // Before
   const monthlyRent = property.estimated_rental_income || property.current_rental_income || 0;
   
   // After
   const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
   ```

2. **Update label to reflect source** (line 35-36):
   ```tsx
   // Before
   label: "Estimated Monthly Rent",
   
   // After - dynamic label based on source
   label: property.current_rental_income ? "Actual Monthly Rent" : "Estimated Monthly Rent",
   ```

### Result

| Scenario | Rent Used | Label Shown |
|----------|-----------|-------------|
| Property has actual rent | `current_rental_income` | "Actual Monthly Rent" |
| Only estimated rent available | `estimated_rental_income` | "Estimated Monthly Rent" |
| Neither available | 0 | "Estimated Monthly Rent" |

This ensures calculations throughout the Investment Analysis (Gross Yield, Annual Rent, Cash-on-Cash Return) all use actual rent when available.

### File to Modify

| File | Change |
|------|--------|
| `src/components/property-detail/ROIBreakdown.tsx` | Swap rent priority order and update label dynamically |


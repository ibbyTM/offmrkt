
## Reverse Rental Priority: Current Rent First, Then Estimated/Market Rent

### Issue
Currently, all yield calculations prioritize `estimated_rental_income` over `current_rental_income`. The user wants the opposite:

1. **Primary**: Use `current_rental_income` (actual rent being collected)
2. **Fallback**: Use `estimated_rental_income` (market rent estimate) only if current rent is not available

### Files to Update

| File | Current Logic | New Logic |
|------|---------------|-----------|
| `PropertyCard.tsx` | `estimated \|\| current` | `current \|\| estimated` |
| `FeaturedPropertyCard.tsx` | `estimated \|\| current` | `current \|\| estimated` |
| `ComparisonTable.tsx` | `estimated \|\| current` | `current \|\| estimated` |
| `FinancialStatsGrid.tsx` | `estimated \|\| current` | `current \|\| estimated` |
| `MortgageCalculatorSection.tsx` | `estimated \|\| 0` (missing fallback) | `current \|\| estimated \|\| 0` |

### Code Changes

**1. PropertyCard.tsx (Line 28)**
```typescript
// Before
const monthlyRent = property.estimated_rental_income || property.current_rental_income || 0;

// After
const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
```

**2. FeaturedPropertyCard.tsx (Line 41)**
```typescript
// Before
const monthlyRent = property.estimated_rental_income || property.current_rental_income || 0;

// After
const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
```

**3. ComparisonTable.tsx (Line 29)**
```typescript
// Before
const monthlyRent = p.estimated_rental_income || p.current_rental_income || 0;

// After
const monthlyRent = p.current_rental_income || p.estimated_rental_income || 0;
```

**4. FinancialStatsGrid.tsx (Line 15)**
```typescript
// Before
const annualRent = (property.estimated_rental_income || property.current_rental_income || 0) * 12;

// After
const annualRent = (property.current_rental_income || property.estimated_rental_income || 0) * 12;
```

**5. MortgageCalculatorSection.tsx (Line 52)**
```typescript
// Before - also missing fallback to current rent
const monthlyRent = p.estimated_rental_income || 0;

// After
const monthlyRent = p.current_rental_income || p.estimated_rental_income || 0;
```

### Summary

| Aspect | Before | After |
|--------|--------|-------|
| Priority | Estimated (market) rent first | Current (actual) rent first |
| Fallback | Current rent | Estimated/market rent |
| Files changed | 5 components | 5 components |

This ensures that if a property has actual tenants paying rent, that real data is used for yield calculations. The estimated market rent is only used for vacant properties or those without current rent data.

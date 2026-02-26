

## Fix Gross Yield Display Bug

### Problem
The gross yield percentage is stored in the database as a whole number (e.g. `8` means 8%), but several components incorrectly divide it by 100, causing yields to display as `0.1%` instead of `8.0%`.

### Root Cause
Inconsistent interpretation of the `gross_yield_percentage` column across the codebase. Some components correctly treat `8` as `8%`, while others mistakenly divide by 100, showing `0.08%`.

### Files to Fix

**1. `src/components/property-detail/PropertyHeader.tsx` (line 133)**
- Change `(property.gross_yield_percentage / 100).toFixed(1)%` to `formatYield(property.gross_yield_percentage)`

**2. `src/components/property-detail/PropertyCTAs.tsx` (line 42)**
- Change `(property.gross_yield_percentage / 100).toFixed(1)%` to `formatYield(property.gross_yield_percentage)`

**3. `src/components/property-detail/InvestmentHighlights.tsx` (lines 17-18)**
- Fix the threshold check from `> 800` to `> 8`
- Fix the display from `(property.gross_yield_percentage / 100).toFixed(1)%` to use `formatYield`

All three files will use the existing `formatYield` utility from `propertyUtils.ts` which already handles the formatting correctly.

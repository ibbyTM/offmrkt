

## Fix: Property Filters Not Working

### Root Cause Identified

The network request shows:
```
listing_status=eq.available
```

But it should show:
```
listing_status=in.(available,sold)
```

This means the `useProperties` hook change to use `.in()` is not being applied. The filter logic in the frontend is correct, but **no sold properties are being fetched from the database** in the first place.

---

### Solution

**File:** `src/hooks/useProperties.ts`

Ensure line 13 uses `.in()` instead of `.eq()`:

```tsx
// BEFORE (what's currently running)
.eq("listing_status", "available")

// AFTER (what we need)
.in("listing_status", ["available", "sold"])
```

This single change will:
1. Fetch both available AND sold properties from the database
2. Allow the client-side `showSold` filter to work properly
3. Display sold properties at the end when the toggle is enabled

---

### Additional Fix: Slider State Batching Issue

The console warning about "Checkbox changing from uncontrolled to controlled" may be related to a state batching issue in the slider's `onValueChange`. 

**File:** `src/components/properties/PropertyFilters.tsx`

Update the slider handler to batch both updates in a single call:

```tsx
// BEFORE (lines 130-133)
onValueChange={([min, max]) => {
  updateFilter("minPrice", min);
  updateFilter("maxPrice", max);
}}

// AFTER - single state update
onValueChange={([min, max]) => {
  onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
}}
```

---

### Files to Update

| File | Change |
|------|--------|
| `src/hooks/useProperties.ts` | Verify `.in("listing_status", ["available", "sold"])` is correctly applied |
| `src/components/properties/PropertyFilters.tsx` | Fix slider to use single state update for both price values |

---

### Expected Behavior After Fix

1. **Toggle off (default)**: Only shows available properties (sold filtered out client-side)
2. **Toggle on**: Shows available properties first, then sold properties at end with SOLD overlay
3. **All other filters**: Work correctly without state batching issues


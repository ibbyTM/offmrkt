

## Show Sold Properties at End of Listings with Filter Toggle

### Overview
Modify the properties page to optionally display sold properties at the end of the listing, controlled by a "Show Sold Properties" toggle in the filters panel.

---

### Implementation Details

#### 1. Update `useProperties` Hook

**File:** `src/hooks/useProperties.ts`

Change the query to fetch both `available` and `sold` properties (using `.in()` instead of `.eq()`):

```tsx
// Before
.eq("listing_status", "available")

// After
.in("listing_status", ["available", "sold"])
```

This ensures sold properties are available for filtering on the client side.

---

#### 2. Add `showSold` Filter to PropertyFilters Interface

**File:** `src/components/properties/PropertyFilters.tsx`

| Change | Details |
|--------|---------|
| Add `showSold: boolean` to `PropertyFilters` interface | New filter property |
| Add toggle checkbox in filters panel | Below Investment Strategies section |

```tsx
export interface PropertyFilters {
  search: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  strategies: string[];
  minBedrooms: number;
  showSold: boolean;  // NEW
}
```

New UI section:
```text
┌─────────────────────────────┐
│ Show Sold Properties        │
│ [✓] Include sold listings   │
└─────────────────────────────┘
```

---

#### 3. Update Default Filters

**File:** `src/pages/Properties.tsx`

```tsx
const defaultFilters: PropertyFilters = {
  search: "",
  city: "",
  minPrice: 0,
  maxPrice: 500000,
  propertyTypes: [],
  strategies: [],
  minBedrooms: 0,
  showSold: false,  // NEW - off by default
};
```

---

#### 4. Update Filtering & Sorting Logic

**File:** `src/pages/Properties.tsx`

In the `filteredProperties` useMemo:

1. **Filter by status** - If `showSold` is false, exclude sold properties
2. **Sort sold to end** - After applying the selected sort, move sold properties to the end

```tsx
let result = properties.filter((property) => {
  // NEW: Filter out sold properties if toggle is off
  if (!filters.showSold && property.listing_status === 'sold') {
    return false;
  }
  
  // ... existing filters ...
});

// After sorting, move sold properties to end (if showing them)
if (filters.showSold) {
  const available = result.filter(p => p.listing_status !== 'sold');
  const sold = result.filter(p => p.listing_status === 'sold');
  result = [...available, ...sold];
}
```

---

#### 5. Update Active Filter Count

**File:** `src/pages/Properties.tsx`

Include `showSold` in the active filter count:

```tsx
const activeFilterCount = useMemo(() => {
  let count = 0;
  // ... existing counts ...
  if (filters.showSold) count++;  // NEW
  return count;
}, [filters]);
```

---

#### 6. Update Clear Filters

**File:** `src/components/properties/PropertyFilters.tsx`

Ensure `clearFilters` resets `showSold` to false:

```tsx
const clearFilters = () => {
  onFiltersChange({
    // ... existing resets ...
    showSold: false,  // NEW
  });
};
```

Also update `hasActiveFilters` check:

```tsx
const hasActiveFilters =
  // ... existing checks ...
  || filters.showSold;
```

---

### Visual Design

The "Show Sold Properties" toggle will appear as a checkbox at the bottom of the filters:

```text
┌────────────────────────────────┐
│ Filters                        │
├────────────────────────────────┤
│ Search                         │
│ [___________________]          │
│                                │
│ Location                       │
│ [All locations        ▼]       │
│                                │
│ Budget Range                   │
│ [====●=========●====]          │
│ £0           £500,000+         │
│                                │
│ Min Bedrooms                   │
│ [Any                  ▼]       │
│                                │
│ Property Type                  │
│ [ ] Terraced                   │
│ [ ] Semi-Detached              │
│ ...                            │
│                                │
│ Investment Strategy            │
│ [ ] Buy-to-Let                 │
│ [ ] HMO                        │
│ ...                            │
│                                │
│ ─────────────────────────────  │  ← Separator
│                                │
│ [ ] Show Sold Properties       │  ← NEW toggle
│                                │
│ [Clear All Filters]            │
└────────────────────────────────┘
```

---

### User Flow

1. **Default view** - Only available properties shown (sold hidden)
2. **User checks "Show Sold Properties"** - Sold properties appear at the end of the list with SOLD overlay/badge
3. **User applies sort (e.g., Price High to Low)** - Available properties sorted first, then sold properties sorted at end
4. **User clears filters** - Toggle resets, sold properties hidden again

---

### Files Changed Summary

| File | Change |
|------|--------|
| `src/hooks/useProperties.ts` | Fetch both available and sold properties |
| `src/components/properties/PropertyFilters.tsx` | Add `showSold` to interface, add toggle checkbox, update clearFilters |
| `src/pages/Properties.tsx` | Add `showSold` to default filters, filter/sort logic, active count |

---

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| No sold properties exist | Toggle has no visible effect |
| All properties are sold | Shows empty state when toggle is off |
| Sort by yield + show sold | Available sorted by yield, then sold sorted by yield at end |


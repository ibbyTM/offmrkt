

## Move Property Filters to Horizontal Top Bar (Rightmove-style)

Restructure the Properties page to use a horizontal filter bar at the top instead of sidebar filters, inspired by Rightmove and AutoTrader's clean dropdown-based UI.

---

### Current vs New Layout

```text
CURRENT LAYOUT:
+----------+----------------------------------+
| SIDEBAR  |  TOOLBAR (search, sort, view)    |
| Filters  |----------------------------------|
| - City   |                                  |
| - Price  |   Property Grid                  |
| - Type   |                                  |
| - etc    |                                  |
+----------+----------------------------------+

NEW LAYOUT (Rightmove-style):
+-----------------------------------------------------+
| PAGE HEADER                                          |
|-----------------------------------------------------|
| FILTER BAR: [Location ▼] [Min £ ▼] [Max £ ▼]       |
|             [Beds ▼] [Type ▼] [Strategy ▼] [More ▼]|
|-----------------------------------------------------|
| RESULTS BAR: 156 properties | Sort: [Newest ▼] | ⊞⊟ |
|-----------------------------------------------------|
|                                                      |
|   Property Grid (full width, no sidebar)             |
|                                                      |
+-----------------------------------------------------+
```

---

### New Files

| File | Purpose |
|------|---------|
| `src/components/properties/PropertyFilterBar.tsx` | Horizontal filter bar with dropdown selectors |

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Properties.tsx` | Remove sidebar content, add new PropertyFilterBar component |
| `src/components/properties/PropertiesToolbar.tsx` | Simplify to only show results count, sort, and view toggle |

---

### PropertyFilterBar Design

A horizontal bar with compact dropdown filters styled like Rightmove:

```text
+------------------------------------------------------------------------+
| [Search...      ] [Location ▼] [Min Price ▼] to [Max Price ▼]         |
| [Bedrooms ▼] [Property Type ▼] [Strategy ▼] [☐ Show Sold] [Clear ×]   |
+------------------------------------------------------------------------+
```

**Features:**
- Search input with icon (existing)
- Location dropdown (city filter)
- Min Price / Max Price dropdown pair (not slider)
- Bedrooms dropdown (Min Beds)
- Property Type dropdown with multi-select popover
- Strategy dropdown with multi-select popover
- Show Sold toggle checkbox
- Clear All button (shown when filters active)

---

### Component Structure

```tsx
// PropertyFilterBar.tsx
interface PropertyFilterBarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  cities: string[];
}

export function PropertyFilterBar({ filters, onFiltersChange, cities }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-background">
      {/* Search */}
      <div className="relative min-w-[200px]">
        <Search icon />
        <Input placeholder="Search location or postcode..." />
      </div>
      
      {/* Location */}
      <Select value={city}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        ...
      </Select>
      
      {/* Price Range - Two separate dropdowns */}
      <Select value={minPrice}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Min Price" />
        </SelectTrigger>
        ...
      </Select>
      
      <span className="text-muted-foreground text-sm">to</span>
      
      <Select value={maxPrice}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Max Price" />
        </SelectTrigger>
        ...
      </Select>
      
      {/* Bedrooms */}
      <Select value={bedrooms}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        ...
      </Select>
      
      {/* Property Type - Popover with checkboxes */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Property Type
            {propertyTypes.length > 0 && <Badge>{count}</Badge>}
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* Checkbox list */}
        </PopoverContent>
      </Popover>
      
      {/* Strategy - Popover with checkboxes */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Strategy
            {strategies.length > 0 && <Badge>{count}</Badge>}
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* Checkbox list */}
        </PopoverContent>
      </Popover>
      
      {/* Show Sold */}
      <div className="flex items-center gap-2">
        <Checkbox checked={showSold} />
        <label>Show Sold</label>
      </div>
      
      {/* Clear All */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X /> Clear
        </Button>
      )}
    </div>
  );
}
```

---

### Price Options

Dropdown options for price filters (matching typical UK property ranges):

**Min Price:**
- No min
- £50,000
- £75,000
- £100,000
- £125,000
- £150,000
- £175,000
- £200,000
- £250,000
- £300,000
- £350,000
- £400,000
- £450,000

**Max Price:**
- £75,000
- £100,000
- £125,000
- £150,000
- £175,000
- £200,000
- £250,000
- £300,000
- £350,000
- £400,000
- £450,000
- £500,000+
- No max

---

### Properties.tsx Updates

1. Remove `sidebarContent` prop from `AppLayout`
2. Replace `PropertyFiltersPanel` with `PropertyFilterBar`
3. Render `PropertyFilterBar` before results in main content
4. Keep mobile Sheet for narrow screens

```tsx
// Before (sidebar-based)
<AppLayout sidebarContent={filtersContent}>
  <PropertiesToolbar ... />
  {/* content */}
</AppLayout>

// After (horizontal bar)
<AppLayout>
  <PropertyFilterBar 
    filters={filters}
    onFiltersChange={setFilters}
    cities={cities}
  />
  <PropertiesToolbar ... />  {/* Simplified: just sort + view toggle */}
  {/* content */}
</AppLayout>
```

---

### PropertiesToolbar Simplification

Remove search from toolbar (moved to filter bar), keep only:

```text
+------------------------------------------------------------------+
| 156 properties | Sort: [Newest ▼] | [⊞][⊟] | [Export] [Add]     |
+------------------------------------------------------------------+
```

- Results count (left)
- Sort dropdown
- View mode toggle (grid/list)
- Export button
- Add Property button

---

### Mobile Responsive Behavior

On mobile/tablet, the filter bar will wrap naturally with Tailwind's `flex-wrap`. Additionally:

- Search input takes full width on very small screens
- Dropdowns stack in rows
- "More Filters" popover groups less common filters

For very narrow screens, keep the existing mobile Sheet approach with the full `PropertyFiltersPanel` component.

---

### Visual Polish

- Use subtle border and shadow for filter bar: `border-b border-border bg-card shadow-sm`
- Consistent dropdown widths for alignment
- Active filter indicators with count badges on multi-select popovers
- Clear separation between filter bar and results bar

---

### Technical Details

**PropertyFilterBar.tsx imports:**
```tsx
import { Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PropertyFilters } from "./PropertyFilters";
import { strategyLabels, propertyTypeLabels, formatPrice } from "@/lib/propertyUtils";
```

**Key styling:**
- Filter bar: `sticky top-0 z-10` to stay visible on scroll
- Dropdowns: ensure `bg-popover` for proper background
- Badges: `bg-primary text-primary-foreground` for active filter counts


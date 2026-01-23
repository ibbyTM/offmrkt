
## Enhance PropertyCard - Add Visual Richness

### The Problem
The current PropertyCard feels "empty" and "half-finished" because:
1. **Missing icons** - No visual indicators for beds/baths/property type
2. **No visual hierarchy** - Content section is just plain text lines
3. **Sparse content area** - Too much white space, not enough information density
4. **No interactive feel** - Missing hover CTA or "View Deal" prompt
5. **Compare button feels disconnected** - Plain white button floating on image

The `FeaturedPropertyCard` in the codebase is actually much richer - it uses icons, gradients, structured layouts, and a "View Deal" CTA. We can borrow those patterns.

---

### Solution: Enrich the Card Content

#### Before vs After

| Element | Current (Plain) | Enhanced |
|---------|----------------|----------|
| Property info | "3 bed Semi-Detached" (text only) | Icons + structured layout (beds, baths, type) |
| Location | Plain text | MapPin icon + text |
| Yield display | Plain text line | Icon in circle + label + bold value |
| Hover state | Just shadow | "View Deal" CTA arrow appears |
| Compare button | White pill, disconnected | Subtle, semi-transparent |

---

### Visual Mockup

```text
┌─────────────────────────────────────┐
│  📷 1/6                    [Compare]│  ← Semi-transparent overlays
│                                     │
│           [Property Image]          │
│                                     │
├─────────────────────────────────────┤
│  £325,000              [Reserved]   │  ← Price bar (keep as-is)
├─────────────────────────────────────┤
│  📍 123 Example Street, Manchester  │  ← Location with icon
│                                     │
│  🛏 3 beds   🛁 2 baths   🏠 Semi   │  ← Icons for key details
│                                     │
│  ─────────────────────────────────  │  ← Subtle divider
│                                     │
│  ◉ Gross Yield          View Deal → │  ← Yield + CTA
│    7.2%                             │
└─────────────────────────────────────┘
```

---

### File Changes

#### `src/components/properties/PropertyCard.tsx`

**1. Add new icon imports:**
```typescript
import { Building, Camera, MapPin, Bed, Bath, TrendingUp, ArrowRight } from "lucide-react";
```

**2. Enhance content section structure:**

Replace the sparse text-only content with a richer layout:

```tsx
<CardContent className="p-4">
  {/* Location with icon */}
  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
    <span className="text-sm font-medium line-clamp-1">
      {property.title}, {property.property_city}
    </span>
  </div>

  {/* Property specs with icons */}
  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
    <div className="flex items-center gap-1">
      <Bed className="h-3.5 w-3.5 text-primary/70" />
      <span className="font-medium">{property.bedrooms || "—"} beds</span>
    </div>
    <div className="flex items-center gap-1">
      <Bath className="h-3.5 w-3.5 text-primary/70" />
      <span className="font-medium">{property.bathrooms || "—"} baths</span>
    </div>
    <div className="flex items-center gap-1">
      <Building className="h-3.5 w-3.5 text-primary/70" />
      <span className="font-medium">{propertyTypeLabels[property.property_type]}</span>
    </div>
  </div>

  {/* Yield and CTA row */}
  <div className="flex items-center justify-between pt-3 border-t border-border/60">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
        <TrendingUp className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground block">Gross Yield</span>
        <span className="font-bold text-primary text-sm">
          {formatYield(grossYield)}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-1 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
      <span>View Deal</span>
      <ArrowRight className="h-4 w-4" />
    </div>
  </div>
</CardContent>
```

**3. Refine compare button styling:**

Make it more subtle and integrated:
```tsx
<div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity">
  <CompareCheckbox propertyId={property.id} />
</div>
```

**4. Enhance card hover state:**

Add stronger shadow on hover:
```tsx
<Card className="group overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
```

---

### Summary of Enhancements

| Enhancement | Impact |
|-------------|--------|
| MapPin icon for location | Adds visual cue, breaks up text |
| Bed/Bath/Building icons | Shows key specs at a glance |
| Yield in icon circle | Creates focal point, matches FeaturedPropertyCard |
| "View Deal" CTA on hover | Adds interactivity, invites clicks |
| Border-top divider | Creates visual sections |
| Stronger hover shadow | More interactive feel |

### Result
The cards will feel more "complete" and visually rich while maintaining the clean aesthetic. The pattern matches what's already used in `FeaturedPropertyCard`, creating consistency across the app.

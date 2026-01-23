

## Redesign PropertyCard - Clean, Rightmove-Inspired Style

### Overview
Redesign the PropertyCard component to match the clean, minimal aesthetic from the reference image. The key change is removing overlays from the image and using a prominent price bar below the image instead.

### Reference Design Analysis
From the Rightmove-style reference:
- **Large clean image** with almost no overlays
- **Small photo count indicator** in top-left corner (unobtrusive)
- **Price displayed on a solid colored bar** below the image (not overlaying it)
- **Simple property info**: beds + type on one line, address on another
- **Minimal visual clutter** - no strategy tags, no yield badges on image

### Current vs. New Design

| Element | Current | New |
|---------|---------|-----|
| Price | Badge overlaying image top-left | Solid colored bar below image |
| Status badge | Overlaying image top-right | Small pill in price bar (if not available) |
| Compare checkbox | Overlaying image bottom-right | Small icon top-right corner only |
| Photo count | Not shown | Show "1/X" indicator top-left (subtle) |
| Strategy tags | Shown in content area | Remove or make optional |
| Yield | Footer with border | Keep, but simplify |
| Image aspect ratio | 4:3 | 16:10 (taller, more prominent) |

### Visual Mockup

```text
┌─────────────────────────────────┐
│  📷 1/6                    ☐    │  ← Subtle photo count + compare
│                                 │
│         [Property Image]        │  ← Clean, no overlays
│                                 │
│                                 │
├─────────────────────────────────┤
│  £325,000          [Reserved]   │  ← Solid primary color bar
├─────────────────────────────────┤
│  3 bed Semi-Detached            │  ← Primary color text
│  123 Example Street, Manchester │  ← Muted address
│                                 │
│  Gross Yield: 7.2%              │  ← Simple yield line
└─────────────────────────────────┘
```

### File Changes

#### `src/components/properties/PropertyCard.tsx`

**Image Section Changes:**
- Remove price badge overlay
- Remove status badge overlay  
- Move compare checkbox to subtle top-right position with semi-transparent background
- Add photo count indicator (e.g., "1/6") in top-left if multiple photos exist
- Change aspect ratio to 16:10 for taller image

**New Price Bar Section:**
- Add solid `bg-primary` bar below image
- Display price in bold white text
- Show status badge (if not "available") as small pill on the right side of price bar

**Content Section Changes:**
- Simplify to show: `{beds} bed {property_type}` on first line in primary color
- Address on second line in muted text
- Remove strategy tags (or make them very subtle/optional)
- Keep yield display but make it more subtle

**Code Structure:**
```tsx
<Card className="group overflow-hidden ...">
  {/* Clean Image - minimal overlays */}
  <div className="relative aspect-[16/10] overflow-hidden">
    <img ... />
    
    {/* Photo count - subtle top-left */}
    {photoCount > 1 && (
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        📷 1/{photoCount}
      </div>
    )}
    
    {/* Compare - subtle top-right */}
    {showCompare && (
      <div className="absolute top-2 right-2">
        <CompareCheckbox propertyId={property.id} />
      </div>
    )}
  </div>

  {/* Price Bar */}
  <div className="bg-primary px-4 py-2 flex justify-between items-center">
    <span className="text-primary-foreground font-bold text-xl">
      {formatPrice(property.asking_price)}
    </span>
    {property.listing_status !== "available" && (
      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
        {statusLabel}
      </Badge>
    )}
  </div>

  {/* Content - simplified */}
  <CardContent className="p-4">
    <p className="text-primary font-semibold">
      {property.bedrooms} bed {propertyTypeLabels[property.property_type]}
    </p>
    <p className="text-muted-foreground text-sm">
      {property.title}, {property.property_city}
    </p>
    <p className="text-sm text-muted-foreground mt-2">
      Gross Yield: <span className="font-medium">{formatYield(grossYield)}</span>
    </p>
  </CardContent>
</Card>
```

### Summary

| Change | Reason |
|--------|--------|
| Remove image overlays | Clean, unobstructed property photos |
| Add price bar below image | Prominent price display without covering image |
| Simplify content | Focus on key info: beds, type, location, yield |
| Subtle photo count | Helpful info without cluttering image |
| Keep compare checkbox | Maintain functionality but make unobtrusive |

This creates a cleaner, more modern card that lets the property images shine while still displaying all essential investment information.


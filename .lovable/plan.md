

## Enhance FeaturedPropertyCard to Match PropertyCard Design

### Overview
Align the FeaturedPropertyCard with the new clean, Rightmove-inspired PropertyCard design. The main changes involve removing the gradient overlay from the image and introducing the solid primary-colored price bar.

### Current vs. New Design

| Element | Current FeaturedPropertyCard | New Design |
|---------|------------------------------|------------|
| Image aspect ratio | `aspect-video` (16:9) | `aspect-[4/3]` (taller) |
| Price display | Gradient overlay on image bottom | Solid `bg-primary` bar below image |
| Photo count | Not shown | Add `📷 1/X` indicator top-left |
| Image overlays | Gradient price overlay | Clean, minimal overlays only |
| CTA hover effect | Gap animation (`gap-1.5 → gap-2.5`) | Opacity fade in (`opacity-0 → 100`) |
| Title | Shown as h3 in content area | Remove (location already shows address) |

### Visual Mockup

```text
     [Featured Deal]  ← Badge stays as-is
┌─────────────────────────────────┐
│  📷 1/6                         │  ← NEW: Photo count indicator
│                                 │
│         [Property Image]        │  ← CLEAN: No gradient overlay
│                                 │
│                                 │
├─────────────────────────────────┤
│  £325,000                       │  ← NEW: Solid primary bar
├─────────────────────────────────┤
│  📍 Manchester, M1 2AB          │
│  🛏 3 beds   🛁 2 baths   🏠 Semi│
│  ─────────────────────────────  │
│  ◉ Gross Yield      View Deal → │
│    7.2%                         │
└─────────────────────────────────┘
```

### File Changes

#### `src/components/landing/FeaturedPropertyCard.tsx`

**1. Add Camera icon import:**
```typescript
import { MapPin, Bed, Bath, TrendingUp, Building, ArrowRight, Camera } from "lucide-react";
```

**2. Add photo count calculation:**
```typescript
const photoCount = property.photo_urls?.length || 0;
```

**3. Update skeleton loading state:**
Change aspect ratio from `aspect-video` to `aspect-[4/3]` to match.

**4. Replace image section:**
- Change aspect ratio from `aspect-video` to `aspect-[4/3]`
- Remove the gradient price overlay
- Add photo count indicator in top-left (like PropertyCard)

**5. Add solid price bar:**
Insert a new `bg-primary` price bar between image and CardContent (matching PropertyCard pattern).

**6. Simplify content section:**
- Remove the title (h3) since location already identifies the property
- Keep location, property specs, and yield/CTA rows (already consistent)

**7. Update CTA hover effect:**
Change from gap animation to opacity fade for consistency with PropertyCard.

### Summary of Changes

| Change | Reason |
|--------|--------|
| `aspect-video` → `aspect-[4/3]` | Match PropertyCard proportions |
| Remove gradient overlay | Clean image presentation |
| Add solid price bar | Consistent price display pattern |
| Add photo count | Helpful info, matches PropertyCard |
| Remove title h3 | Simplify content, location is enough |
| Opacity CTA animation | Consistent hover behavior |

### Result
The FeaturedPropertyCard will share the same visual language as PropertyCard - clean images with a solid price bar - while retaining its distinctive "Featured Deal" badge that makes it stand out as a highlighted property.


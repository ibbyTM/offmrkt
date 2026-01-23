

## Property Card Design Refresh

### Overview
Apply design elements from the reference to create a more polished, modern property card design while keeping the functionality that makes sense for your investment property platform.

### Key Design Elements to Adopt

From the reference, here are the improvements we'll implement:

| Element | Current | Proposed |
|---------|---------|----------|
| **Image** | 4:3 aspect ratio | Keep 4:3 (good for property photos) |
| **Image carousel dots** | Photo count badge only | Add navigation dots at bottom of image |
| **Checkbox position** | Text-based "Compare" button | Clean checkbox icon in top-left corner |
| **Options menu** | None | Add 3-dot menu for quick actions (top-right) |
| **Price display** | Blue bar below image | Large, bold price directly in content area (cleaner) |
| **Property ID** | Not shown | Add reference ID next to price |
| **Layout structure** | Dense with multiple rows | Cleaner spacing, property type + address prominent |
| **Action button** | "View Deal" on hover | Visible accent CTA button (e.g., "View Details") |

### Visual Comparison

**Current Design:**
```text
┌───────────────────────────────┐
│ [1/5]             [+ Compare] │
│        [Property Image]       │
├───────────────────────────────┤
│ ██ £125,000         Available │  ← Blue bar
├───────────────────────────────┤
│ High-Yield HMO with...        │
│ 📍 Manchester, M1 2AB         │
│ 🛏 3 beds  🚿 2 baths  🏠 HMO │
│ ─────────────────────────────│
│ 📈 Gross Yield   [View Deal →]│
│    8.5%                       │
└───────────────────────────────┘
```

**Proposed Design:**
```text
┌───────────────────────────────┐
│ [☐]          [●●●○○]     [⋮] │
│        [Property Image]       │
│                               │
└───────────────────────────────┘
│ £125,000              #OM1234 │  ← Bold price, ref ID
│ High-Yield HMO Investment     │  ← Property title
│ Manchester, M1 2AB            │  ← Location  
│ 🛏 3  🚿 2  📐 1,200 sqft     │  ← Compact specs
│ ┌──────────────────────────┐ │
│ │   📈 View Details        │ │  ← Accent button
│ └──────────────────────────┘ │
└───────────────────────────────┘
```

### Detailed Changes

#### 1. PropertyCard.tsx - Full Redesign

**Image Section Updates:**
- Add checkbox icon (simple square icon) in top-left instead of text button
- Move photo count to bottom as carousel dots indicator
- Add 3-dot menu icon in top-right (placeholder for future actions)

**Remove the Blue Price Bar:**
- Price moves directly into the card content as a large, bold headline

**Content Section Updates:**
- Price as main headline with property reference ID
- Title and location on separate lines
- Compact specs row with just icons and numbers
- Full-width accent "View Details" button at bottom (always visible)

**Yield Display:**
- Move yield to a subtle badge or integrate into specs row
- Or show in the button hover state

#### 2. Properties Page - Minor Updates

- Adjust grid gap slightly for new card proportions
- Ensure consistent 4-column layout on larger screens

### Technical Implementation

**PropertyCard.tsx changes:**

```tsx
// New structure
<Card className="group overflow-hidden rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
  {/* Image with overlay controls */}
  <div className="relative aspect-[4/3] overflow-hidden">
    <img ... />
    
    {/* Top-left: Checkbox icon */}
    <CompareCheckbox ... variant="icon" />
    
    {/* Bottom center: Carousel dots */}
    {photoCount > 1 && <CarouselDots count={photoCount} />}
    
    {/* Top-right: Options menu */}
    <OptionsMenu ... />
  </div>

  {/* Content - clean layout */}
  <CardContent className="p-4">
    {/* Price row */}
    <div className="flex items-center justify-between mb-2">
      <span className="text-xl font-bold">{formatPrice(price)}</span>
      <span className="text-xs text-muted-foreground">#OM{id.slice(-4)}</span>
    </div>
    
    {/* Title */}
    <h3 className="font-medium line-clamp-1 mb-1">{title}</h3>
    
    {/* Location */}
    <p className="text-sm text-muted-foreground mb-3">{city}, {postcode}</p>
    
    {/* Specs row */}
    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
      <span>🛏 {beds}</span>
      <span>🚿 {baths}</span>
      <span>📈 {yield}%</span>
    </div>
    
    {/* Action button */}
    <Button className="w-full" variant="default">
      View Details
    </Button>
  </CardContent>
</Card>
```

**CompareCheckbox variant:**
- Add an "icon" variant that shows just a checkbox/square icon without text
- Cleaner look for the overlay

### File Changes Summary

| File | Change |
|------|--------|
| `src/components/properties/PropertyCard.tsx` | Major redesign following new layout |
| `src/components/comparison/CompareCheckbox.tsx` | Add icon-only variant |
| `src/components/landing/FeaturedPropertyCard.tsx` | Apply same design language |
| `src/pages/Properties.tsx` | Minor grid adjustments if needed |

### Design Decisions

**What we're keeping from current design:**
- 4:3 aspect ratio (good for property photos)
- Core information hierarchy (price, title, location, specs)
- Yield visibility (investors care about this)

**What we're adopting from reference:**
- Cleaner checkbox icon instead of text button
- Photo carousel dots indicator
- Price in content area instead of colored bar
- Reference ID for professional look
- Always-visible action button
- More breathing room / spacing

**What we're NOT adopting:**
- "Send Mail" as primary CTA (not relevant for this use case)
- Dark theme as default (keeping current light/dark toggle)

### Result

A cleaner, more modern property card design that:
- Feels more professional and polished
- Has better visual hierarchy
- Uses space more efficiently
- Maintains all the important investment data visibility
- Matches modern property portal standards


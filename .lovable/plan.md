

## Fix Property Card Titles

### The Problem

1. **Titles are too long for cards** - AI-generated titles like "11.3% Yield HMO with 5-Year Mears Lease | Bishop Auckland" overflow the card width
2. **Yield is redundant in title** - Yield is already displayed prominently at the bottom of each card, so including it in the title is unnecessary duplication

### Solution

Two-part fix:

| Component | Change |
|-----------|--------|
| **PropertyCard.tsx** | Display only the title (not title + city), since city/postcode already implied |
| **Edge Function** | Update AI prompt to explicitly exclude yield percentages from titles |

### Card Display Changes

**Current layout issue:**
```text
┌─────────────────────────────┐
│ 📍 11.3% Yield HMO with...  │  ← Title truncated, yield redundant
│    Bishop Auckland          │
│ 3 beds · 2 baths · HMO      │
│ ─────────────────────────── │
│ Gross Yield: 11.3%          │  ← Yield shown again here!
└─────────────────────────────┘
```

**Proposed fix:**
```text
┌─────────────────────────────┐
│ 📍 5-Bed HMO with 5-Year    │  ← Cleaner title, no yield
│    Mears Lease              │
│ Bishop Auckland, DL14       │  ← Location on separate line
│ 3 beds · 2 baths · HMO      │
│ ─────────────────────────── │
│ Gross Yield: 11.3%          │  ← Yield displayed once here
└─────────────────────────────┘
```

### File Changes

#### 1. PropertyCard.tsx - Better title display

**Lines 79-84** - Change from single line title+city to two-line layout:

```tsx
// From:
<div className="flex items-center gap-1.5 text-muted-foreground mb-2">
  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
  <span className="text-sm font-medium line-clamp-1">
    {property.title}, {property.property_city}
  </span>
</div>

// To:
<div className="mb-2">
  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
    {property.title}
  </h3>
  <div className="flex items-center gap-1 text-muted-foreground">
    <MapPin className="h-3 w-3 flex-shrink-0 text-primary/70" />
    <span className="text-xs">
      {property.property_city}, {property.property_postcode}
    </span>
  </div>
</div>
```

This change:
- Gives the title its own line with `line-clamp-2` (allows wrapping to 2 lines if needed)
- Moves location to a smaller secondary line
- Better visual hierarchy (title = prominent, location = secondary info)

#### 2. FeaturedPropertyCard.tsx - Apply same pattern

**Lines 91-97** - Update to match the new pattern for consistency.

#### 3. Edge Function - Exclude yield from titles

**supabase/functions/enhance-property-content/index.ts**

**Lines 96-103** - Update the system prompt to explicitly exclude yield:

```typescript
// Update systemPrompt to add explicit rule about yield
const systemPrompt = `You are a UK property investment copywriter specialising in buy-to-let and investment properties. Your task is to create professional, compelling marketing content that appeals to property investors.

Rules:
- Title: Maximum 60 characters. Include the key selling point and location. Make it attention-grabbing.
- Title: DO NOT include yield percentages in the title - yield is displayed separately on the listing card.
- Description: 100-150 words. Focus on investment potential, rental yield, location benefits, and property features. Use professional UK English. Structure it well with clear benefits.
- Highlights: 3-5 concise bullet points about investment potential. Each should be impactful and factual.

Tone: Professional, trustworthy, investment-focused. Avoid hyperbole but be compelling.`;
```

### Summary of Changes

| File | Change |
|------|--------|
| `src/components/properties/PropertyCard.tsx` | Two-line title layout with `line-clamp-2`, separate location line |
| `src/components/landing/FeaturedPropertyCard.tsx` | Same pattern for consistency |
| `supabase/functions/enhance-property-content/index.ts` | Add rule to exclude yield from titles |

### Result

- Titles will have room to breathe with up to 2 lines
- Location shown separately for clarity
- AI will stop putting yield in titles (which was redundant since yield is already displayed on the card)
- Existing properties with yield in titles will still display correctly, but when re-enhanced with AI, the new titles will be cleaner


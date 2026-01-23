

## Make Property Cards Taller

### Overview
Adjust the image aspect ratio on property cards to make them taller and more visually prominent.

### Current vs. Proposed

| Aspect Ratio | Description | Result |
|--------------|-------------|--------|
| `16/10` (current) | Wide, landscape-oriented | Shorter cards |
| `4/3` | Classic photo ratio | Noticeably taller |
| `3/2` | Standard DSLR ratio | Even taller |
| `1/1` | Square | Maximum height |

### Recommended Change
Change from `aspect-[16/10]` to `aspect-[4/3]` for a nice balance - taller images that still feel like property photos without being too square.

### File Change

**`src/components/properties/PropertyCard.tsx`**

```tsx
// Line 37 - Change aspect ratio
// From:
<div className="relative aspect-[16/10] overflow-hidden bg-muted">

// To:
<div className="relative aspect-[4/3] overflow-hidden bg-muted">
```

### Visual Comparison

```text
Current (16:10)          Proposed (4:3)
┌──────────────┐         ┌──────────────┐
│              │         │              │
│    Image     │         │              │
│              │         │    Image     │
├──────────────┤         │              │
│  £325,000    │         │              │
├──────────────┤         ├──────────────┤
│  3 bed Semi  │         │  £325,000    │
│  Manchester  │         ├──────────────┤
│  Yield: 7.2% │         │  3 bed Semi  │
└──────────────┘         │  Manchester  │
                         │  Yield: 7.2% │
                         └──────────────┘
```

### Result
- Taller, more prominent property images
- Cards feel more substantial and premium
- Better showcase of property photos


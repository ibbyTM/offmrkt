

## Make Property Detail Images Larger

### The Problem
The main property image on the detail page uses a fixed height of `h-96` (384px) with `object-cover`, which:
1. **Cuts off the image** - Important parts of the property photo may be cropped
2. **Feels small** on larger screens - Doesn't take full advantage of available space
3. **Inconsistent with modern property sites** - Users expect larger, more immersive images

### Proposed Solution
Change from a fixed height to a responsive aspect ratio that shows more of the image without cropping as much, and increase the overall size.

### Options Considered

| Option | Height | Behavior |
|--------|--------|----------|
| Current `h-96` | 384px fixed | Crops image, same on all screens |
| `h-[500px]` | 500px fixed | Taller but still crops |
| `aspect-[16/9]` | Responsive | Wide cinematic feel |
| `aspect-[3/2]` | Responsive | Standard photo ratio, shows more |

**Recommended: `aspect-[3/2]`** - This is the standard DSLR photo ratio, which will display property photos naturally without excessive cropping, and scales responsively on different screen sizes.

### Visual Comparison

```text
Current (h-96 = 384px fixed)     Proposed (aspect-[3/2])
┌────────────────────────┐       ┌────────────────────────┐
│                        │       │                        │
│    [Cropped Image]     │       │                        │
│                        │       │    [Full Image]        │
└────────────────────────┘       │                        │
                                 │                        │
                                 └────────────────────────┘
```

### File Change

**`src/components/property-detail/PropertyGallery.tsx`**

**Line 50** - Change the image sizing:

```tsx
// From:
className="w-full h-96 object-cover"

// To:
className="w-full aspect-[3/2] object-cover"
```

This also requires updating the no-image placeholder (line 33) to match:

```tsx
// From:
<div className="bg-muted rounded-xl h-96 flex flex-col items-center justify-center text-muted-foreground">

// To:
<div className="bg-muted rounded-xl aspect-[3/2] flex flex-col items-center justify-center text-muted-foreground">
```

### Technical Details
- **Before**: `h-96` = fixed 384px height, heavy cropping
- **After**: `aspect-[3/2]` = responsive height based on width, ~450-550px on typical screens, less cropping
- The `object-cover` is kept to ensure images fill the space nicely even if they don't match the exact ratio

### Result
- Images will be noticeably taller and show more of the property
- Better presentation that matches modern property listing sites
- Responsive sizing that works well on all screen sizes


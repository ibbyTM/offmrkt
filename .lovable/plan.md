

## Completed Projects — Image Carousel

Currently the project photos display as a small 2x2 grid (each image ~h-40). Replace the grid with a full-height carousel/slideshow so each photo gets proper showcase space.

### Change

**`src/components/funnels/FunnelProofSection.tsx`** — replace the photo grid with an image carousel:

- Import `useState` and add prev/next navigation
- Each project card keeps the `md:grid md:grid-cols-2` layout, but the left half becomes a single large image with arrow navigation and dot indicators
- Image fills the full left column height (`h-64 md:h-80`) with `object-cover`
- Semi-transparent prev/next arrow buttons overlaid on the image (similar to `PropertyCardCarousel` pattern)
- Dot indicators at the bottom showing current position
- Touch swipe support for mobile
- Current image index tracked per project card via local state

No external carousel library needed — simple state-driven slideshow matching the existing `PropertyCardCarousel` pattern already in the codebase.

### Files Changed
- `src/components/funnels/FunnelProofSection.tsx` — replace photo grid with carousel per project card


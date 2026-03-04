

## Make Ad Creatives Page Mobile-Friendly

The current page renders ad previews at a fixed `SCALE = 0.35` of the full 1080px width, producing ~378px wide cards. On mobile these overflow or display awkwardly in a `flex-wrap` layout with fixed pixel widths.

### Changes

**`src/components/admin/AdCreativeCard.tsx`**
- Make the scale responsive: use a smaller scale on mobile (~0.28 for squares, ~0.22 for stories) so cards fit within the viewport
- Use `useIsMobile()` hook to detect screen size
- Ensure the card container and download button width adapts to the computed preview size

**`src/pages/AdCreatives.tsx`**
- Change the `flex flex-wrap gap-6` layout to a responsive grid: single column on mobile, multi-column on larger screens
- Reduce padding on mobile (`p-4 sm:p-6`)
- Center cards on mobile for a cleaner look

### Files changed
- `src/components/admin/AdCreativeCard.tsx` — responsive scale + width
- `src/pages/AdCreatives.tsx` — responsive grid layout + padding


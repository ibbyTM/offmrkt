

## Add Pinch-to-Zoom for Floor Plan Images

### Overview
Add touch-based pinch-to-zoom and mouse wheel zoom support for floor plan images inside the fullscreen viewer dialog, with pan/drag to navigate when zoomed in.

### Changes

**File: `src/components/property-detail/FloorPlans.tsx`**

1. Add zoom state (`scale`, `translate`) and gesture tracking refs
2. Implement touch event handlers for pinch-to-zoom:
   - `onTouchStart` -- capture initial two-finger distance
   - `onTouchMove` -- calculate scale delta from finger distance change
   - `onTouchEnd` -- cleanup
3. Add mouse wheel zoom (`onWheel`) for desktop users
4. Add click-and-drag panning when zoomed in (`onMouseDown/Move/Up` or `onPointerDown/Move/Up`)
5. Apply `transform: scale() translate()` to the image element via inline styles
6. Add a "Reset Zoom" button in the dialog header (visible when zoomed)
7. Add `touch-action: none` CSS to the viewer container to prevent browser default pinch behavior
8. Reset zoom state when dialog closes or when a different floor plan is selected

### Technical approach
- Pure React state + pointer/touch events (no external library needed)
- Track pinch gesture by computing distance between two touch points
- Clamp scale between 1x and 5x
- Constrain pan so image edges don't leave viewport
- Only apply zoom controls to images, not PDF iframes


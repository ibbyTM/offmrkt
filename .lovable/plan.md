

## Move Floor Plans Below Description (Rightmove Style)

### Overview
Remove floor plans from the main photo gallery and display them in their own section below the property description, similar to how Rightmove presents them.

### Changes

**1. PropertyGallery.tsx**
- Remove floor plan integration -- only show property photos (no more combining floor plans into `allImages`)
- Remove floor plan badge, `floorPlanUrls` prop, and `Grid3X3` icon usage
- Simplify the component back to a photos-only gallery

**2. PropertyDetail.tsx**
- Stop passing `floorPlanUrls` to `PropertyGallery`
- Add the existing `FloorPlans` component (already exists at `src/components/property-detail/FloorPlans.tsx`) directly below `PropertyDescription`
- Pass `property.floor_plan_urls` to it

**3. No changes needed to FloorPlans.tsx**
- The standalone `FloorPlans` component already exists with a clean card layout, click-to-expand lightbox, and "View Full Size" button -- it just needs to be wired in

### Result
- Photo gallery shows only property photos (first photo as hero)
- Floor plans appear in their own dedicated section below the description with click-to-expand functionality, matching the Rightmove pattern




## Smart Focal-Point Cropping for Property Card Images

Property images currently use `object-cover` with the default `object-position: center`, which often crops out the most important part of the photo (e.g. the front of a house sits in the lower half and gets cut).

### Approach

Use AI (Gemini Flash) to analyse each property's first image and return a focal-point coordinate (x%, y%). Store the result in the database so it only runs once per property. Apply the focal point as `object-position` on the card image.

### Changes

**1. Database migration** -- Add a `cover_focal_point` JSONB column to `properties`
```sql
ALTER TABLE public.properties
  ADD COLUMN cover_focal_point jsonb DEFAULT null;
```
This stores `{ "x": 50, "y": 35 }` (percentage values).

**2. New edge function `detect-focal-point`**
- Accepts a property ID
- Fetches the first `photo_urls` entry
- Sends it to Gemini Flash via the AI gateway with a vision prompt: *"Analyse this property photo. Return the focal point as x% and y% where the most important subject (building front) is centred."*
- Uses tool calling to extract structured `{ x, y }` output
- Updates `properties.cover_focal_point` in the DB
- Returns the focal point

**3. Admin trigger** -- Add a "Detect Focus" button to `AdminPropertyToolbar` (runs per-property) and a bulk action in the Admin panel to process all properties missing focal points.

**4. Frontend rendering** -- Update `PropertyCardCarousel` and `FeaturedPropertyCard` to read `property.cover_focal_point` and apply it:
```tsx
style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
```
Falls back to `center` when no focal point exists.

**5. Pass property data down** -- `PropertyCard` already receives the full property object but `PropertyCardCarousel` only gets `images` and `alt`. Add an optional `focalPoint` prop so it can apply the position to the first image.

### Files changed
- **Migration SQL** -- add `cover_focal_point` column
- **`supabase/functions/detect-focal-point/index.ts`** -- new edge function
- **`src/components/property-detail/AdminPropertyToolbar.tsx`** -- add "Detect Focus" button
- **`src/components/properties/PropertyCardCarousel.tsx`** -- accept + apply focal point
- **`src/components/properties/PropertyCard.tsx`** -- pass focal point to carousel
- **`src/components/landing/FeaturedPropertyCard.tsx`** -- apply focal point to image


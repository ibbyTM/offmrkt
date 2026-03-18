

## Manual Focal Point Editor

Add a dialog where admins can click on the property's cover image to visually set the focal point, overriding the AI-detected value.

### Changes

**1. New component: `src/components/admin/FocalPointEditor.tsx`**
- A dialog containing the property's first image at full width
- Shows a crosshair/marker at the current focal point position (from `property.cover_focal_point` or default `{x:50, y:50}`)
- On click anywhere on the image, calculates the click position as x% and y% relative to the image bounds
- Moves the marker to the clicked position in real-time (preview before saving)
- A small live preview card (4:3 aspect ratio with `object-position` set to the selected point) so admins can see how the card will look
- Save button that updates `properties.cover_focal_point` directly via Supabase, then invalidates the property query cache
- Cancel button to discard

**2. Update `AdminPropertyToolbar.tsx`**
- Add a "Set Focus" button (using `MousePointerClick` or `Crosshair` icon) next to the existing "Detect Focus" button
- Clicking it opens the `FocalPointEditor` dialog
- Pass `property` (for the image URL and current focal point) and an `onSaved` callback to refresh data

**3. No database changes needed** -- the `cover_focal_point` JSONB column already exists and admins already have UPDATE access via RLS.

### UI Flow
1. Admin clicks "Set Focus" on the property detail page toolbar
2. Dialog opens showing the first property image with a crosshair marker
3. Admin clicks on the image to reposition the focal point
4. A small preview card shows the cropping result in real-time
5. Admin clicks "Save" to persist, or "Cancel" to discard


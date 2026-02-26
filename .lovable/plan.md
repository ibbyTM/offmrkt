
I investigated this with your screenshot + runtime data, and the issue is consistent with the floor plan still being rendered as an image element (broken image icon/alt text) instead of a document viewer. Also, your UX requirement is clear: floor plans must open inside the app in fullscreen mode only, with no “download” or “open in new tab” paths.

## What I will change

### 1) Make floor plan rendering resilient (so it actually shows)
**File:** `src/components/property-detail/FloorPlans.tsx`

- Replace simple `.endsWith('.pdf')` detection with a more robust parser:
  - Parse URL pathname safely
  - Normalize with `decodeURIComponent`, lowercase, and `trim`
  - Detect known image extensions (`jpg`, `jpeg`, `png`, `webp`, `gif`, etc.)
  - Detect pdf by extension
  - Treat unknown/broken cases as document viewer fallback instead of image
- Add image load-failure fallback:
  - If an image fails to load (`onError`), immediately re-render that tile as document-style viewer entry (instead of leaving broken image icon)

This prevents the exact broken state shown in your screenshot.

### 2) Remove all new-tab/download UI paths
**File:** `src/components/property-detail/FloorPlans.tsx`

- Remove `<a target="_blank">` usage for PDF tiles
- Remove external-link icon and any “Open in new tab” fallback text
- Make every floor plan tile open the same in-app modal viewer via click

### 3) In-app fullscreen-only viewing
**File:** `src/components/property-detail/FloorPlans.tsx`

- Open floor plans in a large fullscreen-style dialog (viewport-filling modal):
  - `DialogContent` expanded to near full viewport (`~95vw x ~95vh`)
- Render content in modal:
  - Images: centered `img` with `object-contain`, full available height
  - PDFs/docs: `iframe`/embedded viewer filling modal body
- Add explicit **Fullscreen** control in modal (using browser Fullscreen API on the viewer container), so user can expand further without leaving the app
- Keep close behavior in-app only (no redirects, no tab switches)

## Why this will fix your current problem

- Your screenshot shows the runtime fell into image rendering for that floor plan.
- With the new detection + error fallback, any non-renderable image URL or misclassified file will still open in the embedded document viewer instead of breaking.
- The modal path becomes the only path, so no forced downloads and no new tab links from our UI.

## Verification checklist I will run after implementation

1. Property with PDF floor plan displays a clickable tile (not broken image).
2. Clicking opens the floor plan inside the modal, not a new tab.
3. Fullscreen button expands viewer in-app.
4. No download/open-new-tab buttons shown in the floor plan UI.
5. Image-based floor plans still open correctly in the same modal viewer.

## Technical note

Some browsers may still expose native save actions at browser-level controls for embedded PDFs; I will remove all download/new-tab actions from app UI and keep the intended in-app flow only.



## Replace Specialist Care Post Image with Clean Photos

The specialist care project currently shows a single social media screenshot with text overlay. Replace with the 4 clean photos the user uploaded.

### Changes

**1. Add 4 new images to `src/assets/projects/`**
- `specialist-care-exterior-clean.png` (exterior, no text)
- `specialist-care-kitchen.jpg` (kitchen shot)
- `specialist-care-bathroom.jpg` (bathroom)
- `specialist-care-garden.jpg` (garden/outdoor)

**2. Update `src/components/funnels/FunnelProofSection.tsx`**
- Replace the `specialistCareExterior` import with 4 new image imports
- Update the specialist care project's `images` array: `[exterior, kitchen, bathroom, garden]`
- This gives it a 4-photo grid matching the Huddersfield card

Single file changed + 4 new assets.


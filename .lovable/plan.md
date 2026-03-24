

## Fix: Remove Huddersfield Social Media Post Image

The `huddersfield-exterior.png` is the social media screenshot with text overlay. Unlike the specialist care project, the user didn't provide a separate clean exterior for Huddersfield — only 3 clean interior shots (bedroom, kitchen, bathroom).

### Change
**`src/components/funnels/FunnelProofSection.tsx`**
- Remove `huddersfieldExterior` import
- Update the Huddersfield project's `images` array to use only the 3 clean photos: `[huddersfieldBedroom, huddersfieldKitchen, huddersfieldBathroom]`
- The photo grid already handles variable image counts (1 or 2+ columns), so 3 photos will render as a 2x2 grid with 3 cells filled

Single file change — remove 1 import, update 1 array.


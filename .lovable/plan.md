

## Two Fixes — Image Grid + Dead Space

### 1. Restore 3x3 Image Grid
The image grid thumbnails are currently `w-[72px] h-[56px]` — these are fine. The issue is that the toggle card at `bottom: 120px, left: 280px` sits directly over the grid and the grid is being compressed by `justify-between` in the flex row. The grid itself renders all 9 images but may be squeezed.

Change each thumbnail to exactly `w-[60px] h-[60px]` (square, as specified). Add `min-w-[60px] min-h-[60px]` to prevent flex shrinking. Ensure the grid container has `shrink-0` (already present).

**Lines 209-217**: Change image classes from `w-[72px] h-[56px]` to `w-[60px] h-[60px] min-w-[60px] min-h-[60px]`.

### 2. Remove Dead Space
The section currently has `pb-12` (48px) which is correct. But I need to verify there's no `min-h` sneaking in. Line 304 shows `relative pb-12` — that's fine, no min-height.

The `PipelineFlow` has `mt-8` which is 32px — reasonable. But the overall section may have extra space from the text block's padding. The content block has `pt-20 lg:pt-28` which is fine for top.

Looking more carefully — `pb-12` is already 48px (3rem = 48px). The dead space might come from the `PipelineFlow`'s `px-[280px]` compressing content horizontally but not affecting vertical space. Let me check if there's padding elsewhere... The section only has `pb-12`. This should already be tight. 

Actually, `pb-12` in Tailwind is `padding-bottom: 3rem` = 48px. That matches the requirement. The issue might be that the pipeline flow images are being clipped/hidden, making the section look emptier than it should. Fixing the grid (fix 1) should help fill the space.

No changes needed for padding — it's already `pb-12` (48px) with no min-height.

### Files Changed
- `src/components/landing/HeroSection.tsx` — image grid sizing only


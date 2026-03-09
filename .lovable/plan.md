

## Fix Ad Creative Layout Overflow Issues

### Problems Identified

1. **Broken Tailwind class**: Line 227 uses `gap-[${isLandscape ? "20" : "36"}px]` inside a className string -- Tailwind cannot process dynamic interpolations, so the gap is never applied, causing inconsistent spacing.

2. **Landscape content overflow**: Landscape creatives (1200×628) have very limited vertical space but try to fit: logo + accent line + headline + subheadline + optional bullets/stats + CTA + footer. With large font sizes and fixed paddings, content overflows and overlaps.

3. **Story/portrait with many bullet points**: Templates like `tips-story` (5 bullets) can overflow the available space.

4. **Fixed spacing regardless of content density**: Padding, gaps, and element sizes are the same whether a card has 0 or 5 bullet points.

### Changes

**`src/components/admin/AdCreativeCard.tsx`**

1. Fix the broken gap -- move it to an inline `style={{ gap: ... }}` instead of the className template literal.

2. Scale font sizes based on content density, not just aspect ratio:
   - Landscape headlines: 52 → 44 when stats/bullets present
   - Landscape sub: 26 → 22 when content-heavy
   - Reduce logo height for landscape (40 → 32)
   - Reduce CTA padding for landscape

3. Reduce fixed spacing for landscape:
   - CTA bottom padding: 40px → 24px
   - Content padding: 60px → 40px
   - Stats gap: 40px → 24px
   - Badge top offset: scale down for landscape

4. Add `overflow-hidden` and `min-h-0` to the content flex container to prevent blowout.

5. For story/portrait with many bullet points (>3), reduce bullet font size and gap.

**`src/data/adCreatives.ts`**

6. Trim a few overly long headlines/subheadlines in landscape templates to fit better (e.g. shorten multi-line landscape headlines to single line where possible).

### Files changed
- `src/components/admin/AdCreativeCard.tsx` -- layout/spacing fixes
- `src/data/adCreatives.ts` -- minor text trimming for landscape cards


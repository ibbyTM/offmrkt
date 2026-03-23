

## Hero Section Rebuild — Absolute Positioned Layout

### Problem
The current hero uses a stacked flex layout: headline block, then pipeline flow below. Cards use `%`-based absolute positioning relative to the container div, not the full hero. The pipeline flow sits in normal document flow creating spacing issues. The portal labels still say Rightmove/Zoopla/OnTheMarket.

### Changes — `src/components/landing/HeroSection.tsx` (full rewrite)

**1. Hero container structure**
- `<section>` gets `relative min-h-[85vh]` (brings back the height, but this time the visual fills it)
- Remove `overflow-hidden` so floating cards can breathe
- Inner layout: no `container` wrapper constraining card positions — cards position relative to the `<section>` itself

**2. Headline block — top half**
- Centered text block with `pt-20 lg:pt-28` for top spacing
- Same headline, subtitle, CTAs, trust line — no text/colour/style changes
- `relative z-10` so it sits above the visual

**3. Pipeline flow — bottom half, inside the same container**
- Positioned with `mt-8` below the text, centered via flex
- Uses `w-[80%] mx-auto` to span most of the hero width
- Same internal structure: image grid → dashed arrows → source pills → dashed arrows → Add to Pipeline → dashed arrows → pipeline card

**4. Source pills — replace portals**
- Replace `Rightmove`/`Zoopla`/`OnTheMarket` with:
  - `👤 Direct Seller` (text-slate-700)
  - `📱 Social Media` (text-slate-700)  
  - `🤝 Referral` (text-slate-700)
- Same pill styling (white bg, rounded-full, shadow-sm, border)

**5. Floating cards — absolute on the `<section>`**
- All four cards use `absolute` positioning relative to the section (not the container div):
  - New Deal Alert: `top-[80px] left-[60px]`
  - Verified Deal: `top-[80px] right-[60px]`
  - Toggle card: `bottom-[120px] left-[40px]` (overlaps image grid)
  - Market Insight: stays as overlay on pipeline card's top-right corner (`absolute -top-6 -right-6 rotate-[2deg]`)
- All `hidden lg:block` (desktop only)

**6. Mobile**
- Hide pipeline flow and floating cards below `lg`
- Show the existing 2x2 `MobileFloatingCards` grid

**7. Logo bar** — unchanged

### Files Changed
- `src/components/landing/HeroSection.tsx`


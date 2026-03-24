

## Full Mobile Optimisation Audit & Fix

### Issues Found

1. **Viewport meta** missing `maximum-scale=1.0` — iOS auto-zooms on input focus
2. **`src/App.css`** — dead Vite boilerplate with `max-width: 1280px; padding: 2rem` on `#root`. Not currently imported but a risk
3. **Carousel nav arrows 32px** (`h-8 w-8`) — below 44px touch minimum, in both `FunnelProofSection` and `PropertyCardCarousel`
4. **Carousel arrows invisible on mobile** — `opacity-0 group-hover:opacity-100` never triggers on touch devices
5. **Carousel dot indicators 8px** (`h-2 w-2`) — too small for touch
6. **Hero headings `text-4xl`** at smallest breakpoint can overflow on 320px screens
7. **FunnelCTA gradient heading** `text-3xl` at smallest — tight on small screens
8. **FunnelLayout header** uses fixed `w-24` spacers that clip on narrow screens

### Changes

**1. `index.html`** (line 5)
- Change viewport to: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`

**2. Delete `src/App.css`**
- Unused Vite boilerplate

**3. `src/index.css`** — Add touch-target utility
```css
@layer utilities {
  .touch-target { min-height: 44px; min-width: 44px; }
}
```

**4. `src/components/funnels/FunnelProofSection.tsx`**
- Nav arrows: `h-8 w-8` → `h-10 w-10`, visible on mobile: `opacity-70 md:opacity-0 md:group-hover:opacity-100`
- Dot indicators: `h-2 w-2` → `h-2.5 w-2.5` with `p-1` wrapper for 44px tap area
- Carousel height: `h-64` → `h-56` on mobile for better proportion
- `FeaturedLiveDeal` stats grid: `grid-cols-3` → `grid-cols-1 sm:grid-cols-3` to stack on small screens

**5. `src/components/properties/PropertyCardCarousel.tsx`**
- Nav arrows: `h-8 w-8` → `h-10 w-10`
- Arrow visibility: `opacity-0 group-hover:opacity-100` → `opacity-70 md:opacity-0 md:group-hover:opacity-100`
- Dot indicators: `h-2 w-2` → `h-2.5 w-2.5` with padding for tap area

**6. `src/components/funnels/FunnelHero.tsx`**
- Heading: `text-4xl md:text-5xl lg:text-6xl` → `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` (both variants)
- Subheadline centered: `text-xl md:text-2xl` → `text-lg sm:text-xl md:text-2xl`
- Subheadline split: `text-xl` → `text-lg sm:text-xl`

**7. `src/components/funnels/FunnelCTA.tsx`**
- Gradient heading: `text-3xl md:text-4xl` → `text-2xl sm:text-3xl md:text-4xl`
- Default heading: same treatment

**8. `src/components/funnels/FunnelLayout.tsx`**
- Header spacers: `w-24` → `w-20 sm:w-24`

### Files Changed
- `index.html`
- `src/App.css` (delete)
- `src/index.css`
- `src/components/funnels/FunnelProofSection.tsx`
- `src/components/properties/PropertyCardCarousel.tsx`
- `src/components/funnels/FunnelHero.tsx`
- `src/components/funnels/FunnelCTA.tsx`
- `src/components/funnels/FunnelLayout.tsx`


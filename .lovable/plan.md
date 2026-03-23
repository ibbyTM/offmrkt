

## Adopt ZooPro Visual Patterns

Bring across the key component patterns from zoopro.co.uk that would have the most impact here: pill-shaped buttons, card hover accent lines, upgraded navbar with animated indicator, staggered scroll reveals, and a dark footer.

### Changes

**1. Pill-Shaped Buttons**
`src/components/ui/button.tsx`
- Change default `rounded-md` to `rounded-full` in the base CVA class
- Add arrow translate-x animation to the gradient variant (already partially done)
- Secondary variant: add white text variant for use on dark backgrounds

**2. Card Hover Accent Line**
`src/components/ui/card.tsx`
- Add a `before:` pseudo-element that renders a 2px primary gradient bar at the top of the card, initially `scale-x-0`, transitioning to `scale-x-100` on hover
- Keeps the existing border and shadow behavior

**3. Navbar — Animated Pill Indicator**
`src/components/layout/Header.tsx`
- Replace the `bg-primary/10` active state with a framer-motion `layoutId` animated pill background that slides between active nav items
- Add `backdrop-blur-md` (already present as `backdrop-blur-xl`, keep)
- Mobile: use Sheet drawer instead of plain div dropdown for the hamburger menu

**4. Staggered Scroll Reveals**
`src/components/landing/BenefitsSection.tsx`, `HowItWorksSection.tsx`, `AftercareSection.tsx`, `TestimonialsSection.tsx`, `FeaturedPropertiesSection.tsx`
- Standardise all section animations to use `staggerChildren: 0.1` container variants with `y: 30 → 0` child variants (currently each section does its own ad-hoc delays)
- This creates a consistent, polished stagger effect across all landing sections

**5. FAQ Accordion — Hover Effects**
`src/components/landing/FAQSection.tsx`
- Add `hover:shadow-md hover:border-primary/30` to accordion items (partially there with `data-[state=open]:shadow-md`, extend to hover)

**6. Dark Footer**
`src/components/layout/Footer.tsx`
- Switch from `bg-background-secondary` to `bg-slate-900 text-slate-300`
- Headings in white, links in `text-slate-400 hover:text-white`
- Border in `border-slate-800`
- Logo gets the white pill wrapper (same as sidebar)
- Bookends the page with the dark sidebar identity

**7. AftercareSection — Remove Icon Circles**
`src/components/landing/AftercareSection.tsx`
- Replace `bg-primary/10` icon wrapper with inline icon (same cleanup done elsewhere)

**8. Featured Properties — Remove Float Hover**
`src/components/landing/FeaturedPropertiesSection.tsx`
- Remove `hover:-translate-y-1` from cards (already removed from PropertyCard, but this section has its own card markup)
- Cards will get the accent line from the global Card update instead

### Files Changed
- `src/components/ui/button.tsx` — pill shape
- `src/components/ui/card.tsx` — hover accent line
- `src/components/layout/Header.tsx` — animated pill indicator, Sheet mobile menu
- `src/components/layout/Footer.tsx` — dark background
- `src/components/landing/BenefitsSection.tsx` — stagger variants
- `src/components/landing/HowItWorksSection.tsx` — stagger variants
- `src/components/landing/AftercareSection.tsx` — remove icon circles, stagger
- `src/components/landing/TestimonialsSection.tsx` — stagger variants
- `src/components/landing/FeaturedPropertiesSection.tsx` — remove float hover, stagger
- `src/components/landing/FAQSection.tsx` — hover effects


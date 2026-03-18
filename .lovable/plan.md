

## Visual Overhaul — Kill the "Vibe Coded" Look

### The Problem
The UI has classic AI-generated tells that make it feel lifeless and generic:
- **Every section is identical**: centered heading → subtitle → grid of icon-in-circle cards. Repeat x11.
- **`bg-primary/10` rounded icon containers** appear in literally every component — hero, benefits, how-it-works, services, contact, dashboard, trust section. It's the single biggest AI tell.
- **Too many landing sections** doing the same job (DualPath, Trust, Benefits, WhyChooseUs all pitch the platform)
- **No visual contrast** — everything is soft `/10` and `/30` opacities, muted tones, identical card shapes
- **Fake social proof** — testimonials with `@handles` and initials avatars, browser-dot mockups in HowItWorks
- **Generic copy** — "Explore our top features", "Customers love our platform", "How it works in 4 simple steps"

### Strategy
1. **Consolidate landing sections** — cut from 11 to 7, merge redundant pitch sections
2. **Break layout monotony** — alternate between full-width, split-layout, and card grids
3. **Sharpen visual contrast** — use solid backgrounds, stronger type, fewer soft tints
4. **Kill the icon-circle pattern** — use numbered markers, inline icons, or text-only where icons add nothing
5. **Fix fake social proof** — remove `@handles`, use quoted pull-quotes instead of card grids
6. **Tighten copy** — shorter, more specific headlines

### Changes

**1. Remove redundant sections from landing page**
`src/pages/Index.tsx`
- Remove `TrustSection` (duplicates Benefits)
- Remove `WhyChooseUsSection` (duplicates Benefits + has placeholder gradient rectangles)
- Remove `PartnerLogos` (likely placeholder logos)
- Down to 7 sections: Hero → DualPath → Benefits → FeaturedProperties → HowItWorks → Testimonials → Services → FAQ → Contact

**2. Redesign HeroSection — remove laptop mockup**
`src/components/landing/HeroSection.tsx`
- Remove the entire `LaptopMockup` component (biggest AI tell — fake browser chrome with colored dots)
- Replace with a clean layout: headline left, a real value prop or large stat block right on desktop
- Remove the generic "Trusted by 1,200+ investors" avatar circles (Users icons in circles = AI pattern)
- Replace trust indicator with a simple text line: "1,200+ investors · £50M+ invested · 8.5% avg yield"
- Stronger headline typography: tighter line-height, heavier weight

**3. Redesign BenefitsSection — break the grid-of-cards pattern**
`src/components/landing/BenefitsSection.tsx`
- Switch from 2x2 card grid to alternating left-right layout (text on one side, stat/visual on the other)
- Remove the icon-in-colored-circle pattern — use large bold numbers or inline icons instead
- Remove "Learn more →" links on every card (they all go to `/properties`)
- Sharper headline: not "Explore our top features"

**4. Redesign HowItWorksSection — remove fake browser mockups**
`src/components/landing/HowItWorksSection.tsx`
- Remove `StepMockup` component entirely (fake browser chrome with colored dots = #1 AI tell)
- Use a horizontal numbered timeline on desktop, vertical on mobile
- Large step numbers (01, 02, 03, 04) as the visual anchor instead of icon circles
- Simpler, cleaner cards without the watermark numbers overlapping

**5. Redesign TestimonialsSection — remove fake handles**
`src/components/landing/TestimonialsSection.tsx`
- Remove `@handle` social media handles (screams fake)
- Remove the "Trusted by 1,200+" pill at the bottom (duplicate of hero)
- Use a simpler 3-column quote layout with just name + quote + star rating
- Larger quote text, less card chrome

**6. Redesign DualPathSection — bolder visual distinction**
`src/components/landing/DualPathSection.tsx`
- Make the sell card use a solid primary background with white text (not `bg-primary/5`)
- Make the buy card use a dark/navy background instead of plain white
- Remove the "Quick Cash" badge (feels gimmicky)
- Equal column widths instead of `1.2fr 1fr`

**7. Tighten global card styling**
`src/components/ui/card.tsx` — no changes needed
`src/index.css` — reduce `--radius` from `0.875rem` to `0.75rem` for slightly sharper corners
- Across components: replace `bg-primary/10` icon containers with simpler alternatives

**8. Sharpen PropertyCard**
`src/components/properties/PropertyCard.tsx`
- Remove the `hover:-translate-y-1` float effect (AI pattern)
- Use a subtle border-color change on hover instead
- Tighten padding

### Files Changed
- `src/pages/Index.tsx` — remove 3 redundant sections
- `src/components/landing/HeroSection.tsx` — remove laptop mockup, redesign layout
- `src/components/landing/BenefitsSection.tsx` — alternating layout, remove icon circles
- `src/components/landing/HowItWorksSection.tsx` — remove browser mockups, timeline layout
- `src/components/landing/TestimonialsSection.tsx` — remove handles, cleaner quotes
- `src/components/landing/DualPathSection.tsx` — bolder card backgrounds
- `src/components/properties/PropertyCard.tsx` — remove float hover, tighten
- `src/index.css` — adjust border radius


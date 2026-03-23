

## Hero — Classy-Style Dark Background with Floating UI Cards

Recreate the Classy/GoFundMe Pro hero pattern: bold dark background, large centered headline, single-row CTAs, and a spread of floating UI mockup cards below showing product previews.

### Layout

```text
┌──────────────────────────────────────────────┐
│            DARK BACKGROUND (slate-900)       │
│                                              │
│         [AI Property Analysis pill]          │
│                                              │
│       Off-market deals,                      │
│       before anyone else.                    │
│                                              │
│       subtitle in white/70                   │
│                                              │
│    [I Want to Sell →]  [I Want to Buy]        │
│                                              │
│   ┌─────┐    ┌──────────┐    ┌─────┐         │
│  ┌┤Card │   ┌┤ Featured │   ┌┤Card │         │
│  │└─────┘   │└──────────┘   │└─────┘         │
│  │ Stats    │  Property     │ Yield          │
│  └──────    └──────────     └──────          │
│     (floating, slightly tilted,              │
│      fading off edges)                       │
└──────────────────────────────────────────────┘
│   Trust logos (on white below)               │
```

### Visual Details

- **Background**: `bg-slate-900` — full-width dark section (like Classy's dark green)
- **Headline**: White text, `text-5xl lg:text-7xl`, accent word in `text-primary`
- **Subtitle**: `text-white/70`
- **CTAs**: Primary gradient + outline with `border-white/30 text-white`
- **Floating cards** (the hero visual): 3-5 glass-morphism UI mockup cards arranged in a gentle arc below the CTAs. Each card represents a product feature:
  - A mini property card (image + title + yield badge)
  - A stats snippet card ("8.5% avg yield")
  - A "deal alert" notification card
  - Cards use `bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl` glass style
  - Slightly rotated (`rotate-[-3deg]`, `rotate-[2deg]`) with staggered vertical positions
  - Edges fade out with a gradient mask so cards bleed off-screen like Classy
  - Gentle float animation (CSS keyframes, no Three.js)
- **Trust logos**: Move to a slim white strip below the dark hero (clean transition)
- **Stats bar**: Integrated into the floating cards rather than a separate row

### Technical Approach

**Remove**: `CrystalHouse.tsx` import/usage, Three.js dependency (can keep packages for now, tree-shaken away)

**`src/components/landing/HeroSection.tsx`** — Full rewrite:
- Dark `bg-slate-900` section
- Centered text block with white typography
- New `FloatingCards` sub-component: 5 absolutely positioned card divs with glass-morphism styling, slight rotations, and CSS `@keyframes float` animation (already defined in tailwind config)
- Gradient mask on the card container (`mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent)`) to fade edges
- Trust logos in a separate light strip below

### Files Changed
- `src/components/landing/HeroSection.tsx` — dark bg, floating glass cards
- `src/components/landing/CrystalHouse.tsx` — delete (no longer used)




## Hero Redesign — Light SaaS Dashboard Layout with Pipeline Flow

Complete rewrite of HeroSection to match the specified layout: light grey background, centered headline with indigo accent, floating white cards, and a central "pipeline flow" visual with property thumbnails, portal logos, and a pipeline panel.

### Structure

```text
┌──────────────────────────────────────────────────┐
│  bg-[#F0F4F8] light grey                         │
│                                                  │
│  [Top-left card: New Deal Alert]                 │
│                    HEADLINE (center)             │
│                    Off-market deals,             │
│                    before anyone else. (indigo)  │
│                    subtitle                      │
│                    [Invest →] [Sell]              │
│                    trust line                    │
│              [Top-right card: Verified Deal]     │
│                                                  │
│  [Bottom-left      CENTRE VISUAL              Bottom-right│
│   card: toggles]   (flow diagram)             card: Market]│
│                                                  │
│  Centre visual:                                  │
│  [3x3 blurred imgs] → [Rightmove/Zoopla/OTM]   │
│       → [⚡ Add to Pipeline] → [Pipeline panel] │
│                                                  │
└──────────────────────────────────────────────────┘
│  Logo bar: Silks · GoHighLevel · Rightmove ...   │
```

### Changes — `src/components/landing/HeroSection.tsx` (full rewrite)

**Background**: `bg-[#F0F4F8]` replacing `bg-slate-900`. Remove radial glow overlay.

**Headline**: Black text with `text-[#4F46E5]` (indigo) for "before anyone else." — same size as current.

**CTAs**: 
- Solid indigo: `bg-[#4F46E5] text-white` → "I Want to Invest →"  
- Ghost white: `bg-white border border-slate-200 text-slate-700` → "I Want to Sell"

**Trust line**: "GDPR Compliant · No credit card required · No estate agent fees" in small muted text.

**4 Floating cards** — white, `rounded-2xl`, `shadow-[0_4px_24px_rgba(0,0,0,0.08)]`, `p-4`, positioned absolutely around the centre:
1. Top-left: 🏠 New Deal Alert — 3-bed terraced · Manchester, £85,000 · 8.2% yield
2. Top-right: 🔒 Verified Deal — Due diligence complete, Ready to exchange
3. Bottom-left: Two toggle rows — "90% Off-market only" (green/on), "8x More deals than Rightmove" (grey/off) — uses the Switch component
4. Bottom-right: 📈 Market Insight — North West prices, +4.2% this quarter

Cards overlap the centre visual slightly, not grid-aligned. Gentle float animation.

**Centre visual** (new `PipelineFlow` sub-component):
- Left: 3x3 grid of placeholder property thumbnails (blurred/greyscale, use Unsplash placeholders with `grayscale filter blur-[1px]`)
- Centre: Three portal text badges stacked vertically — "Rightmove" (red), "Zoopla" (purple), "OnTheMarket" (green) — connected by dashed lines (`border-dashed border-[#CBD5E1]`)
- Arrow flows right to an indigo pill button "⚡ Add to Pipeline"
- Arrow flows right to a white card panel "Deals in Your Pipeline" showing 3 rows with tiny thumbnails, property names, and coloured status dots (green/orange)
- Dashed connector lines with small indigo arrowheads at ends

**Logo bar**: "Trusted by investors across the UK" with: Silks Property Academy, GoHighLevel, Rightmove, Zoopla, OnTheMarket, NRLA — muted grey text.

**Mobile**: Hide the centre pipeline visual entirely on `md:` breakpoint down. Show only headline, CTAs, trust line, and stack the 4 floating cards in a 2x2 grid (static, no absolute positioning).

### Technical Details
- Switch component already exists at `src/components/ui/switch.tsx` — import for the toggle card
- Dashed lines rendered as SVG paths or `border-dashed` divs with absolute positioning
- Pipeline flow only visible on `lg:` screens — complex layout needs space
- No new dependencies needed

### Files Changed
- `src/components/landing/HeroSection.tsx` — complete rewrite


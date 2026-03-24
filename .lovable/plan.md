

## Add Proof Sections to Investor Funnel

Two new sections added to Step 1 of `InvestFunnelV1`, between the strategy selector and benefits block, plus a stats strip after the hero.

### 1. Deal Stats Strip
Dark `bg-slate-900` row after the hero, before the strategy selector. Three hardcoded stats:
- **11 units** — "Delivered this month"
- **2 projects** — "Completed in 7 days"
- **Guaranteed rent** — "Council-backed leases"

### 2. Completed Projects Section
New `FunnelProofSection` component showing both real projects as cards:

**Project 1 — Huddersfield (7 units)**
- Victorian building, full refurb, 1 & 2 bed apartments
- Highlights: Guaranteed rent, Minimal voids, Long-term contracts, Social impact
- 3 uploaded photos in a grid (from previous message uploads)

**Project 2 — Specialist Care Handover (4 units)**
- Purpose-built adapted flats for specialist care company
- Highlights: High-spec kitchens & bathrooms, Safety-adapted hardware, Secure outdoor spaces, Guaranteed rent
- Photos from this upload (exterior, kitchen, garden, flooring)

Each card: photo grid on one side, project summary + checklist highlights on the other. No fake testimonials — just facts about completed deals.

### 3. Featured Live Deal (from DB)
Query first available property from `properties` table. Show photo, location, price, yield, bedrooms. "LIVE DEAL" badge. Hidden if no properties exist.

### Layout on Step 1
```text
Hero
Deal Stats Strip (dark bg)
Strategy Selector
Completed Projects (2 cards)
Featured Live Deal (from DB)
Benefits
CTA
```

### Files Changed
- `src/assets/projects/` — copy 7 uploaded images (both projects)
- `src/components/funnels/FunnelProofSection.tsx` — new component: stats strip + completed projects + live deal
- `src/pages/funnels/invest/InvestFunnelV1.tsx` — import and place new sections


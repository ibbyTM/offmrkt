

## Create Dedicated Investor Funnel (InvestFunnelV1)

### Problem
All investor funnel slugs (`off-market-deals`, `high-yield`, `invest`) currently map to `SellFunnelV1`, which asks "What type of property are you selling?" with seller-oriented copy ("Get a Cash Offer in 24 Hours", "No fees. No chains.", etc.). Investors need a completely different flow.

### Solution
Create a new `InvestFunnelV1` component tailored to property investors, then wire it into the funnel registry.

### New File: `src/pages/funnels/invest/InvestFunnelV1.tsx`

**Step 1 — Investment Preferences (replaces property type selection)**
- Heading: "What type of investment are you looking for?"
- Options: Buy-to-Let, HMO, Flip / Refurb, BRRR, Commercial, Portfolio
- Each with relevant icon

**Step 2 — Investment Criteria (replaces seller property details)**
- Budget range (dropdown: Under 50k, 50-100k, 100-200k, 200k+)
- Target yield (dropdown: 6%+, 8%+, 10%+, Any)
- Preferred location (text input)
- Purchase timeline (ASAP, 1 month, 3 months, Flexible)

**Step 3 — Contact Details**
- Reuses `FunnelLeadForm` but with `interest_type` set to the funnel slug
- Submit label: "Get Early Access to Deals"

**Step 4 — Confirmation**
- Investor-oriented copy: "You're on the List!", next steps about deal alerts

**Supporting content between steps:**
- `defaultInvestorBenefits` array exported from `FunnelBenefits.tsx`: "Off-Market Access", "Pre-Analysed Deals", "Below Market Value", "Full Due Diligence Packs"
- Hero: "Access Off-Market Deals Before Anyone Else" / "High-yield investment properties sourced, analysed, and ready to go."
- CTA: "Join Our Investor List"
- Testimonials: reuse existing `defaultTestimonials`

### Updated File: `src/pages/funnels/FunnelRouter.tsx`
- Import `InvestFunnelV1`
- Map investor slugs to it:
  - `'off-market-deals'` → `{ v1: InvestFunnelV1, v2: InvestFunnelV1 }`
  - `'high-yield'` → `{ v1: InvestFunnelV1, v2: InvestFunnelV1 }`
  - `'invest'` → `{ v1: InvestFunnelV1 }`

### Updated File: `src/components/funnels/FunnelBenefits.tsx`
- Add and export `defaultInvestorBenefits` array alongside existing `defaultSellerBenefits`

### Files Changed
- `src/pages/funnels/invest/InvestFunnelV1.tsx` (new)
- `src/pages/funnels/FunnelRouter.tsx` (update registry)
- `src/components/funnels/FunnelBenefits.tsx` (add investor benefits)


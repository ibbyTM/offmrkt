

## Add Investor Ad Creatives

Currently there are 25 seller-focused creatives (9 square, 8 story, 4 portrait, 4 landscape). I'll create a matching set of 25 investor-focused creatives and update the page to show both sets separated by audience tabs.

### New Investor Creatives (25 total)

**9 Square (1080×1080):**
1. "Off-Market Deals. Before Anyone Else." — exclusive access pitch, navy, stats (1,200+ investors, £48M+ deals)
2. "7%+ Yields. Guaranteed Tenants." — yield-focused, teal, bullet points
3. "Free Investment Analysis on Every Deal" — value prop, white
4. "Why 1,200+ Investors Choose Us" — social proof, gradient, stats
5. "HMO Deals Starting at £125K" — strategy-specific, navy, stats
6. "No Sourcing Fees. No Middlemen." — cost savings, dark
7. "BMV Deals You Won't Find on Rightmove" — exclusivity, teal, bullets
8. "Build a Portfolio. Not a Headache." — lifestyle, white, bullets
9. "UK Property Market Update" — market data, dark/grid, stats

**8 Story (1080×1920):**
1. "New Deal Just Listed" — urgency, navy
2. "Start Investing With £80K" — accessibility, teal, bullets
3. "Your Portfolio. Our Deals. Real Returns." — gradient, stats
4. "First-Time Investor?" — education, white, bullets
5. "3 Deals Left This Month" — scarcity, navy
6. "Apply in 60 Seconds" — friction-free, gradient, stats
7. "5 Signs of a Great BTL Deal" — tips, dark/waves, bullets
8. "Ready to Invest?" — CTA, split/waves, stats

**4 Portrait (1080×1350):**
1. "This Week's Top Deals" — deal roundup, dark/grid, stats
2. "Cash vs Mortgage: Which Strategy Wins?" — education, navy, stats
3. "\"Best platform I've used\" — James K." — testimonial, white
4. "Top 3 High-Yield Areas in 2026" — data, teal, bullets

**4 Landscape (1200×628):**
1. "How to Build a 5-Property Portfolio" — guide, navy
2. "Just Listed: 4-Bed HMO, Leeds" — listing, gradient, stats
3. "Why Off-Market Beats Rightmove" — thought leadership, dark, stats
4. "Join 1,200+ Verified Investors" — milestone, split, stats

### Page Update

Update `AdCreatives.tsx` to add a **Tabs** component at the top: "Seller Creatives" and "Investor Creatives". Each tab shows the same 4 aspect-ratio sections but with its own dataset. The data file will export two arrays: `sellerCreatives` (existing) and `investorCreatives` (new).

### Files Modified
- `src/data/adCreatives.ts` — rename export to `sellerCreatives`, add `investorCreatives` array with 25 entries
- `src/pages/AdCreatives.tsx` — add Tabs UI to switch between seller and investor sets


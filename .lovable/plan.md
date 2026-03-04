

## Build Facebook/Instagram Ad Creatives Page

Create a dedicated admin page with ready-to-use ad creative templates targeting **sellers** (property owners looking for cash offers). The creatives will use the OffMrkt brand identity and be designed as React components that can be screenshotted or exported.

### What gets built

**1. New page: `/admin/ad-creatives`**
- Displays 4-6 pre-designed ad creative templates in Facebook/Instagram dimensions (1080x1080 square, 1080x1920 story)
- Each template targets sellers with different angles:
  - "Sell Your Property in 24 Hours" -- urgency/speed
  - "Cash Offers, No Fees, No Chains" -- pain-point relief
  - "Get a Free Valuation Today" -- low-commitment CTA
  - "Trusted by 1,200+ Investors" -- social proof
- Uses brand colors (teal #14B8A6, navy #1E3A5A), Inter font, and the new OffMrkt logo on white background
- Each creative has a "Download" button that exports the element as a PNG using `html-to-image` library

**2. New components**
- `src/components/admin/AdCreativeCard.tsx` -- renders a single ad creative at the correct aspect ratio
- `src/pages/AdCreatives.tsx` -- page listing all creatives with download buttons

**3. Dependencies**
- Add `html-to-image` package for PNG export

**4. Route**
- Add `/ad-creatives` route accessible from the admin area

### Files changed
- `src/pages/AdCreatives.tsx` (new)
- `src/components/admin/AdCreativeCard.tsx` (new)
- `src/App.tsx` (add route)
- `package.json` (add html-to-image)


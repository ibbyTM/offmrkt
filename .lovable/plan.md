

## Expand Ad Creatives with Social Media Post Templates

Currently the page has two categories: **Feed Ads (square)** and **Story Ads**. We'll add new aspect ratios and template styles for common social media post formats.

### New Aspect Ratios

Add to the `aspect` type: `"landscape"` (1200×628 for Facebook/LinkedIn link posts) and `"portrait"` (1080×1350 for Instagram portrait posts).

### New Templates (~8-10 additions)

**Instagram Portrait Posts (1080×1350)** — 3-4 templates with content-style layouts: market stats, property tips, "did you know" educational posts, testimonials/quote cards.

**Facebook/LinkedIn Landscape Posts (1200×628)** — 3-4 templates: blog-style link preview cards, announcement posts, stat-driven thought leadership.

**Additional Story templates** — 2 more story-format posts: carousel-style tip sequences, "swipe up" engagement posts.

### New Variant Styles

Add 2 new `variant` options:
- `"dark"` — near-black (#0F172A) background for bold modern look
- `"split"` — half navy / half white split layout

Add 2 new `decorStyle` options:
- `"waves"` — curved wave shapes
- `"grid"` — subtle grid overlay

### File Changes

**`src/components/admin/AdCreativeCard.tsx`**
- Extend `aspect` type to include `"landscape"` | `"portrait"`
- Extend `variant` to include `"dark"` | `"split"`
- Add dimension mappings: portrait → 1080×1350, landscape → 1200×628
- Add new decoration components (`DecoWaves`, `DecoGrid`)
- Add variant styling for `dark` and `split`

**`src/components/admin/AdEditDialog.tsx`**
- No changes needed (already generic)

**`src/pages/AdCreatives.tsx`**
- Add ~8-10 new creative configs for the new formats
- Add two new sections: "Portrait Posts (1080×1350)" and "Landscape Posts (1200×628)"
- Filter items by all four aspect types

### New Post Content Themes
- Market statistics / data-driven posts
- Educational "Did You Know?" property tips
- Testimonial quote cards
- "Just Listed" / "Just Sold" announcement templates
- Blog/article link preview cards
- Investor tip carousels


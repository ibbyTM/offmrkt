

## In-App Visual Overhaul — Make It Feel Like Real Software

### What's Wrong
The authenticated app (dashboard, properties, sidebar) still has the same "soft AI" problems the landing page had:
- **`bg-primary/10` icon circles everywhere** — page headers, stat cards, activity feed, market pulse, settings, empty states. It's the single biggest AI tell remaining.
- **No visual weight** — everything is `border-0 shadow-sm`, soft gradients, muted tones. Cards float in an off-white void with no hierarchy.
- **Sidebar is bland** — plain white, thin border, no visual identity. The logo sits in a white box on a white background.
- **Dashboard stat cards are generic** — identical soft cards with icon-in-circle, no visual differentiation.
- **Empty states are template-y** — big icon-in-circle, centered text, gradient button. Every empty state is the same.
- **Properties toolbar is cluttered** — Export button (non-functional), Add Property button, view toggles, sort — too many controls of equal weight.
- **PropertyDetail uses old `Layout`** not `AppLayout` — inconsistent chrome between pages.

### Changes

**1. Sidebar — Add Visual Identity**
`src/components/layout/AppSidebar.tsx`
- Dark sidebar background: use `bg-slate-900 text-slate-300` instead of default white
- Logo on dark bg (remove the white box wrapper)
- Active nav item: solid primary background pill instead of subtle accent
- Footer items: slightly muted, hover brightens
- Pass `className` to `<Sidebar>` for dark styling

**2. AppLayout Header — Kill the Icon Circle**
`src/components/layout/AppLayout.tsx`
- Remove the `bg-primary/10` icon container from the page header
- Render the icon inline next to the title at the same size, no wrapper
- Make the header border slightly stronger

**3. Dashboard Stat Cards — Differentiated**
`src/components/dashboard/StatCard.tsx`
- Remove the icon-in-circle container
- Show icon inline next to the title text
- Use a left-border accent (`border-l-4 border-primary`) on the primary card instead of gradient bg
- Tighten card to feel data-dense, not decorative

**4. Dashboard Page — Tighter Sections**
`src/pages/Dashboard.tsx`
- Remove icon-in-circle from "Saved Properties" and "Recent Activity" section headers — use inline icon
- Remove icon-in-circle from settings profile card
- Remove icon-in-circle from activity feed items — use simple dot or small icon
- Empty states: remove the large rounded icon container, use a smaller inline icon

**5. Market Pulse — Sharper**
`src/components/dashboard/MarketPulse.tsx`
- Remove the gradient icon container from the section header
- Cards: add a subtle border, remove `border-0`
- Remove the `group-hover:scale-105` zoom effect on images (AI pattern)

**6. Properties Toolbar — Declutter**
`src/components/properties/PropertiesToolbar.tsx`
- Remove the non-functional "Export" button
- Move "Add Property" into the page header actions via `AppLayout` instead of duplicating it in the toolbar
- Simpler, cleaner bar with just: results count | filters (mobile) | sort | view toggle

**7. PropertyDetail — Use AppLayout**
`src/pages/PropertyDetail.tsx`
- Switch from `Layout` to `AppLayout` for consistent sidebar navigation
- Property title as pageTitle, location as pageSubtitle

**8. Global CSS — Stronger Borders**
`src/index.css`
- Increase border opacity slightly: `--border` from `220 15% 92%` to `220 15% 88%` for more visible card edges
- Sidebar dark mode variables for the dark sidebar panel

### Files Changed
- `src/components/layout/AppSidebar.tsx` — dark sidebar
- `src/components/layout/AppLayout.tsx` — remove icon circle from header
- `src/components/dashboard/StatCard.tsx` — inline icon, left-border accent
- `src/pages/Dashboard.tsx` — remove icon circles from all sections
- `src/components/dashboard/MarketPulse.tsx` — remove gradient container, zoom
- `src/components/properties/PropertiesToolbar.tsx` — remove Export, simplify
- `src/pages/PropertyDetail.tsx` — switch to AppLayout
- `src/index.css` — stronger borders


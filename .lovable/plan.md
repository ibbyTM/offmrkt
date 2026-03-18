

## Visual Polish: Auth Pages, Loading States, Contact Icons

### 1. Auth Pages — Split-Screen Layout
**Files:** `src/pages/Auth.tsx`, `src/components/auth/AuthForm.tsx`

Replace the plain centered form with a split-screen layout:
- **Left panel** (hidden on mobile): Dark navy (`bg-slate-900`) branded panel with logo, tagline ("Off-market deals, before anyone else."), and 2-3 stat highlights (500+ properties, 8.5% avg yield, £50M+ invested). Provides visual weight and brand reinforcement.
- **Right panel**: The existing auth form, centered on a white background with more breathing room.
- Mobile: Full-width form only, no left panel.

Changes in `Auth.tsx`: replace the single centered `<div>` with a two-column grid. Remove `<Layout>` wrapper — auth pages should be full-bleed without header/footer.

`AuthForm.tsx`: No logic changes. Minor spacing tweaks — add the logo above the form heading on mobile (since the left panel is hidden).

### 2. Loading & Skeleton States — Branded Shimmer
**File:** `src/index.css`

Add a shimmer animation keyframe (already defined in tailwind config as `shimmer`) and a `.skeleton-shimmer` utility class that uses the brand's border color as the shimmer highlight instead of generic gray. This gives skeleton loaders a subtle branded feel.

**File:** `src/components/properties/PropertyCard.tsx` (or wherever skeletons appear)
No structural changes needed — the existing `<Skeleton>` components will pick up the improved shimmer via CSS.

### 3. Contact Section — Remove Icon Circles
**File:** `src/components/landing/ContactSection.tsx`

Replace the `bg-primary/10` icon-in-circle containers (line 121) with inline icons:
- Remove the `w-12 h-12 rounded-xl bg-primary/10` wrapper div
- Render `<info.icon>` directly with `text-primary` at a smaller size
- Tighten the card layout to a simpler row

### Files Changed
- `src/pages/Auth.tsx` — split-screen layout, remove Layout wrapper
- `src/components/auth/AuthForm.tsx` — add mobile logo, minor spacing
- `src/components/landing/ContactSection.tsx` — inline icons
- `src/index.css` — shimmer utility class


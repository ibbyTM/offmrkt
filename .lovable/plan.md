

## Performance Optimization Plan

### Problem
Chrome is flagging the tab as resource-heavy. Two main culprits identified:

### Root Causes

**1. Admin page loads all data eagerly**
The Admin page runs 4 database queries simultaneously on mount (`useAdminApplications`, `useSellerSubmissions`, `useMortgageReferrals`, `useLandingLeads`) regardless of which section the user is viewing. The CRM tab then fires additional queries when opened.

**2. Landing page animation overhead**
The Index page mounts 12 sections simultaneously, containing 170+ framer-motion `whileInView` animated elements plus continuous infinite animations in the HeroSection (6 orbiting dots, 3 floating dots, 2 pulsing rings, floating badges — all with `repeat: Infinity`).

### Changes

**File: `src/pages/Admin.tsx`**
- Move the 4 data-fetching hooks into their respective section components, or make them conditionally enabled based on `currentSection`:
  - `useAdminApplications` → only when section is `home` or `applications`
  - `useSellerSubmissions` → only when section is `home` or `submissions`
  - `useMortgageReferrals` → only when section is `home` or `mortgage-leads`
  - `useLandingLeads` → only when section is `home` or `leads`
- Use react-query's `enabled` option to conditionally fetch

**File: `src/components/landing/HeroSection.tsx`**
- Reduce infinite animations: remove orbiting dots and floating accent dots (9 continuously animating elements)
- Keep the laptop mockup's scroll-driven parallax (low cost) and one floating badge animation
- Simplify the loading spinner in `src/pages/Index.tsx` (6 orbiting + 3 floating dots with infinite animations)

**File: `src/pages/Index.tsx`**
- Lazy-load below-the-fold landing sections using `React.lazy` + `Suspense` so they don't all mount and register IntersectionObservers immediately

### Expected Impact
- Admin page: ~75% fewer initial database queries when landing on home view
- Landing page: ~12 fewer continuously running animation frames, deferred mounting of 10+ sections


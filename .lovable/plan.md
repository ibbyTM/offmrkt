

## Sidebar Reorganisation — Grouped Navigation

### What's Changing
Restructure the sidebar nav items to match the reference screenshot with three persistent groups instead of conditionally showing dashboard sub-items:

**PLATFORM** (always visible)
- Dashboard → `/dashboard`
- Marketplace → `/properties` (renamed from "Properties")
- Submit Deal → `/submit-property` (renamed from "Submit Property")

**MY PORTFOLIO** (always visible, not just on dashboard)
- Watchlist → `/dashboard?tab=saved` (renamed from "Saved Properties")
- My Submissions → `/dashboard?tab=listings` (renamed from "My Listings")
- Reservations → `/dashboard?tab=reservations`

**ADMIN** (unchanged, only for admins)
- Admin Panel → `/admin`
- Ad Creatives → `/admin/ad-creatives`

### Key Differences from Current
1. Dashboard sub-items are no longer hidden behind `isDashboard` — they're always accessible as "My Portfolio"
2. Rename labels to match the reference: "Marketplace", "Submit Deal", "Watchlist", "My Submissions"
3. Remove the conditional `isDashboard` check entirely — simpler code
4. Compare item stays conditional (only when properties selected), placed under Platform group
5. Footer (Account, Help, Log Out) stays unchanged

### File Changed
- `src/components/layout/AppSidebar.tsx` — restructure nav groups, rename labels, remove `isDashboard` conditional


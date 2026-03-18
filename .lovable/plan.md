

## Mobile Experience Polish

### Problem
The platform has basic mobile support (bottom nav, responsive breakpoints at 768px) but several areas have poor mobile UX: the comparison table is a wide horizontal scroll with no card alternative, the seller form stepper is cramped, property filter panels aren't optimised for touch, and the hero section's floating badges overflow on small screens.

### Changes

**1. Comparison Table — Card View on Mobile**
`src/components/comparison/ComparisonTable.tsx`
- On mobile (`< md`), render properties as stacked cards instead of a horizontal table
- Each card shows the property image, key metrics (price, yield, rent, beds/baths), and remove/view buttons
- Keep the horizontal table on desktop unchanged
- Swipeable horizontally if 2+ cards (native overflow-x-auto with snap)

**2. Hero Section — Mobile Overflow Fixes**
`src/components/landing/HeroSection.tsx`
- Hide the floating ROI badge and notification badge on screens below `md` — they clip off-screen on small viewports
- Reduce hero heading from `text-4xl` to `text-3xl` on mobile for better readability
- Shrink bottom stats grid gap and font sizes on mobile

**3. Property Filters — Bottom Sheet on Mobile**
`src/components/properties/PropertyFilterBar.tsx` + `src/components/properties/PropertyFilters.tsx`
- Wrap the filter panel in a `Sheet` (bottom drawer) on mobile instead of inline expansion
- Add a sticky "Apply Filters" button at the bottom of the sheet
- Show active filter count badge on the trigger button

**4. Seller Form — Improved Mobile Stepper**
`src/components/seller/SellerForm.tsx`
- Replace the horizontal step indicators with a compact progress bar + "Step X of 5" label on mobile
- Ensure form fields use `w-full` and adequate touch target sizes (min 44px)
- Make the next/back buttons sticky at the bottom on mobile

**5. AppLayout Page Header — Compact on Mobile**
`src/components/layout/AppLayout.tsx`
- Reduce page header padding and icon size on mobile
- Stack title and subtitle vertically with tighter spacing
- Ensure `headerActions` wrap properly on small screens

### Files Changed
- `src/components/comparison/ComparisonTable.tsx` — mobile card view
- `src/components/landing/HeroSection.tsx` — hide floating badges, reduce text sizes
- `src/components/properties/PropertyFilterBar.tsx` — bottom sheet trigger
- `src/components/properties/PropertyFilters.tsx` — sheet wrapper on mobile
- `src/components/seller/SellerForm.tsx` — compact mobile stepper + sticky buttons
- `src/components/layout/AppLayout.tsx` — compact mobile header


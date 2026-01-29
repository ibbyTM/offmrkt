
## Mobile Optimization for Admin Panel and Submit Property Pages

Fix the "zoomed in" appearance on mobile by making all layouts responsive, converting tables to card-based views on mobile, and adjusting spacing.

---

### Root Cause

The pages appear "zoomed in" on mobile because:
1. Tables with many columns force horizontal overflow
2. Large fixed padding values (p-8, p-6) consume too much screen space
3. Flex layouts with `justify-between` spread content too wide
4. Grid columns don't collapse on mobile

---

### Files to Update

| File | Changes |
|------|---------|
| `src/pages/Admin.tsx` | Reduce card padding on mobile, improve grid layouts for home cards |
| `src/components/admin/LeadsTable.tsx` | Add horizontal scroll wrapper, hide less important columns on mobile |
| `src/components/admin/FunnelAnalyticsTab.tsx` | Make table responsive with horizontal scroll, adjust grid for mobile |
| `src/components/admin/MortgageReferralsTable.tsx` | Add horizontal scroll, simplify mobile view |
| `src/components/admin/ApplicationsTable.tsx` | Stack action buttons vertically on mobile |
| `src/components/admin/SubmissionsTable.tsx` | Stack action buttons vertically on mobile |
| `src/components/crm/InvestorCRMTab.tsx` | Improve header stacking on mobile |
| `src/pages/SubmitProperty.tsx` | Reduce padding on mobile |
| `src/components/seller/SellerForm.tsx` | Adjust progress steps spacing on mobile |

---

### Detailed Changes

#### 1. Admin.tsx - Home Cards
- Change `p-8` to `p-4 sm:p-6 md:p-8` for responsive padding
- Stack card content vertically on mobile: `flex-col md:flex-row`
- Reduce icon container size on mobile
- Make text sizes responsive

#### 2. LeadsTable.tsx
- Wrap table in `overflow-x-auto` container
- Add `min-w-[600px]` to table for consistent column widths
- Add `whitespace-nowrap` to table cells to prevent wrapping

#### 3. FunnelAnalyticsTab.tsx
- Stats grid: Change from `lg:grid-cols-4` to include `sm:grid-cols-2`
- Table: Wrap in `overflow-x-auto`, hide Action column on mobile
- Charts grid: Change to `grid-cols-1 md:grid-cols-2`

#### 4. MortgageReferralsTable.tsx
- Already has `overflow-x-auto` wrapper - verify it's working
- Add `min-w-[800px]` to table for consistent layout

#### 5. ApplicationsTable.tsx
- Buttons container: Change to `flex-col sm:flex-row` on mobile
- Make buttons full-width on mobile with `w-full sm:w-auto`

#### 6. SubmissionsTable.tsx
- Same button layout fixes as ApplicationsTable

#### 7. InvestorCRMTab.tsx
- Header buttons: Already has `flex-col sm:flex-row` - verify alignment
- Filter section: Ensure proper stacking

#### 8. SubmitProperty.tsx
- Change `p-6` to `p-4 sm:p-6` for less padding on mobile

#### 9. SellerForm.tsx
- Progress step connectors: Reduce width on mobile
- Form container: Already has `max-w-3xl`, consider responsive padding

---

### Technical Implementation

**Pattern for responsive tables:**
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="min-w-[600px] px-4 sm:px-0">
    <Table>...</Table>
  </div>
</div>
```

**Pattern for responsive cards:**
```tsx
<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
  {/* Content stacks vertically on mobile, horizontally on desktop */}
</div>
```

**Pattern for responsive buttons:**
```tsx
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
  <Button className="w-full sm:w-auto">Action</Button>
</div>
```

---

### Implementation Order

1. Fix Admin.tsx home cards layout (highest visual impact)
2. Fix LeadsTable.tsx and FunnelAnalyticsTab.tsx tables
3. Fix ApplicationsTable.tsx and SubmissionsTable.tsx button layouts
4. Fix MortgageReferralsTable.tsx
5. Adjust SubmitProperty.tsx and SellerForm.tsx padding
6. Test all changes on mobile viewport

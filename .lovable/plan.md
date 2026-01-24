

## Admin Property Status Management & Sold Property Visuals

### Overview
This plan adds the ability for admins to change property listing status (available, reserved, under offer, sold) directly from the property detail page, with enhanced visuals for sold properties including a "Sold in X days" indicator.

---

### Database Changes

#### Add `sold_at` Column
We need a timestamp to track when a property was marked as sold, enabling the "Sold in X days" calculation.

```sql
ALTER TABLE properties ADD COLUMN sold_at timestamp with time zone;
```

No new enum values needed - `sold` already exists in `listing_status`.

---

### Implementation Details

#### 1. Create Status Update Hook

**New file:** `src/hooks/useUpdatePropertyStatus.ts`

```tsx
export function useUpdatePropertyStatus() {
  return useMutation({
    mutationFn: async ({ propertyId, status }) => {
      const updates = {
        listing_status: status,
        updated_at: new Date().toISOString(),
        // Set sold_at when marking as sold, clear it otherwise
        sold_at: status === 'sold' ? new Date().toISOString() : null,
      };
      // Update via Supabase
    },
    onSuccess: () => { /* Invalidate queries, show toast */ }
  });
}
```

---

#### 2. Enhance Admin Property Toolbar

**File:** `src/components/property-detail/AdminPropertyToolbar.tsx`

Add a status dropdown alongside the existing "Enhance with AI" button:

```text
┌────────────────────────────────────────────────────────────────┐
│ 🛡️ Admin Controls                                              │
│                                                                │
│  Status: [Available ▼]     [Enhance with AI]                  │
│          ├─ Available                                          │
│          ├─ Reserved                                           │
│          ├─ Under Offer                                        │
│          └─ Sold ✓                                             │
└────────────────────────────────────────────────────────────────┘
```

Changes:
- Import `Select` component
- Add status state and change handler
- Use the new `useUpdatePropertyStatus` hook
- Show confirmation dialog when marking as "Sold" (irreversible action warning)

---

#### 3. Property Card - Sold Overlay & Badge

**File:** `src/components/properties/PropertyCard.tsx`

For sold properties, add:
- Semi-transparent overlay on the image
- "SOLD" banner across the image
- "Sold in X days" badge (calculated from `created_at` to `sold_at`)
- Muted/grayscale styling for sold listings

```tsx
// Calculate days to sell
const getDaysToSell = (createdAt: string, soldAt: string) => {
  const days = differenceInDays(new Date(soldAt), new Date(createdAt));
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''}`;
};

// Visual treatment
const isSold = property.listing_status === 'sold';
```

Visual for sold property card:
```text
┌─────────────────────────────────┐
│ [Image with overlay]            │
│      ╔═══════════════╗          │
│      ║     SOLD      ║          │
│      ╚═══════════════╝          │
│   [Sold in 3 days]              │
├─────────────────────────────────┤
│ £185,000          #OMF2A9       │
│ Terraced                        │
│ 📍 Thornaby, TS17               │
│ 🛏️ 3  🛁 1  📈 8.2%             │
│ [View Details - muted]          │
└─────────────────────────────────┘
```

---

#### 4. Property Header - Sold Timestamp

**File:** `src/components/property-detail/PropertyHeader.tsx`

For sold properties, show when it sold:
- Change "Added {date}" to "Sold {date}" 
- Add "Sold in X days" achievement badge

```text
Before (available):
  📍 Thornaby, TS17  |  📅 Added 15/01/2025

After (sold):
  📍 Thornaby, TS17  |  ✓ Sold 22/01/2025 (7 days)
```

---

#### 5. Featured Properties - Handle Sold Status

**File:** `src/components/landing/FeaturedPropertiesSection.tsx`

The landing page should only show available properties (already filtered by `useProperties` hook), so no changes needed here. But we should verify the hook filters correctly.

---

#### 6. Update useProperties Hook (Optional Enhancement)

**File:** `src/hooks/useProperties.ts`

Currently filters to `available` only. Could add a new hook or parameter to allow admins to view all statuses:

```tsx
export function useAllProperties() {
  // For admin views - returns all statuses
}
```

This allows building an admin properties dashboard later if needed.

---

### Visual Design Specifications

#### Status Colors (Already Defined)
| Status | Color | Use |
|--------|-------|-----|
| Available | `bg-emerald-500` | Default, active listing |
| Reserved | `bg-amber-500` | Deposit received |
| Under Offer | `bg-blue-500` | Negotiating |
| Sold | `bg-red-500` | Completed sale |

#### Sold Property Card Treatment
| Element | Style |
|---------|-------|
| Image | `grayscale-[30%] opacity-80` overlay |
| SOLD banner | Red diagonal or horizontal banner |
| "Sold in X" badge | `bg-red-100 text-red-700` success indicator |
| Card border | Normal (still clickable for history) |
| CTA button | Muted variant or "View History" |

#### "Sold in X" Badge Logic
```tsx
const getSoldInText = (createdAt: string, soldAt: string | null) => {
  if (!soldAt) return null;
  const days = differenceInDays(new Date(soldAt), new Date(createdAt));
  
  if (days === 0) return "Same day!";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week";
  if (weeks < 4) return `${weeks} weeks`;
  
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? 's' : ''}`;
};
```

---

### Files Changed Summary

| File | Change |
|------|--------|
| Database Migration | Add `sold_at` column |
| `src/hooks/useUpdatePropertyStatus.ts` | New hook for status changes |
| `src/hooks/useProperties.ts` | Add types, optional admin hook |
| `src/lib/propertyUtils.ts` | Add `getSoldInText` helper |
| `src/components/property-detail/AdminPropertyToolbar.tsx` | Add status dropdown |
| `src/components/properties/PropertyCard.tsx` | Sold overlay and badge |
| `src/components/property-detail/PropertyHeader.tsx` | Sold date display |
| `src/components/landing/FeaturedPropertiesSection.tsx` | Sold treatment (if shown) |

---

### User Flow

1. **Admin views property detail page** → Sees status dropdown in Admin Controls bar
2. **Admin selects "Sold"** → Confirmation dialog appears ("This will mark the property as sold and record today's date")
3. **Admin confirms** → Property status updates, `sold_at` timestamp set
4. **Property card updates** → Shows SOLD banner, grayscale effect, "Sold in X days" badge
5. **Property no longer appears** in main listings (filtered by `available` status)
6. **Direct URL still works** → Property detail viewable with sold styling

---

### Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| No `sold_at` timestamp | Don't show "Sold in X" badge |
| Sold same day | Show "Same day!" |
| Changing from sold back to available | Clear `sold_at`, restore normal styling |
| Admin tries to sell already-sold property | Button disabled or shows current sold date |


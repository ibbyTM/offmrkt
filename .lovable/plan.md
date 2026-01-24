

## Remove Daily Submission Limit & Increase Photo Limit to 60

### Overview

You want two changes:
1. **Remove the daily property submission limit** — Currently there's a database trigger enforcing a 5-property-per-day limit
2. **Increase photo limit from 10 to 60** — Allow more property images per submission

### Current State

| Feature | Current Setting | New Setting |
|---------|-----------------|-------------|
| Daily submission limit | 5 per user per 24 hours | **No limit** |
| Photo upload limit | 10 photos | **60 photos** |

---

### Implementation

#### 1. Remove Daily Submission Limit

**Database Migration**: Drop the trigger and function that enforces the rate limit.

```sql
-- Drop the rate limit trigger
DROP TRIGGER IF EXISTS enforce_seller_submission_rate_limit ON public.seller_submissions;

-- Drop the rate limit function
DROP FUNCTION IF EXISTS public.check_seller_submission_rate_limit();
```

**Frontend Update**: Remove the rate limit error handling message from `SellerForm.tsx` (since it will never trigger).

| File | Change |
|------|--------|
| `supabase/migrations/[timestamp]_remove_submission_rate_limit.sql` | Drop trigger and function |
| `src/components/seller/SellerForm.tsx` | Remove rate limit error handling (lines 338-345) |

#### 2. Increase Photo Limit to 60

Update the `maxPhotos` prop passed to `PhotoUpload` component.

| File | Change |
|------|--------|
| `src/components/seller/SellerForm.tsx` | Change `maxPhotos={10}` to `maxPhotos={60}` on line 915 |

---

### Technical Details

#### Database Migration

```sql
-- Remove submission rate limit
-- This allows users to submit unlimited properties per day

-- Drop the trigger first (depends on the function)
DROP TRIGGER IF EXISTS enforce_seller_submission_rate_limit ON public.seller_submissions;

-- Drop the function
DROP FUNCTION IF EXISTS public.check_seller_submission_rate_limit();
```

#### SellerForm.tsx Changes

**Line 915** — Change photo limit:
```tsx
// Before
<PhotoUpload
  photos={photos}
  onPhotosChange={setPhotos}
  maxPhotos={10}
/>

// After
<PhotoUpload
  photos={photos}
  onPhotosChange={setPhotos}
  maxPhotos={60}
/>
```

**Lines 338-345** — Remove rate limit error handling:
```tsx
// Remove this block (no longer needed)
if (error.message?.includes('Rate limit exceeded')) {
  toast({
    title: "Submission limit reached",
    description: "You can submit up to 5 properties per day. Please try again tomorrow.",
    variant: "destructive",
  });
  return;
}
```

### Files to Modify

| File | Change |
|------|--------|
| New migration file | Drop rate limit trigger and function |
| `src/components/seller/SellerForm.tsx` | Update `maxPhotos` to 60, remove rate limit error handling |

### Result

After these changes:
- Users can submit unlimited properties per day
- Each property submission can include up to 60 photos instead of 10
- The multi-unit feature will work without hitting rate limits (e.g., 8 units at once is no problem)


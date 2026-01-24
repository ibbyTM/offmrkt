

## Fix: RLS Policy Blocking Sold Properties

### Root Cause

The database has a Row-Level Security (RLS) policy that ONLY allows public access to properties with `listing_status = 'available'`:

```sql
Policy Name: Anyone can view available properties 
Using Expression: (listing_status = 'available'::listing_status)
```

This means when the client queries for properties with `.in("listing_status", ["available", "sold"])`, the RLS policy filters out sold properties at the database level before returning results.

The sold Thornaby property exists in the database but is invisible to non-admin users.

---

### Solution

Update the RLS policy to allow viewing both `available` AND `sold` properties:

```sql
-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;

-- Create new policy that allows both available and sold
CREATE POLICY "Anyone can view available and sold properties" 
  ON properties
  FOR SELECT
  USING (listing_status IN ('available', 'sold'));
```

This will:
1. Allow sold properties to be fetched from the database
2. Enable the client-side "Show Sold Properties" toggle to work correctly
3. Keep reserved and under_offer properties hidden from public view

---

### No Frontend Changes Needed

The frontend code is already correct:
- `useProperties` hook uses `.in("listing_status", ["available", "sold"])`
- Filter toggle correctly filters by `showSold` state
- Sold properties are pushed to end of list when shown

Once the RLS policy is updated, the "Show Sold Properties" filter will work as expected.

---

### Files Changed

| File | Change |
|------|--------|
| Database Migration | Update RLS policy to include `sold` status |


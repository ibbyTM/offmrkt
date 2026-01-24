

## Tighten RLS Policies for seller_submissions and mortgage_referrals

### Current State

Both tables have overly permissive INSERT policies:

| Table | Current Policy | Issue |
|-------|---------------|-------|
| `seller_submissions` | `WITH CHECK (true)` | Anyone (even unauthenticated) can insert |
| `mortgage_referrals` | `WITH CHECK (true)` | Anyone (even unauthenticated) can insert |

### Analysis

**seller_submissions:**
- The frontend `SellerForm.tsx` already blocks submissions if user is not logged in (line 225-233)
- The insert statement includes `user_id: user.id` (line 263)
- All SELECT/UPDATE/DELETE policies already require `auth.uid() = user_id`

**mortgage_referrals:**
- The Edge Function `mortgage-enquiry/index.ts` requires authentication (lines 54-78)
- The function extracts `userId` from claims and sets it on the insert (line 80, 90)
- SELECT is restricted to admins only

Both tables now have proper `user_id` tracking, making the `USING(true)` INSERT policies unnecessary and a security risk.

### Solution

Tighten the INSERT policies to require:
1. User must be authenticated
2. The `user_id` column must match the authenticated user's ID

### Database Migration

```sql
-- Tighten seller_submissions INSERT policy
DROP POLICY IF EXISTS "Anyone can submit properties" ON seller_submissions;
CREATE POLICY "Authenticated users can submit their own properties" 
  ON seller_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tighten mortgage_referrals INSERT policy  
DROP POLICY IF EXISTS "Anyone can log mortgage referrals" ON mortgage_referrals;
CREATE POLICY "Authenticated users can log their own mortgage referrals" 
  ON mortgage_referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### Why This is Safe

| Concern | Resolution |
|---------|------------|
| Will existing flows break? | No - both flows already require auth and set user_id |
| Edge function inserts? | Safe - edge function uses authenticated client and sets correct user_id |
| Direct frontend inserts? | Safe - SellerForm requires login and passes user.id |

### Security Improvements

| Before | After |
|--------|-------|
| Unauthenticated users could insert garbage data | Only authenticated users can insert |
| Anyone could insert with any/no user_id | user_id must match the authenticated user |
| Bot/spam submissions possible | Authentication barrier prevents automated abuse |

### Files Changed

| File | Change |
|------|--------|
| Database Migration | Drop permissive policies, create restricted ones |

### No Frontend Changes Required

The existing frontend code already:
- Requires authentication before submission
- Passes the correct `user.id` to the insert
- Will continue working with the tightened policies


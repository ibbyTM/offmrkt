

## Add Visual Indicator for Already-Listed Submissions

### Overview
Add a visual indicator in the admin panel to show when a property submission has already been converted to a listing. This prevents accidental re-listing attempts and provides clearer status information for admins.

### Current State
- The `useConvertToListing` hook already checks for existing properties before creating duplicates
- However, there's no visual feedback to admins that a submission has already been listed
- The "Approve & List" button still shows for pending submissions even if a property exists (edge case after status rollback)

### Solution
Modify the seller submissions query to include linked property information, then display visual indicators throughout the admin interface.

---

### Files to Modify

#### 1. `src/hooks/useSellerSubmissions.ts`

**Change**: Update the query to join with properties table to check if a property already exists.

```typescript
// Current
.select("*")

// Updated - include linked property info
.select("*, linked_property:properties!submission_id(id)")
```

**Add**: Export a helper type for the enhanced submission with property info.

```typescript
export type SellerSubmissionWithProperty = SellerSubmission & {
  linked_property: { id: string } | null;
};
```

---

#### 2. `src/components/admin/SubmissionsTable.tsx`

**Changes**:
- Update type to use `SellerSubmissionWithProperty`
- Add a "Already Listed" indicator badge next to pending submissions that have a linked property
- Disable "Approve & List" button if property already exists (with tooltip explaining why)

**Visual Indicator Locations**:
1. **Badge next to status**: Show a separate "Has Listing" badge for submissions with linked properties
2. **Button state**: Change "Approve & List" to "Update Listing" if property exists, or show informative tooltip

---

#### 3. `src/components/admin/SubmissionDetailDialog.tsx`

**Changes**:
- Show a prominent alert/banner if the submission already has a linked property
- Include link to view the property listing
- Update action button text to reflect re-sync vs new listing

---

### Visual Design

**For submissions with an existing property listing**:

| Location | Indicator |
|----------|-----------|
| Card header | Blue "Has Listing" badge with link icon |
| Action buttons | "Sync Changes" instead of "Approve & List" |
| Detail dialog | Info banner: "This submission already has a live property listing" with View Property link |

**Example Badge**:
```text
[Pending Review] [Has Listing →]
                 ↑ clickable link to /properties/:id
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `useSellerSubmissions.ts` | Join with properties table, add type for property relationship |
| `SubmissionsTable.tsx` | Add "Has Listing" badge, update button text for re-sync scenario |
| `SubmissionDetailDialog.tsx` | Add info banner when property exists, link to live listing |

### Result
- Admins can immediately see which submissions already have listings
- Button text changes to reflect the actual action (sync vs create)
- Prevents confusion about whether clicking "Approve & List" will create duplicates
- Provides quick access to view the live property listing


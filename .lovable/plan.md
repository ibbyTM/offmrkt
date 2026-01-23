
## Streamline Admin Workflow: Approve = Automatically List

### Current Workflow (2 Steps)
1. Admin clicks "Approve" → Status changes to "approved"
2. Admin must then click "Add to Listings" → Property is created and status becomes "listed"

### New Workflow (1 Step)
1. Admin clicks "Approve" → Property is created automatically and status becomes "listed"

### Implementation Approach

There are two options:
1. **Option A (Client-side)**: Modify the approve button handlers to call the `convertToListing` mutation instead of `updateSubmissionStatus`
2. **Option B (Database trigger)**: Create a database trigger that automatically creates a listing when status changes to "approved"

**Recommended: Option A (Client-side)** - Simpler, easier to maintain, and allows for clearer user feedback.

---

### Files to Modify

#### 1. `src/components/admin/SubmissionsTable.tsx`

**Current behavior (lines 205-221):**
The "Approve" button calls `onUpdateStatus(submission.id, "approved")`

**New behavior:**
The "Approve" button should call `onConvertToListing(submission)` directly, which creates the listing and triggers the database trigger to set status to "listed".

```typescript
// Change line 210 from:
onClick={() => onUpdateStatus(submission.id, "approved")}

// To:
onClick={() => onConvertToListing(submission)}
```

Also update button text and loading state to reflect the combined action.

#### 2. `src/components/admin/SubmissionDetailDialog.tsx`

**Current behavior (lines 351-360):**
Shows an "Approve" button that sets status to "approved", then separately shows "Create Listing" button for approved submissions.

**New behavior:**
The "Approve" button should directly create the listing. Remove the intermediate "approved" state UI.

---

### Summary of Changes

| File | Change |
|------|--------|
| `SubmissionsTable.tsx` | Change "Approve" button to call `onConvertToListing` instead of `onUpdateStatus("approved")` |
| `SubmissionsTable.tsx` | Update button text from "Approve" to "Approve & List" |
| `SubmissionsTable.tsx` | Update loading state to use `isConverting` |
| `SubmissionsTable.tsx` | Remove the separate "Add to Listings" button for approved status |
| `SubmissionDetailDialog.tsx` | Same changes for the detail dialog approve button |
| `SubmissionDetailDialog.tsx` | Remove the separate "Create Listing" button |

### Expected Result

| Before | After |
|--------|-------|
| Pending → Approve → Approved → Add to Listings → Listed | Pending → Approve & List → Listed |
| 2 clicks to publish | 1 click to publish |
| "approved" status exists as intermediate state | Submissions go directly from pending to listed |

### What About Rejected Submissions?
The reject flow remains unchanged - admin can still reject submissions that shouldn't be listed.

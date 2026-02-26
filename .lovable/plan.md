

## Fix: Cannot Delete Listed Property Submissions

### Problem
When you try to delete a property submission that has already been converted to a listing, the delete fails with a foreign key constraint error. The `properties` table has a `submission_id` column that references the `seller_submissions` table, so the submission cannot be deleted while a linked property exists.

### Solution
Update the delete logic in `src/hooks/useUserSubmissions.ts` to first delete the linked property record from the `properties` table, then delete the submission itself. This ensures the foreign key constraint is satisfied.

### Technical Details

**File: `src/hooks/useUserSubmissions.ts`**

In the `deleteSubmission` mutation function:
1. Before deleting the submission, query the `properties` table for any record where `submission_id` matches
2. If a linked property exists, delete it first
3. Then delete the submission as before

This is a small change to one file and resolves the constraint error you're seeing.


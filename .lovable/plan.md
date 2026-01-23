
## Add Unique Constraint on submission_id

### Overview
Add a database constraint to ensure only one property can exist per seller submission. This prevents the duplicate listing bug from ever happening again at the database level.

### Current State
- The `submission_id` column exists and is nullable (correctly allowing admin-created properties without a submission)
- No unique constraint currently exists
- The duplicate cleanup has already been completed (verified: no duplicates remain)

### Solution
Add a partial unique index on `submission_id` that only applies when the value is NOT NULL. This approach:
- Allows multiple properties with `submission_id = NULL` (for admin-created listings)
- Prevents multiple properties with the same non-null `submission_id`

### Database Migration

```sql
-- Add unique constraint on submission_id (only for non-null values)
CREATE UNIQUE INDEX idx_properties_unique_submission 
ON public.properties (submission_id) 
WHERE submission_id IS NOT NULL;
```

### Why a Partial Index?
A standard unique constraint would fail because:
- Multiple properties might have `submission_id = NULL` (admin-created properties)
- PostgreSQL considers each NULL as distinct, but a partial index is cleaner and more explicit

### Result

| Scenario | Behavior |
|----------|----------|
| First listing from submission | Allowed |
| Second listing from same submission | **Blocked** by database |
| Admin creates property without submission | Allowed (NULL submission_id) |
| Multiple admin-created properties | Allowed (all have NULL) |

### Error Handling
If the code ever tries to create a duplicate, the database will return an error like:
```
duplicate key value violates unique constraint "idx_properties_unique_submission"
```

This provides a safety net even if application logic fails.

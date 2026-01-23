
## Fix: Prevent Duplicate Listings When Re-approving Edited Submissions

### Problem Identified
When a user edits an already-listed property submission:
1. The edit resets `admin_status` to "pending"
2. Admin re-approves by clicking "Approve & List"
3. The system **creates a duplicate listing** instead of updating the existing one

This is confirmed by database showing multiple properties with the same `submission_id`.

### Root Cause
The `useConvertToListing` function always performs an INSERT without checking if a property already exists for that submission.

### Solution
Modify the `useConvertToListing` mutation to:
1. First check if a property already exists for the given `submission_id`
2. If it exists: just update the submission status to "listed" (the database trigger will sync changes)
3. If it doesn't exist: create the new property listing

---

### Technical Details

**File: `src/hooks/useSellerSubmissions.ts`**

Update the `useConvertToListing` mutation function:

```typescript
mutationFn: async (submission: SellerSubmission) => {
  // Check if a property already exists for this submission
  const { data: existingProperty } = await supabase
    .from("properties")
    .select("id")
    .eq("submission_id", submission.id)
    .maybeSingle();

  if (existingProperty) {
    // Property already exists - just update submission status
    // The sync_submission_to_property trigger will handle the updates
    const { error: updateError } = await supabase
      .from("seller_submissions")
      .update({ admin_status: "listed" })
      .eq("id", submission.id);

    if (updateError) throw updateError;
    return existingProperty;
  }

  // No existing property - create new listing
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert({
      // ... existing insert fields
    })
    .select()
    .single();

  if (propertyError) throw propertyError;
  return property;
},
```

### How It Works

| Scenario | Action |
|----------|--------|
| First-time approval | Creates new property, trigger sets status to "listed" |
| Re-approval after edit | Updates status to "listed", sync trigger updates property |

### Why This Works

The existing database trigger `sync_submission_to_property` already syncs changes from submissions to properties when status is "listed". By simply updating the status (instead of creating a new property), the trigger handles all the field updates automatically.

### Summary

| Aspect | Before | After |
|--------|--------|-------|
| First approval | Creates property | Creates property (no change) |
| Re-approval after edit | Creates duplicate property | Updates existing property via trigger |
| Database integrity | Broken (duplicates) | Maintained (one property per submission) |



## Clean Up Duplicate Properties

### Current State
Found 5 duplicate property entries that need to be removed:

| Submission | Property to Keep | Duplicates to Delete |
|------------|-----------------|---------------------|
| 4 Bed HMO in Thornaby | `db609650...` (Jan 14) | `ecff8308...` (Jan 23), `d70c95a2...` (Jan 23) |
| 5 Bed Detached in Manchester | `afa2a421...` (Jan 22) | `e7f7f2a4...` (Jan 23) |

### Action Required

Since this is a data deletion operation, you'll need to run this SQL in Cloud View:

1. Go to **Cloud View** → **Run SQL**
2. Execute the following query:

```sql
-- Delete duplicate properties, keeping the oldest one per submission_id
DELETE FROM properties 
WHERE id IN (
  'ecff8308-87e7-461f-a3ec-bd33b2975be2',
  'd70c95a2-6feb-4313-b961-0724e3cd053b',
  'e7f7f2a4-ea67-4c93-a5fc-6d1091fd4950'
);
```

### Result
- **3 duplicate rows will be deleted**
- **2 original properties will remain** (one per submission)
- Database integrity restored

### How to Access
Click the button below to open Cloud View where you can run the SQL:

<lov-actions>
<lov-open-backend>Open Cloud View</lov-open-backend>
</lov-actions>


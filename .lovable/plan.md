

## Add Rate Limiting to Seller Submission Form

### Overview
Implement rate limiting at the database level to prevent abuse of the property submission form. This will restrict users to a maximum of 5 submissions per 24-hour period.

### Why Database-Level Rate Limiting?

The seller submission form inserts directly to the `seller_submissions` table via the Supabase client. A database-level approach:
- Guarantees enforcement regardless of how data is inserted
- Requires no frontend code changes
- Works with the existing RLS policies
- Provides clear, consistent error messages

### Implementation

#### 1. Create Rate Limit Check Function

A database function that counts a user's recent submissions:

```sql
CREATE OR REPLACE FUNCTION check_seller_submission_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  submission_count INTEGER;
  max_submissions INTEGER := 5;
  time_window INTERVAL := '24 hours';
BEGIN
  -- Count submissions by this user in the time window
  SELECT COUNT(*) INTO submission_count
  FROM seller_submissions
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - time_window;

  -- Check if limit exceeded
  IF submission_count >= max_submissions THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum % submissions allowed per 24 hours.', max_submissions
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Create Trigger

Attach the function to run before each insert:

```sql
CREATE TRIGGER enforce_seller_submission_rate_limit
  BEFORE INSERT ON seller_submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_seller_submission_rate_limit();
```

#### 3. Frontend Error Handling

Update the `SellerForm.tsx` to display a user-friendly message when rate limited:

```tsx
// In the catch block of onSubmit
if (error.message?.includes('Rate limit exceeded')) {
  toast({
    title: "Submission limit reached",
    description: "You can submit up to 5 properties per day. Please try again tomorrow.",
    variant: "destructive",
  });
  return;
}
```

### Rate Limit Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| Max submissions | 5 | Generous for legitimate sellers with portfolios |
| Time window | 24 hours | Rolling window prevents gaming |
| Scope | Per user | Tied to authenticated user_id |

### Benefits

- **Prevents spam**: Limits automated or malicious bulk submissions
- **Fair usage**: Legitimate sellers rarely submit more than 5 properties at once
- **Clear feedback**: Users receive helpful error messages when limit is reached
- **No frontend complexity**: Rate limiting is enforced server-side

### Files to Create/Modify

| File | Change |
|------|--------|
| Database Migration | Create rate limit function and trigger |
| `src/components/seller/SellerForm.tsx` | Add user-friendly rate limit error handling |


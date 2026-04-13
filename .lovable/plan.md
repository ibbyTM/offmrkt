

## Mask Property Address in Investor Alert Emails

The `notify-matching-investors` edge function currently sends `property.property_address` (full street address including door number) in the email. This needs to be masked to show only the street name and city — consistent with how the rest of the site handles property privacy.

### Changes

**`supabase/functions/notify-matching-investors/index.ts`** (line ~122)
- Before passing `propertyAddress` to the template, strip the house/flat number from the address
- Add a helper function that removes leading numbers and unit prefixes (e.g. "42 High Street" → "High Street", "Flat 3, 10 Oak Lane" → "Oak Lane")
- Pass the masked address as `propertyAddress` in the template data

**`supabase/functions/_shared/transactional-email-templates/new-property-alert.tsx`**
- No structural changes needed — it already just renders `propertyAddress` and `city`
- Update the preview data to reflect the masked format (e.g. "High Street, Manchester")

**Redeploy**: `notify-matching-investors` edge function

### Masking logic
```text
"42 High Street"         → "High Street"
"Flat 3, 10 Oak Lane"    → "Oak Lane"
"10a Victoria Road"      → "Victoria Road"
"Unit 5, 22 Park Avenue" → "Park Avenue"
```

Simple regex: strip leading flat/unit prefix if present, then strip leading numbers from the remaining string.




## Automated Investor Property Matching & Notifications

When a new property goes live, the system will automatically find matching investors and send them the existing "New Property Alert" email. It will also identify partial matches and notify those investors too.

### How matching works

Each approved investor has:
- `min_budget` / `max_budget` — price range
- `preferred_locations` — array of city/region names
- `preferred_strategies` — array like `btl`, `brrr`, `capital_growth`

Each property has:
- `asking_price`, `property_city`, `strategies[]`, `property_type`, `gross_yield_percentage`

**Full match** = price in budget range AND location matches AND at least one strategy overlaps.
**Partial match** = meets 1-2 of the 3 criteria (e.g. right price but different city).

### Changes

**1. Create a new Edge Function: `notify-matching-investors`**
- Accepts a `propertyId` in the request body
- Fetches the property details
- Fetches all approved investors (with profiles for name/email)
- Scores each investor: budget match, location match, strategy match
- Full matches: sends `new-property-alert` email immediately
- Partial matches: sends a slightly different subject line (e.g. "A deal you might like") using the same template but with a note
- Uses idempotency keys (`property-alert-{propertyId}-{investorId}`) to prevent duplicate sends
- Checks suppression list automatically (built into send-transactional-email)

**2. Update the `new-property-alert` template**
- Add an optional `matchType` prop so partial matches show "This property partially matches your criteria" vs full matches showing "This matches your investment criteria"

**3. Wire up the trigger in two places**
- `useSellerSubmissions.ts` — after a property is created from a submission (listing goes live)
- `useUpdatePropertyStatus.ts` — when status changes to `available` (re-listing)
- Both call `supabase.functions.invoke('notify-matching-investors', { body: { propertyId } })`

**4. Update the registry** — no new template needed, just update the existing one

### What you'll see
- When you list a new property, all matching approved investors automatically get an email alert
- Partial matches get a softer version of the same email
- No duplicate emails if you accidentally trigger twice
- All sends are logged and visible in your email send history

### Technical details
- Files to create: `supabase/functions/notify-matching-investors/index.ts`
- Files to modify:
  - `supabase/functions/_shared/transactional-email-templates/new-property-alert.tsx` (add matchType prop)
  - `src/hooks/useSellerSubmissions.ts` (add trigger after property creation)
  - `src/hooks/useUpdatePropertyStatus.ts` (add trigger on status change to available)
- Deploy: `notify-matching-investors`, `send-transactional-email`




## Transactional Email Notifications for Investors

Your email domain is verified and ready. Here's the implementation plan for the 4 email templates you specified.

### Step 1: Set Up Email Infrastructure

Run the email infrastructure setup (creates email queue, database tables, cron job for processing). Then scaffold the transactional email Edge Functions (`send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`).

### Step 2: Create 4 Email Templates

Create branded React Email templates in `supabase/functions/_shared/transactional-email-templates/` matching your exact copy, styled with the project's Royal Blue palette (`hsl(220, 70%, 55%)` primary, `hsl(220, 25%, 15%)` foreground):

1. **`welcome-application.tsx`** — "Your Application Has Been Received"
2. **`application-approved.tsx`** — "You're Approved — Welcome to Off The Markets" (with "View Available Deals" CTA button linking to `/properties`)
3. **`application-rejected.tsx`** — "Your Off The Markets Application"
4. **`new-property-alert.tsx`** — "New Deal Alert: [Address] — [Yield]% Yield" (with property stats and "View Full Property Details" CTA)

Register all 4 in `registry.ts`. Deploy all edge functions.

### Step 3: Wire Up Triggers

**Welcome email** — In `QuestionnaireForm.tsx`, after successful application insert (line ~216), call `send-transactional-email` with the user's email and first name.

**Approved/Rejected emails** — In `useAdminApplications.ts` `useUpdateApplicationStatus`, in the `onSuccess` callback, call `send-transactional-email` with the appropriate template based on status. Will need to pass `recipientEmail` and `recipientName` through the mutation variables.

**New Property Alert** — This is the most complex one. When an admin lists a new property, we need to query approved investors whose `min_budget`/`max_budget` range overlaps the property price. However, per the transactional email rules, each email must be triggered by a specific event for a specific recipient. The trigger here is "admin listed a property that matches YOUR criteria" — each investor gets their own personalised email. Will add this to the admin property creation flow.

### Step 4: Unsubscribe Page

Create `src/pages/Unsubscribe.tsx` with a branded page that validates unsubscribe tokens and confirms opt-out. Add `/unsubscribe` route to `App.tsx`.

### Files Created
- `supabase/functions/_shared/transactional-email-templates/welcome-application.tsx`
- `supabase/functions/_shared/transactional-email-templates/application-approved.tsx`
- `supabase/functions/_shared/transactional-email-templates/application-rejected.tsx`
- `supabase/functions/_shared/transactional-email-templates/new-property-alert.tsx`
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `src/pages/Unsubscribe.tsx`

### Files Modified
- `src/components/questionnaire/QuestionnaireForm.tsx` — add welcome email trigger after submit
- `src/hooks/useAdminApplications.ts` — add approved/rejected email triggers in mutation
- `src/App.tsx` — add `/unsubscribe` route
- `supabase/config.toml` — new function entries


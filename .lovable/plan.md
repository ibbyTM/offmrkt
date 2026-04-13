

## Add Required Phone Number for Investors

**Problem**: 0 out of 29 approved investors have phone numbers on file. The registration form and investor questionnaire never collect a phone number.

### Approach

Add a required phone number field to the investor questionnaire (Step 1 — Financial Qualification), and save it to the `profiles` table when the questionnaire is submitted. For existing investors who already completed the questionnaire, add a prompt on the dashboard that asks them to add their phone number before they can access properties.

### Changes

**1. `src/components/questionnaire/QuestionnaireForm.tsx`**
- Add `phone: z.string().min(10, "Phone number is required")` to the schema
- Add a phone input field to Step 1 (Financial Qualification)
- On submit, update the user's profile with the phone number via `supabase.from("profiles").update({ phone })` alongside the existing questionnaire submission

**2. `src/pages/Dashboard.tsx`** (or relevant dashboard component)
- After loading the user profile, check if `phone` is null
- If missing, show a prominent banner/dialog asking them to add their phone number
- The banner includes a phone input and a save button that updates their profile
- Until they add a phone, the banner persists at the top of the dashboard

**3. `src/components/auth/AuthForm.tsx`**
- Add a phone field to the registration form schema (`registerSchema`)
- Save phone to user metadata on signup, which gets written to profiles via the `handle_new_user` trigger (or update profile after signup)

No database schema changes needed — the `profiles.phone` column already exists as nullable text.

### Summary
- New investors: phone collected at registration + questionnaire
- Existing investors: prompted via dashboard banner until they add their number



## Make Phone Number Prompt Global and Urgent

Currently the phone-missing banner only appears on the Dashboard page. Move it to a global blocking dialog that appears on every authenticated page until the user adds their number.

### Approach

Create a new `PhoneNumberPrompt` component that renders a **modal dialog** (not dismissible without entering a phone number) and place it in the `AuthProvider` or at the app root level so it appears on every page.

### Changes

**1. Create `src/components/auth/PhoneNumberPrompt.tsx`**
- A dialog/modal component that checks if the logged-in user has a phone number in their profile
- If phone is missing, show a non-dismissible `AlertDialog` with urgent messaging ("We need your phone number to proceed") and a phone input + save button
- On save, update `profiles.phone` and close the dialog
- Only renders for authenticated users who have completed the questionnaire (investors)

**2. Update `src/App.tsx`**
- Add `<PhoneNumberPrompt />` inside the `AuthProvider` so it renders globally on every page

**3. Update `src/pages/Dashboard.tsx`**
- Remove the phone-missing banner, `phoneMissing` state, `phoneInput` state, `savingPhone` state, and the related profile fetch/save logic (since it's now handled globally)

### Result
- Every page (including `/properties`, `/dashboard`, property detail pages) will show the blocking phone prompt for investors without a phone number
- Users cannot dismiss it without entering their number
- Once saved, the dialog disappears and doesn't return


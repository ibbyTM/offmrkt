

## Add "Notify Investors" Button to Admin Property Toolbar

Add a button to the existing `AdminPropertyToolbar` that lets admins manually trigger the `notify-matching-investors` edge function for the current property.

### Changes

**`src/components/property-detail/AdminPropertyToolbar.tsx`**
- Add a `isNotifying` state and a `handleNotifyInvestors` handler that calls `supabase.functions.invoke("notify-matching-investors", { body: { propertyId: property.id } })`
- On success, show a toast with the match counts returned (e.g. "Notified 3 investors (2 full, 1 partial)")
- On error, show an error toast
- Add a confirmation `AlertDialog` before sending (to prevent accidental mass emails)
- Add a `Mail` icon button in the toolbar row alongside the existing buttons

No database or edge function changes needed — the function already exists and works.


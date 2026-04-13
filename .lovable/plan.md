

## Remove "Notify Investors" Button from Admin Property Toolbar

Remove the manually-added "Notify Investors" button, its confirmation dialog, and all related state/handlers from `src/components/property-detail/AdminPropertyToolbar.tsx`.

### Changes

**`src/components/property-detail/AdminPropertyToolbar.tsx`**
- Remove `isNotifying` and `showNotifyConfirm` state variables
- Remove `handleNotifyInvestors` function
- Remove the `Mail` icon import
- Remove the "Notify Investors" `<Button>`
- Remove the "Notify Matching Investors?" `<AlertDialog>`

No other files affected.


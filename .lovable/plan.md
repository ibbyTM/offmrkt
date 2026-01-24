

## Add Address Autocomplete to Edit Submission Dialog

### Overview

Add the same UK address autocomplete functionality to the Edit Submission Dialog that already exists in the Seller Form. This will provide a consistent user experience when editing property submissions from the dashboard.

### Forms Analyzed

| Form | Collects UK Addresses? | Needs Autocomplete? |
|------|------------------------|---------------------|
| SellerForm.tsx | Yes (already done) | Already implemented |
| EditSubmissionDialog.tsx | Yes - property address, city, postcode | **Yes** |
| AddContactDialog.tsx | No - only city names for preferred locations | No |
| ContactDetailDrawer.tsx | No - read-only display | No |
| InvestorDetailDrawer.tsx | No - read-only display | No |

The CRM components collect "preferred locations" (city names like "Bradford, Leeds") rather than full street addresses, so they don't need the Royal Mail address lookup.

### Implementation

#### File to Modify

**src/components/dashboard/EditSubmissionDialog.tsx**

Replace the standard text input for `property_address` with the `AddressAutocomplete` component, using the same pattern as the Seller Form.

#### Changes Required

1. Import the AddressAutocomplete component
2. Replace the Input field for property_address with AddressAutocomplete
3. Use the onAddressSelect callback to auto-fill city and postcode fields

```text
Before:
┌─────────────────────────────────────────────┐
│ Property Address                            │
│ ┌─────────────────────────────────────────┐ │
│ │ 123 Example Street                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ City              │ Postcode                │
│ ┌───────────────┐ │ ┌───────────────┐       │
│ │ Manchester    │ │ │ M1 1AA        │       │
│ └───────────────┘ │ └───────────────┘       │
└─────────────────────────────────────────────┘

After:
┌─────────────────────────────────────────────┐
│ Property Address                            │
│ ┌─────────────────────────────────────────┐ │
│ │ 45 High St...                       ▾   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ 45 High Street, Manchester, M1 1AA      │ │
│ │ 45 High Street, Liverpool, L1 6BN       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ City              │ Postcode                │
│ ┌───────────────┐ │ ┌───────────────┐       │
│ │ (auto-filled) │ │ │ (auto-filled) │       │
│ └───────────────┘ │ └───────────────┘       │
└─────────────────────────────────────────────┘
```

---

### Technical Details

#### Code Changes

**1. Add import at top of file:**
```typescript
import { AddressAutocomplete } from "@/components/seller/AddressAutocomplete";
```

**2. Replace the property_address FormField (lines 148-161):**

```tsx
<FormField
  control={form.control}
  name="property_address"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Property Address</FormLabel>
      <FormControl>
        <AddressAutocomplete
          value={field.value}
          onChange={field.onChange}
          onAddressSelect={(address) => {
            form.setValue("property_address", address.street);
            form.setValue("property_city", address.city);
            form.setValue("property_postcode", address.postcode);
          }}
          placeholder="Start typing your address..."
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### User Experience

| Behaviour | Description |
|-----------|-------------|
| Typing | As user types 3+ characters, address suggestions appear |
| Selection | Clicking a suggestion auto-fills street, city, and postcode |
| Manual override | User can still manually edit city/postcode after selection |
| Existing data | Form loads with existing address data, user can search for new address |

### Files Changed

| File | Change |
|------|--------|
| `src/components/dashboard/EditSubmissionDialog.tsx` | Replace Input with AddressAutocomplete |

### No Backend Changes Required

The existing `address-lookup` and `address-resolve` backend functions will be reused.


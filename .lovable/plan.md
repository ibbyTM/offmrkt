

## Address Autofill for Property Submission Form

### Overview

Add an address autocomplete feature that suggests UK addresses as the user types, then automatically populates the city and postcode fields when an address is selected. This will improve user experience and ensure accurate address data.

### Recommended Approach: Ideal Postcodes API

For UK property addresses, **Ideal Postcodes** is the best choice because:
- Specifically designed for UK addresses (Royal Mail PAF data)
- Includes full address breakdown (street, city, postcode, coordinates)
- Has a generous free tier (around 500 lookups/month for testing)
- Simple REST API that works well with backend functions

### How It Will Work

1. User starts typing in the Street Address field
2. After 3+ characters, the system searches for matching UK addresses
3. A dropdown shows up to 6 matching addresses
4. User clicks an address to select it
5. City and postcode fields are automatically populated

### Implementation

#### Step 1: Backend Function

Create a new backend function `address-lookup` that:
- Accepts a search query from the frontend
- Calls the Ideal Postcodes autocomplete API
- Returns formatted address suggestions
- Keeps the API key secure on the server side

#### Step 2: Address Autocomplete Component

Create a new `AddressAutocomplete.tsx` component with:
- Input field with debounced search (300ms delay)
- Dropdown list of suggestions (styled like other form elements)
- Loading state while searching
- Click handler to select an address and autofill fields

#### Step 3: Update Seller Form

Replace the plain Street Address input with the new autocomplete component that:
- Displays suggestions as you type
- When address selected, fills in:
  - Street address (property_address)
  - City (property_city)
  - Postcode (property_postcode)

### User Experience

```text
┌─────────────────────────────────────────────┐
│ Street Address *                            │
│ ┌─────────────────────────────────────────┐ │
│ │ 45 High St...                       ▾   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ 45 High Street, Manchester, M1 1AA      │ │
│ │ 45 High Street, Liverpool, L1 6BN       │ │
│ │ 45 High Street, Leeds, LS1 5AR          │ │
│ │ 45 High Street, Birmingham, B1 1QR      │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

After selection, city and postcode auto-populate - users can still manually edit if needed.

---

### Technical Details

#### Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/address-lookup/index.ts` | Backend function for API calls |
| `src/components/seller/AddressAutocomplete.tsx` | Autocomplete input component |

#### Files to Modify

| File | Change |
|------|--------|
| `src/components/seller/SellerForm.tsx` | Replace address input with autocomplete |

#### API Key Setup

You'll need an Ideal Postcodes API key. After I implement the code:
1. Sign up at [ideal-postcodes.co.uk](https://ideal-postcodes.co.uk)
2. Create an API key
3. I'll prompt you to add it as a secret called `IDEAL_POSTCODES_API_KEY`

#### Backend Function Structure

```typescript
// Accepts: { query: "45 High Street" }
// Returns: Array of { address, city, postcode, line_1, line_2 }
```

#### Fallback Behavior

If the API fails or user prefers manual entry:
- Manual typing still works in all fields
- Users can ignore suggestions and type freely
- No blocking of form submission if autofill isn't used

### Cost Consideration

Ideal Postcodes pricing:
- **Free**: Around 500 lookups/month for testing
- **Paid**: Starts at around £10 for 1,000 lookups

Alternatively, if you'd prefer a completely free solution, I can implement **postcode-only lookup** using the free postcodes.io API (limited functionality - only fills city from postcode, not full address autocomplete).


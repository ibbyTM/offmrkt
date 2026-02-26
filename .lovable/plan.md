

## Replace Ideal Postcodes with Geoapify Autocomplete

### Overview
Replace the current Ideal Postcodes address lookup with Geoapify's Autocomplete API. Geoapify returns structured address data directly in the autocomplete response, so we can simplify from two edge functions down to one.

### Steps

**1. Store the Geoapify API key as a secret**
- Use the secrets tool to ask you to input your Geoapify API key (from the screenshot you shared earlier).

**2. Update the `address-lookup` edge function**
- Replace the Ideal Postcodes API call with Geoapify's Geocoding Autocomplete endpoint: `https://api.geoapify.com/v1/geocode/autocomplete`
- Use the `GEOAPIFY_API_KEY` secret instead of `IDEAL_POSTCODES_API_KEY`
- Filter results to UK addresses using `&filter=countrycode:gb`
- Map Geoapify's response (which includes structured `properties` with `street`, `city`, `postcode`, `county`, `country`) into the suggestions format
- Since Geoapify returns full address details in the autocomplete response, include the structured address data directly in each suggestion

**3. Remove the `address-resolve` edge function**
- Geoapify provides full structured address data in the autocomplete response, so the separate resolve step is no longer needed
- Delete `supabase/functions/address-resolve/index.ts`

**4. Update the `AddressAutocomplete` component**
- Update the `AddressSuggestion` interface to include structured address fields (street, city, postcode, county, country) instead of `udprn`
- Simplify `handleSelect` to use the structured data directly from the suggestion, removing the second API call to `address-resolve`
- The component's public interface (`AddressAutocompleteProps`) stays the same, so no changes needed in `SellerForm`, `EditSubmissionDialog`, or any other consumers

### Technical Details

**Geoapify Autocomplete endpoint:**
```
GET https://api.geoapify.com/v1/geocode/autocomplete
  ?text={query}
  &filter=countrycode:gb
  &limit=6
  &apiKey={GEOAPIFY_API_KEY}
```

**Response mapping** (from Geoapify `feature.properties`):
- `street` and `housenumber` -> street address
- `city` -> city
- `postcode` -> postcode
- `county` -> county
- `country` -> country
- `formatted` -> display address in dropdown


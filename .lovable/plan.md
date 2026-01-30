
## Hide Door Numbers from Property Displays

Remove street-level address details (door numbers) from public-facing property displays while maintaining full address data in the database for admin/operational purposes.

---

### Summary

Currently, several pages display the full `property_address` field (e.g., "123 Example Street") alongside city and postcode. To protect property privacy and maintain a professional marketplace feel, we'll replace these with city and postcode only, matching the pattern already used in property cards.

---

### Files to Update

| File | Current Display | New Display |
|------|-----------------|-------------|
| `src/components/property-detail/PropertyHeader.tsx` | `{property.property_address}, {property.property_city} {property.property_postcode}` | `{property.property_city} {property.property_postcode}` |
| `src/pages/Mortgage.tsx` | `{property.property_address}, {property.property_city} {property.property_postcode}` | `{property.property_city} {property.property_postcode}` |
| `src/pages/Dashboard.tsx` | `{reservation.property.property_address}, {reservation.property.property_city}` | `{reservation.property.property_city} {reservation.property.property_postcode}` |

---

### Files NOT Changed

| File | Reason |
|------|--------|
| `MortgageEnquiryDialog.tsx` | Address is sent to backend for mortgage broker - they need full details |
| `AdminPropertyToolbar.tsx` | Admin-only AI enhancement feature - needs full address |
| `Properties.tsx` | Only used for search functionality, not display |
| `SubmissionDetailDialog.tsx` | Admin-facing submission review |
| `SubmissionsTable.tsx` | Admin-facing submission list |
| `MyListingsTab.tsx` | Shows seller's own submissions - they know the address |

---

### Implementation Details

**1. PropertyHeader.tsx (Property Detail Page)**

Change from:
```tsx
<span>
  {property.property_address}, {property.property_city} {property.property_postcode}
</span>
```

To:
```tsx
<span>
  {property.property_city} {property.property_postcode}
</span>
```

**2. Mortgage.tsx (Mortgage Calculator Page)**

Change from:
```tsx
<p className="text-muted-foreground text-sm">
  {property.property_address}, {property.property_city} {property.property_postcode}
</p>
```

To:
```tsx
<p className="text-muted-foreground text-sm">
  {property.property_city} {property.property_postcode}
</p>
```

**3. Dashboard.tsx (User Reservations)**

Change from:
```tsx
<p className="text-sm text-muted-foreground">
  {reservation.property.property_address}, {reservation.property.property_city}
</p>
```

To:
```tsx
<p className="text-sm text-muted-foreground">
  {reservation.property.property_city} {reservation.property.property_postcode}
</p>
```

---

### Result

After implementation:
- Property detail pages will show "Birmingham B1 1AA" instead of "123 Example Street, Birmingham B1 1AA"
- Mortgage page property info will be privacy-focused
- User dashboard reservations will show location without street details
- Admin areas retain full address access
- Backend operations continue to store and use full address data



## Add Multi-Unit Property Submission Feature

### Overview

You have 8 properties at the same address (units 1-8 Mayfair Court) that you want to submit together. Currently, the system only supports single property submissions. This feature will allow you to submit a block of units in one go, where they share the same base address but each unit gets its own listing.

### How It Will Work

```text
┌─────────────────────────────────────────────────────────────────┐
│  Property Details                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ☐ This is a multi-unit property (block of flats, HMO, etc.)   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ When checked, reveals:                                    │  │
│  │                                                           │  │
│  │  Building/Block Name: [ Mayfair Court              ]     │  │
│  │                                                           │  │
│  │  Unit Range:                                              │  │
│  │  From: [ 1 ]    To: [ 8 ]                                │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  Preview: 8 units will be created                         │  │
│  │  • Unit 1, Mayfair Court, Belfast, BT14 8AA              │  │
│  │  • Unit 2, Mayfair Court, Belfast, BT14 8AA              │  │
│  │  • Unit 3, Mayfair Court, Belfast, BT14 8AA              │  │
│  │  • ... and 5 more                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  City: [ Belfast       ]    Postcode: [ BT14 8AA  ]            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### User Experience

| Step | What You Do | What Happens |
|------|-------------|--------------|
| 1 | Tick "This is a multi-unit property" | New fields appear for building name and unit range |
| 2 | Type building name (e.g., "Mayfair Court") | Address field updates to show the building |
| 3 | Enter unit range (1 to 8) | Preview shows all 8 unit addresses that will be created |
| 4 | Fill in shared details (price per unit, property type, etc.) | All units will share these common attributes |
| 5 | Submit | System creates 8 separate submissions, one for each unit |

### What Gets Shared Across Units

All units will share:
- Property type, city, and postcode
- Asking price (per unit)
- Bedrooms/bathrooms per unit
- Compliance documents status
- Photos (if applicable to all units)
- Contact information
- Selling reason and timeline

Each unit gets a unique:
- Unit-specific address (e.g., "Unit 1, Mayfair Court")
- Individual submission record for separate tracking

---

### Technical Details

#### Database Changes

Add new columns to `seller_submissions` table:

```sql
ALTER TABLE seller_submissions
ADD COLUMN is_multi_unit BOOLEAN DEFAULT FALSE,
ADD COLUMN building_name TEXT,
ADD COLUMN unit_number TEXT,
ADD COLUMN parent_submission_id UUID REFERENCES seller_submissions(id);
```

| Column | Purpose |
|--------|---------|
| `is_multi_unit` | Flag to identify multi-unit submissions |
| `building_name` | The block name (e.g., "Mayfair Court") |
| `unit_number` | Individual unit identifier (e.g., "1", "2", "Flat A") |
| `parent_submission_id` | Links child units to the first submission for grouping |

#### Form Schema Updates

**File: `src/components/seller/sellerFormSchema.ts`**

Add new fields to the Zod schema:

```typescript
is_multi_unit: z.boolean().default(false),
building_name: z.string().optional(),
unit_from: z.coerce.number().min(1).optional(),
unit_to: z.coerce.number().min(1).optional(),
```

#### Form UI Updates

**File: `src/components/seller/SellerForm.tsx`**

1. Add a checkbox toggle for multi-unit mode
2. Conditionally show building name and unit range fields
3. Display a preview of units to be created
4. Modify `onSubmit` to loop and create multiple submissions

```typescript
// Submission logic for multi-unit
if (data.is_multi_unit && data.unit_from && data.unit_to) {
  const submissions = [];
  for (let i = data.unit_from; i <= data.unit_to; i++) {
    submissions.push({
      ...baseSubmission,
      property_address: `Unit ${i}, ${data.building_name}`,
      unit_number: String(i),
      is_multi_unit: true,
      building_name: data.building_name,
    });
  }
  const { error } = await supabase.from("seller_submissions").insert(submissions);
}
```

#### Admin Dashboard Enhancement

The admin submissions table will show a "Multi-unit" badge for grouped submissions, with the ability to expand and see all units in the block.

### Files to Create/Modify

| File | Change |
|------|--------|
| `supabase/migrations/[timestamp]_add_multi_unit_support.sql` | Add new columns to seller_submissions |
| `src/components/seller/sellerFormSchema.ts` | Add multi-unit fields to Zod schema |
| `src/components/seller/SellerForm.tsx` | Add multi-unit toggle, unit range inputs, preview, and batch insert logic |
| `src/components/admin/SubmissionsTable.tsx` | Show multi-unit badge and grouping |

### Rate Limit Consideration

The existing rate limit (5 properties per day) will count each unit separately. For your 8-unit block, you would need an adjusted limit or admin bypass. We can add a `daily_submission_count` that treats a multi-unit submission as 1 "batch" for rate limiting purposes.


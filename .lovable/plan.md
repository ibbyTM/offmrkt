

## Improve Multi-Unit Property Input

### The Problem

Currently, the multi-unit submission requires filling in too many separate fields:
1. Street Address field (gets ignored for multi-unit)
2. Tick "This is a multi-unit property"
3. Building/Block Name (e.g., "Mayfair Court")
4. From Unit (e.g., 1)
5. To Unit (e.g., 8)
6. City (e.g., Hull)
7. Postcode

This is confusing because you just want to enter "1-8 Mayfair Court, Hull" naturally.

### The Solution

Restructure the form so when multi-unit is ticked:
- **Replace** the street address field with a more intuitive layout
- Show **Building Name**, **Unit Range**, **City**, and **Postcode** in a cleaner arrangement
- Hide the street address autocomplete (since it doesn't apply to blocks)

```text
┌─────────────────────────────────────────────────────────────────┐
│  Property Details                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ☑ This is a multi-unit property (block of flats, HMO, etc.)   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  Units: [ 1 ] to [ 8 ]   Building: [ Mayfair Court    ]  │  │
│  │                                                           │  │
│  │  City: [ Hull          ]   Postcode: [ HU1 2AA       ]   │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────   │  │
│  │  Preview: 8 units will be created                         │  │
│  │  • Unit 1, Mayfair Court, Hull, HU1 2AA                  │  │
│  │  • Unit 2, Mayfair Court, Hull, HU1 2AA                  │  │
│  │  • Unit 3, Mayfair Court, Hull, HU1 2AA                  │  │
│  │  • ... and 5 more                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### User Experience

| What You Want | What You Enter |
|---------------|----------------|
| 1-8 Mayfair Court, Hull | Tick multi-unit → Units 1-8 → Building "Mayfair Court" → City "Hull" → Postcode |

The form now logically groups everything together and hides the irrelevant street address field when multi-unit is selected.

---

### Technical Details

#### File Changes

**File: `src/components/seller/MultiUnitSection.tsx`**

Restructure the component to include City and Postcode fields when multi-unit is checked, making it a self-contained section:

```tsx
{isMultiUnit && (
  <div className="space-y-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
    {/* Unit range on same line */}
    <div className="grid grid-cols-4 gap-4">
      <FormField name="unit_from" ... />
      <span className="self-end pb-2 text-center">to</span>
      <FormField name="unit_to" ... />
      <FormField name="building_name" ... /> {/* Takes 2 cols */}
    </div>
    
    {/* City and Postcode */}
    <div className="grid grid-cols-2 gap-4">
      <FormField name="property_city" ... />
      <FormField name="property_postcode" ... />
    </div>
    
    {/* Preview */}
    ...
  </div>
)}
```

**File: `src/components/seller/SellerForm.tsx`**

Conditionally hide the address/city/postcode fields when multi-unit is selected (since `MultiUnitSection` will handle them):

```tsx
{/* Only show address autocomplete for single properties */}
{!form.watch("is_multi_unit") && (
  <>
    <FormField name="property_address" ... />
    <div className="grid grid-cols-2 gap-4">
      <FormField name="property_city" ... />
      <FormField name="property_postcode" ... />
    </div>
  </>
)}

{/* Multi-Unit Section - handles its own address fields */}
<MultiUnitSection />
```

**File: `src/components/seller/sellerFormSchema.ts`**

Update validation to make `property_address` optional when `is_multi_unit` is true:

```typescript
.refine((data) => {
  if (!data.is_multi_unit) {
    return data.property_address && data.property_address.length > 0;
  }
  return true;
}, {
  message: "Street address is required for single properties",
  path: ["property_address"],
})
```

### Files to Modify

| File | Change |
|------|--------|
| `src/components/seller/MultiUnitSection.tsx` | Add City/Postcode fields inside the component, improve layout with unit range inline |
| `src/components/seller/SellerForm.tsx` | Conditionally hide address fields when multi-unit is checked |
| `src/components/seller/sellerFormSchema.ts` | Make property_address optional for multi-unit |

### Result

When you tick "multi-unit", the form transforms to show:
- **Unit range** (1 to 8) on one line with building name
- **City** and **Postcode** below
- **Live preview** of all units being created

The confusing street address field disappears, and everything you need is in one logical group.


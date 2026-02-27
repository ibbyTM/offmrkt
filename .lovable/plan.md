

## Add Estimated Refurb Costs to Submit Property Form

### Overview
Add an "Estimated Refurb Costs" field to the seller submission form so sellers can indicate expected renovation costs when submitting a property.

### Steps

**1. Add `estimated_refurb_cost` column to `seller_submissions` table**
- Run a migration to add an optional integer column `estimated_refurb_cost` to the `seller_submissions` table.

**2. Update the form schema**
- Add `estimated_refurb_cost` as an optional coerced number field in `src/components/seller/sellerFormSchema.ts`.

**3. Update the SellerForm UI**
- Add a new input field for "Estimated Refurb Cost" in `src/components/seller/SellerForm.tsx`, placed in the financial/property details section near the asking price field. It will be a GBP-prefixed number input, similar to the existing price fields.

**4. Wire up submission**
- Ensure the new field value is included when the form data is submitted to the `seller_submissions` table.

### Technical Details

- **Migration SQL**: `ALTER TABLE public.seller_submissions ADD COLUMN estimated_refurb_cost integer;`
- **Schema addition**: `estimated_refurb_cost: z.coerce.number().min(0).optional()`
- The field will be optional so sellers can skip it if unsure.


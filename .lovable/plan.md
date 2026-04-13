

## Make Phone Numbers Required Across All Forms

Phone is currently optional in 3 places. The seller form already requires it. Here's what needs to change:

### Changes

**1. `src/components/landing/FloatingLeadCapture.tsx`**
- Change `phone: z.string().optional()` to `phone: z.string().min(10, "Phone number is required")`
- Update placeholder from `"Phone Number (optional)"` to `"Phone Number"`

**2. `src/components/mortgage/MortgageEnquiryDialog.tsx`**
- Change `phone: z.string().max(20).optional()` to `phone: z.string().min(10, "Phone number is required").max(20)`
- Update any placeholder text if it says "optional"

**3. `src/components/funnels/FunnelLeadForm.tsx`**
- Change `required: false` to `required: true` for the phone field
- Update the phone case in the schema builder to add `.min(10, 'Please enter a valid phone number')` when required

No database changes needed -- the `phone` columns already accept text values.




## Add Floor Plan Upload to Property Submission

### Overview
Allow sellers to upload floor plan images/PDFs alongside their property photos. The existing form has a "has floor plans" checkbox but no actual upload capability.

### Changes

**1. Database Migration**
- Add `floor_plan_urls text[] DEFAULT '{}'` column to `seller_submissions` table
- Update the `sync_submission_to_property` trigger function to sync `floor_plan_urls` from submissions to properties

**2. Seller Form (SellerForm.tsx)**
- Add `floorPlans` state (similar to `photos` state) persisted in the localStorage draft
- In Step 4 (Photos), add a second `PhotoUpload` component below the existing one for floor plans, with its own label ("Floor Plans") and a lower max (e.g. 10)
- Auto-set `has_floor_plans` to true when floor plan files are uploaded
- Include `floor_plan_urls` in the submission payload sent to the database

**3. PhotoUpload Component**
- Add optional props for customizing the label text, accepted file types, and input ID so it can be reused for floor plans without conflicting with the photo uploader
- Allow PDF files in addition to images when used for floor plans
- Upload floor plans to a `floor-plans/` subfolder in the existing `property-photos` bucket

**4. Edit Submission Dialog (EditSubmissionDialog.tsx)**
- Not changed in this pass (floor plans are uploaded during initial submission; editing floor plans can be added later if needed)

**5. Draft Persistence**
- Add `floorPlans` array to the `SavedDraft` interface so floor plan uploads survive page refreshes

### Technical Details

| Area | Detail |
|------|--------|
| New DB column | `floor_plan_urls text[] DEFAULT '{}'::text[]` on `seller_submissions` |
| Trigger update | `sync_submission_to_property` maps `NEW.floor_plan_urls` to `floor_plan_urls` on `properties` |
| Storage | Reuse `property-photos` bucket with `floor-plans/` prefix |
| Component reuse | `PhotoUpload` gets optional `label`, `inputId`, `accept`, and `storagePath` props |
| File types | Images + PDF for floor plans |
| Max uploads | 10 floor plans per submission |


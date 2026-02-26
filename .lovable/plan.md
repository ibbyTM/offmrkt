

## Add Photo and Floor Plan Editing to Edit Submission Dialog

### Overview
Add the ability to add/remove property photos and floor plans when editing an existing submission, using the existing `PhotoUpload` component.

### Changes

**File: `src/components/dashboard/EditSubmissionDialog.tsx`**

1. Import the `PhotoUpload` component and add `useState` import
2. Add two state variables: `photos` (string[]) and `floorPlans` (string[]), initialized from the submission's existing `photo_urls` and `floor_plan_urls` in the `useEffect`
3. Add two `PhotoUpload` sections to the form (below the description field, before the action buttons):
   - **Property Photos** -- reuses `PhotoUpload` with default settings (max 10, images only, `storagePath="submissions"`)
   - **Floor Plans** -- reuses `PhotoUpload` with `accept="image/*,.pdf"`, `storagePath="floor-plans"`, `inputId="edit-floor-plan-input"`, `label="floor plans"`
4. Include `photo_urls` and `floor_plan_urls` in the update payload sent on save, and auto-set `has_floor_plans` based on whether any floor plans exist

No database or backend changes needed -- `photo_urls` and `floor_plan_urls` columns already exist on `seller_submissions`, and the `updateSubmission` mutation already accepts any `TablesUpdate` fields.

### Technical Details

| Area | Detail |
|------|--------|
| Component reused | `PhotoUpload` with its existing `label`, `inputId`, `accept`, `storagePath` props |
| State management | Two `useState<string[]>` hooks, synced from submission via `useEffect` |
| Storage | Same buckets/paths as the initial submission form (`submissions/` and `floor-plans/`) |
| Files changed | 1 file: `EditSubmissionDialog.tsx` |


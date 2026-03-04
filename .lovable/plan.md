

## Add Inline Text Editing to Ad Creatives

Currently all ad text (headline, subheadline, CTA, badge, bullet points, stats) is static from the config. The user wants to click on any creative, edit its text fields, and download the customised version.

### Approach

**`src/components/admin/AdCreativeCard.tsx`**
- Add local state to hold editable overrides: `headline`, `subheadline`, `cta`, `badge`, `bulletPoints`, `stats` — initialized from `config`
- Add an "Edit" button next to the Download button that opens a dialog/panel
- Create an `AdEditDialog` (using the existing Dialog component) with form fields:
  - Headline (textarea)
  - Subheadline (textarea)
  - CTA text (input)
  - Badge text (input, optional)
  - Bullet points (dynamic list of inputs, add/remove)
  - Stats (dynamic list of value+label pairs, add/remove)
- On save, update local state — the preview re-renders immediately with new text
- The PNG export uses the edited state, so downloads reflect customisations
- Add a "Reset" button to revert to original config values

**`src/pages/AdCreatives.tsx`**
- Lift the creatives array into component state so each card's edits persist during the session
- Pass an `onUpdate` callback to each `AdCreativeCard` so edits propagate to the parent state

### UI Flow
1. User sees all creatives as before
2. Clicks "Edit" (pencil icon) on any card
3. Dialog opens with all text fields pre-filled
4. User modifies text, clicks "Save"
5. Preview updates live, download exports the edited version
6. "Reset" reverts to template defaults

### Files changed
- `src/components/admin/AdCreativeCard.tsx` — add edit dialog, local editable state, edit/reset buttons
- `src/pages/AdCreatives.tsx` — use stateful creatives array with update callback




## Add Style Switcher to Ad Creative Edit Dialog

### What
Add a "Style" selector to the existing edit dialog so you can switch between the 6 colour variants (`navy`, `teal`, `white`, `gradient`, `dark`, `split`) and 7 decoration styles (`none`, `circles`, `lines`, `dots`, `geometric`, `waves`, `grid`) — the creative preview updates live.

### Changes

**`src/components/admin/AdEditDialog.tsx`**
- Add `variant` and `decorStyle` to local state (initialised from `config`)
- Add a "Colour Theme" section with 6 clickable swatches/chips (navy, teal, white, gradient, dark, split) — highlight the active one
- Add a "Decoration" section with 7 chips (none, circles, lines, dots, geometric, waves, grid)
- Include both fields in `handleSave` and `handleReset`

**`src/components/admin/AdCreativeCard.tsx`** — no changes needed, already renders based on `config.variant` and `config.decorStyle`

### UI Design
- Colour chips: small rounded pills with the actual background colour as a swatch + label, bordered when selected
- Decoration chips: text-only toggle group, one active at a time
- Both sections sit between the Badge input and Bullet Points section


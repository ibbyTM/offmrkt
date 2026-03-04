

## Update Logos and Ensure White Backgrounds

You've uploaded two new logo files -- an icon-only version (house icon) and a full wordmark version (icon + "OFF THE MARKETS" text). Since both have white/transparent backgrounds, every placement needs an explicit white background to look clean regardless of the page's theme or surrounding color.

### Plan

**1. Copy new logo files into the project**
- Copy the icon-only logo to `src/assets/offthemarkets-icon.png` (for favicon, sidebar collapsed state, small placements)
- Copy the full wordmark logo to `src/assets/offthemarkets-logo.png` (replaces existing logo for header, footer, funnels)
- Copy the icon to `public/favicon.png` for the browser tab

**2. Update logo placements with white background containers**

All 4 files that use the logo need a white background wrapper:

- **Header** (`src/components/layout/Header.tsx`, line 121): Wrap logo `<img>` in a `bg-white rounded-lg p-1` container
- **Footer** (`src/components/layout/Footer.tsx`, line 35): Same white background treatment
- **App Sidebar** (`src/components/layout/AppSidebar.tsx`, line 67): Add `bg-white rounded-lg p-1` wrapper
- **Funnel Layout** (`src/components/funnels/FunnelLayout.tsx`, line 72-77): Same treatment

**3. Update email templates**

The 6 email templates reference a logo hosted in storage. Upload the new wordmark logo to the same storage path so emails stay on-brand. The email body backgrounds are already white, so no changes needed there.

**4. Update favicon**

Update `index.html` to reference the new icon as favicon.

### Summary of changes
- 2 new asset files copied into project
- 4 component files updated with white background wrappers around logos
- 1 favicon update in `index.html`
- Email template logo will need the storage asset updated separately


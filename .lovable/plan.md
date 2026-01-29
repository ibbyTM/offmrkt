
## Update Branding: New Logo + Favicon

Replace the current "Off The Markets" logo with your new design featuring the M-as-roof icon, and update the favicon to use the icon-only version.

---

### Overview

Your new logo assets will be used across the entire application:
- **Full wordmark** (`Untitled_design_4.png`) → Headers, footers, sidebar
- **Icon only** (`OTM_favicon.PNG`) → Browser favicon

For mobile/header use, I'll display just the icon + "Off The Markets" text (without the "UK Property Investment" tagline) as you requested.

---

### Files to Update

| File | Change |
|------|--------|
| `public/favicon.png` | Copy `OTM_favicon.PNG` as favicon |
| `src/assets/offthemarkets-logo.png` | Replace with `Untitled_design_4.png` |
| `index.html` | Update favicon reference to `/favicon.png` |
| `src/components/layout/Header.tsx` | Adjust logo sizing for new design |
| `src/components/layout/Footer.tsx` | Adjust logo sizing |
| `src/components/layout/AppSidebar.tsx` | Adjust logo sizing |
| `src/components/funnels/FunnelLayout.tsx` | Adjust logo sizing, remove `dark:invert` |

---

### Implementation Details

**1. Copy Asset Files**
- Copy `user-uploads://OTM_favicon.PNG` → `public/favicon.png`
- Copy `user-uploads://Untitled_design_4.png` → `src/assets/offthemarkets-logo.png`

**2. Update Favicon Reference**

```html
<!-- index.html -->
<link rel="icon" type="image/png" href="/favicon.png">
```

**3. Adjust Logo Display**

Since your new logo has the icon integrated, I'll ensure proper sizing:

- **Header**: `h-10` (40px height) for clean desktop display
- **Footer**: `h-12` (48px) for prominent branding
- **Sidebar**: `h-8` (32px) for compact sidebar header
- **Funnel Layout**: `h-8` (32px) for minimal funnel header

**4. Remove Dark Mode Invert**

Your new logo uses navy/teal colors which work on both light and dark backgrounds, so the `dark:invert` class in FunnelLayout will be removed.

---

### Visual Result

After implementation:
- Browser tab shows your M-as-roof icon
- All headers display the full wordmark with icon
- Consistent branding across public pages, dashboard, and funnels

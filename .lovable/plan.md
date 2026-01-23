

## Update Submit Property Page to Match App Layout

### Overview
Update the Submit Property page to use the unified `AppLayout` component with the sidebar navigation, matching the look and feel of Dashboard, Properties, Admin, and Compare pages.

### Current vs. New Design

```text
Current (Old Layout)                New (AppLayout)
┌─────────────────────────────┐    ┌──────┬────────────────────────┐
│  Global Header              │    │      │ Page Header (title +   │
├─────────────────────────────┤    │ Side │ icon + subtitle)       │
│  Page Banner                │    │ bar  ├────────────────────────┤
│  (bg-secondary + icon)      │    │      │                        │
├─────────────────────────────┤    │ Nav  │  Multi-step Form       │
│                             │    │      │  (same content)        │
│  Container + SellerForm     │    │      │                        │
│                             │    │      │                        │
├─────────────────────────────┤    └──────┴────────────────────────┘
│  Footer                     │           └─ Mobile: Bottom Nav
└─────────────────────────────┘
```

### Key Changes

| Aspect | Before | After |
|--------|--------|-------|
| **Wrapper** | `Layout` component | `AppLayout` component |
| **Header** | Custom banner with large icon | Standard `pageTitle` + `pageIcon` props |
| **Navigation** | None (only global header) | Sidebar with Dashboard, Properties, etc. |
| **Mobile** | Standard header | Bottom navigation bar |
| **Styling** | Container-based centering | `p-6` padding within SidebarInset |

### File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/pages/SubmitProperty.tsx` | **Modify** | Replace `Layout` with `AppLayout`, update structure |

### Implementation Details

The updated page will:

1. **Use AppLayout wrapper** with:
   - `pageTitle="Submit Your Property"`
   - `pageSubtitle="Connect with verified investors ready to buy"`
   - `pageIcon={<Building2 />}`

2. **Simplify structure** - Remove the custom header banner and let AppLayout handle it

3. **Keep SellerForm unchanged** - The multi-step form works perfectly, just needs different container styling

### Updated Code Structure

```tsx
// src/pages/SubmitProperty.tsx
import { AppLayout } from "@/components/layout/AppLayout";
import { SellerForm } from "@/components/seller/SellerForm";
import { Building2 } from "lucide-react";

const SubmitProperty = () => {
  return (
    <AppLayout
      pageTitle="Submit Your Property"
      pageSubtitle="Connect with verified investors ready to buy"
      pageIcon={<Building2 className="h-5 w-5 text-primary" />}
    >
      <div className="p-6">
        <SellerForm />
      </div>
    </AppLayout>
  );
};

export default SubmitProperty;
```

### Benefits

| Benefit | Description |
|---------|-------------|
| **Consistent Navigation** | Users can navigate to Dashboard, Properties, etc. from sidebar |
| **Mobile Experience** | Bottom nav available on smaller screens |
| **Unified Header** | Same header pattern as all other app pages |
| **Brand Cohesion** | Logo visible in sidebar, consistent with other pages |
| **Reduced Code** | Simpler page component, ~10 lines vs ~30 lines |

### Visual Result

The Submit Property page will now feel like part of the app experience rather than a standalone marketing page, with:
- Collapsible sidebar with navigation
- Consistent header with icon + title
- Mobile bottom navigation
- Same padding and spacing as Dashboard/Properties


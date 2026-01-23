

## Add Visual Separator Between Navigation and Filters

### Overview
Add a subtle horizontal divider between the fixed navigation/admin section and the scrollable filters section in the sidebar. This visually separates the primary navigation from page-specific content.

### Visual Result

```text
┌──────────────────────────┐
│ Logo + Trigger           │
├──────────────────────────┤
│ Navigation               │
│ - Dashboard              │
│ - Properties             │
│ - Submit Property        │
├──────────────────────────┤
│ Admin                    │
│ - Admin Panel            │
├──────────────────────────┤  ← New separator here
│ Filters                  │
│ - Search                 │
│ - Location               │
│ - Budget Range           │
└──────────────────────────┘
```

### Implementation

**File:** `src/components/layout/AppSidebar.tsx`

1. Import the `Separator` component
2. Add a separator before the filters section (only when filters exist)

```tsx
import { Separator } from "@/components/ui/separator";

// ... inside SidebarContent, before the children wrapper:

{/* Page-specific content (filters, sections, etc.) - Scrollable */}
{children && (
  <>
    <Separator className="mx-2 my-2" />
    <div className="flex-1 overflow-y-auto min-h-0">
      {children}
    </div>
  </>
)}
```

### Styling

| Class | Purpose |
|-------|---------|
| `mx-2` | Horizontal margin to inset from sidebar edges |
| `my-2` | Vertical spacing above and below the line |

The separator uses the existing `bg-border` color from the design system, maintaining visual consistency with the header and footer borders.


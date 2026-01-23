

## Fix Sidebar Navigation Hidden by Filters

### The Problem

On the `/properties` page, the filters are passed as `children` to `AppSidebar`, which renders them inside `SidebarContent`. Since `SidebarContent` has `overflow-auto`, the entire content (Navigation + Admin + Filters) scrolls as one unit. When filters are long, the navigation gets scrolled out of view.

```text
Current Sidebar (scrolls as one unit)
┌──────────────────────────┐
│ Logo + Trigger           │ ← Fixed (SidebarHeader)
├──────────────────────────┤
│ Navigation               │ ↑
│ - Dashboard              │ │ Scrolls together
│ - Properties             │ │
│ - Submit Property        │ │
│ - Compare                │ │
├──────────────────────────┤ │
│ Admin                    │ │
│ - Admin Panel            │ │
├──────────────────────────┤ │
│ Filters                  │ │
│ - Search                 │ │
│ - Location               │ │
│ - Budget Range           │ │ ← Long content pushes
│ - Bedrooms               │ │   nav out of view
│ - Property Type          │ │
│ - Strategy               │ ↓
├──────────────────────────┤
│ Settings + Help          │ ← Fixed (SidebarFooter)
└──────────────────────────┘
```

### Solution: Split Into Fixed Nav + Scrollable Filters

We'll restructure the sidebar so navigation stays pinned at the top, while filters scroll independently in their own section.

```text
New Sidebar Layout
┌──────────────────────────┐
│ Logo + Trigger           │ ← Fixed (SidebarHeader)
├──────────────────────────┤
│ Navigation (fixed)       │ ← Always visible
│ - Dashboard              │
│ - Properties             │
│ - Submit Property        │
│ - Compare                │
├──────────────────────────┤
│ Admin (fixed)            │ ← Always visible
│ - Admin Panel            │
├──────────────────────────┤
│ Filters (scrollable)     │ ↑
│ - Search                 │ │ Scrolls independently
│ - Location               │ │ (overflow-y-auto)
│ - Budget Range           │ │
│ - Bedrooms               │ │
│ - Property Type          │ │
│ - Strategy               │ ↓
├──────────────────────────┤
│ Settings + Help          │ ← Fixed (SidebarFooter)
└──────────────────────────┘
```

### Implementation

**File to modify:** `src/components/layout/AppSidebar.tsx`

The fix involves:
1. Move Navigation and Admin groups to use `flex-shrink-0` so they never collapse
2. Wrap page-specific children (filters) in a scrollable container with `overflow-y-auto` and `flex-1`

```tsx
// AppSidebar.tsx - Updated structure
<SidebarContent className="flex flex-col">
  {/* Navigation - Fixed, never scrolls away */}
  <SidebarGroup className="flex-shrink-0">
    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
    <SidebarMenu>
      {/* nav items */}
    </SidebarMenu>
  </SidebarGroup>

  {/* Admin - Fixed, never scrolls away */}
  {isAdmin && (
    <SidebarGroup className="flex-shrink-0">
      {/* admin items */}
    </SidebarGroup>
  )}

  {/* Page-specific content - Scrollable */}
  {children && (
    <div className="flex-1 overflow-y-auto min-h-0">
      {children}
    </div>
  )}
</SidebarContent>
```

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `flex-shrink-0` | Prevents nav/admin from shrinking when space is limited |
| `flex-1` | Allows filters section to take remaining space |
| `overflow-y-auto` | Makes filters scroll independently |
| `min-h-0` | Required for flex child to enable scrolling |

### Result

| Before | After |
|--------|-------|
| All sidebar content scrolls together | Navigation always visible at top |
| Filters push nav out of view | Filters scroll in their own area |
| Hard to navigate when filtering | Easy navigation while filtering |

### Visual Outcome

When you scroll the filters:
- **Logo** stays fixed (in SidebarHeader)
- **Navigation** stays fixed (Dashboard, Properties, etc.)
- **Admin** stays fixed (if user is admin)
- **Filters** scroll independently
- **Settings/Help** stays fixed (in SidebarFooter)


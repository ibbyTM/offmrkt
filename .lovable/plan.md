

## Remove Duplicate Sidebar Collapse Button

Fix the duplicate sidebar trigger buttons by removing the one inside the sidebar header, keeping only the page header trigger.

---

### Problem

Currently, there are two collapse buttons visible:
1. One inside the sidebar header (next to the logo)
2. One in the page header (next to the page title)

This creates confusion and clutter.

---

### Solution

Remove the `SidebarTrigger` from `AppSidebar.tsx` and keep only the one in `AppLayout.tsx`.

---

### File Change

**`src/components/layout/AppSidebar.tsx`**

Remove the `SidebarTrigger` from lines 72 and the import on line 19.

Before:
```tsx
<SidebarHeader className="border-b border-sidebar-border">
  <div className="flex items-center justify-between p-2">
    {!isCollapsed && (
      <Link to="/">
        <img src={logo} alt="OffMrkt" className="h-10" />
      </Link>
    )}
    <SidebarTrigger />  // ← Remove this
  </div>
</SidebarHeader>
```

After:
```tsx
<SidebarHeader className="border-b border-sidebar-border">
  <div className="flex items-center justify-center p-2">
    <Link to="/">
      <img src={logo} alt="OffMrkt" className="h-10" />
    </Link>
  </div>
</SidebarHeader>
```

Also:
- Remove `SidebarTrigger` from the imports
- Remove `isCollapsed` check since logo will always show
- Change `justify-between` to `justify-center` for better centering

---

### Result

Only one collapse/expand button will be visible in the page header, which stays accessible even when the sidebar is collapsed.


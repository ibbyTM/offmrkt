

## Add Mobile Bottom Navigation Bar

### Overview
Create a fixed bottom navigation bar that appears on mobile devices (below 768px) when the sidebar is hidden. This provides easy thumb-accessible navigation for authenticated app pages using `AppLayout`.

### Design

```text
Desktop (>768px)                    Mobile (<768px)
┌──────┬────────────────────┐      ┌────────────────────────┐
│      │                    │      │  Page Header           │
│ Side │   Page Content     │      ├────────────────────────┤
│ bar  │                    │      │                        │
│      │                    │      │   Page Content         │
│      │                    │      │                        │
│      │                    │      ├────────────────────────┤
│      │                    │      │ [Home][Props][+][More] │
└──────┴────────────────────┘      └────────────────────────┘
```

### Bottom Navigation Items

| Item | Icon | Route | Description |
|------|------|-------|-------------|
| Dashboard | `LayoutDashboard` | `/dashboard` | Main dashboard |
| Properties | `Building2` | `/properties` | Property listings |
| Submit | `Plus` | `/submit-property` | Add new property |
| More | `Menu` | Opens sheet | Settings, Help, Admin (if applicable), Compare (if has selections) |

### File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/layout/MobileBottomNav.tsx` | **Create** | New bottom navigation component |
| `src/components/layout/AppLayout.tsx` | **Modify** | Add MobileBottomNav + padding for content |

---

## Technical Details

### 1. MobileBottomNav Component

```tsx
// src/components/layout/MobileBottomNav.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, Building2, Plus, Menu, 
  Settings, HelpCircle, Shield, Scale, X 
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useComparison } from "@/contexts/ComparisonContext";
import { useIsAdmin } from "@/hooks/useAdminApplications";
import { cn } from "@/lib/utils";

const primaryNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Properties", url: "/properties", icon: Building2 },
  { title: "Submit", url: "/submit-property", icon: Plus },
];

export function MobileBottomNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);
  const { selectedProperties } = useComparison();
  const { data: isAdmin } = useIsAdmin();

  // Only show on mobile
  if (!isMobile) return null;

  const isActive = (url: string) => location.pathname === url;

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {primaryNavItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors",
                isActive(item.url)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">{item.title}</span>
            </Link>
          ))}

          {/* More Button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors relative",
              moreOpen
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1 font-medium">More</span>
            {/* Badge for Compare or Admin notifications */}
            {(selectedProperties.length > 0 || isAdmin) && (
              <span className="absolute top-2 right-1/4 h-2 w-2 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* More Menu Sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>More Options</SheetTitle>
          </SheetHeader>
          
          <div className="grid gap-2 py-4">
            {/* Compare - if has selections */}
            {selectedProperties.length > 0 && (
              <Link
                to="/compare"
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive("/compare")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <Scale className="h-5 w-5" />
                <span className="flex-1">Compare Properties</span>
                <Badge variant="secondary">{selectedProperties.length}</Badge>
              </Link>
            )}

            {/* Admin - if admin */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  location.pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <Shield className="h-5 w-5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Settings */}
            <Link
              to="/dashboard?tab=settings"
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>

            {/* Help */}
            <button
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

### 2. Update AppLayout

Add the bottom nav and ensure content doesn't get hidden behind it:

```tsx
// src/components/layout/AppLayout.tsx
import { MobileBottomNav } from "./MobileBottomNav";

export function AppLayout({ 
  children, 
  sidebarContent,
  pageTitle,
  pageSubtitle,
  pageIcon,
  headerActions,
  showComparisonBar = false,
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar>{sidebarContent}</AppSidebar>
        
        <SidebarInset>
          {/* Page Header */}
          {pageTitle && (
            <div className="...">
              {/* ... existing header ... */}
            </div>
          )}
          
          {/* Main Content - add bottom padding for mobile nav */}
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
        </SidebarInset>
      </div>

      {/* Comparison Bar (optional) */}
      {showComparisonBar && <ComparisonBar />}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}
```

### 3. Add Safe Area CSS

For devices with home indicators (iPhone X+), add CSS for safe area padding:

```css
/* In src/index.css */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
```

### Key Features

| Feature | Implementation |
|---------|----------------|
| **Mobile Only** | Uses `useIsMobile()` hook (768px breakpoint) |
| **Primary Nav** | Dashboard, Properties, Submit - always visible |
| **More Menu** | Sheet from bottom with Compare, Admin, Settings, Help |
| **Active States** | Primary color for current route |
| **Compare Badge** | Shows count in "More" menu and dot indicator on button |
| **Admin Access** | Only shows in menu when user is admin |
| **Safe Areas** | Proper padding for notched devices |
| **Content Spacing** | Main content gets bottom padding to prevent overlap |

### Visual Design

```text
┌──────────────────────────────────┐
│                                  │
│         Page Content             │
│                                  │
│                                  │
├──────────────────────────────────┤
│ 🏠        🏢        ➕       ☰  │
│Dashboard Properties Submit  More │
└──────────────────────────────────┘
       ↑ Fixed to bottom, 64px height
```

When "More" is tapped:

```text
┌──────────────────────────────────┐
│         More Options             │
├──────────────────────────────────┤
│ ⚖️ Compare Properties      [3]  │ ← Only if has selections
│ 🛡️ Admin Panel                  │ ← Only if admin
│ ⚙️ Settings                      │
│ ❓ Help                          │
└──────────────────────────────────┘
       ↑ Bottom sheet slides up
```

### File Summary

| File | Change |
|------|--------|
| `src/components/layout/MobileBottomNav.tsx` | Create new component with nav bar + more sheet |
| `src/components/layout/AppLayout.tsx` | Add `MobileBottomNav` and content padding |
| `src/index.css` | Add `.safe-area-pb` utility class |


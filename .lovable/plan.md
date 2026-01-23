

## Apply Sidebar Layout to All App Pages

### Overview
Extend the Landify-inspired sidebar layout from the Properties page to all authenticated app pages (Dashboard, Admin, Compare) while keeping marketing/legal pages with the standard Layout.

### Pages to Update

| Page | Current Layout | Change |
|------|---------------|--------|
| **Dashboard** | `Layout` + container | Sidebar + SidebarInset |
| **Admin** | `Layout` + container | Sidebar + SidebarInset |
| **Compare** | `Layout` + container | Sidebar + SidebarInset |
| Index, Privacy, Terms, etc. | `Layout` | **Keep as-is** (marketing pages) |

### Architecture

We'll create a reusable **AppSidebar** component that can be used across all authenticated pages, with the current PropertiesSidebar's filter section being page-specific.

```text
┌─────────────────────────────────────────────────────────┐
│                    AppSidebar                           │
├─────────────────────────────────────────────────────────┤
│  Logo + Collapse Button                                │
├─────────────────────────────────────────────────────────┤
│  Navigation:                                            │
│    • Dashboard        (/dashboard)                     │
│    • Properties       (/properties)                    │
│    • Compare          (/compare) - if has selections   │
│    • Submit Property  (/submit-property)               │
│    • Admin            (/admin) - if admin              │
├─────────────────────────────────────────────────────────┤
│  Page-specific content (filters, etc.)                 │
├─────────────────────────────────────────────────────────┤
│  Footer: Settings + Help                               │
└─────────────────────────────────────────────────────────┘
```

### File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/layout/AppSidebar.tsx` | **Create** | Reusable sidebar with navigation for all app pages |
| `src/components/layout/AppLayout.tsx` | **Create** | Wrapper component with SidebarProvider + SidebarInset |
| `src/pages/Dashboard.tsx` | **Modify** | Replace `Layout` with `AppLayout` |
| `src/pages/Admin.tsx` | **Modify** | Replace `Layout` with `AppLayout` |
| `src/pages/Compare.tsx` | **Modify** | Replace `Layout` with `AppLayout` |
| `src/pages/Properties.tsx` | **Modify** | Refactor to use shared `AppSidebar` |

---

## Technical Details

### 1. AppSidebar Component (Shared Navigation)

```tsx
// src/components/layout/AppSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Scale, Plus, Users, 
  Settings, HelpCircle, Shield
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { useComparison } from "@/contexts/ComparisonContext";
import { useIsAdmin } from "@/hooks/useAdminApplications";
import logo from "@/assets/offmrkt-logo.png";

interface AppSidebarProps {
  children?: React.ReactNode;  // For page-specific sidebar content (filters, etc.)
}

export function AppSidebar({ children }: AppSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { selectedProperties } = useComparison();
  const { data: isAdmin } = useIsAdmin();

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/properties", icon: Building2 },
    { title: "Submit Property", url: "/submit-property", icon: Plus },
  ];

  // Conditionally show Compare if user has selections
  if (selectedProperties.length > 0) {
    navItems.push({ 
      title: `Compare (${selectedProperties.length})`, 
      url: "/compare", 
      icon: Scale 
    });
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between p-2">
          {!isCollapsed && (
            <Link to="/">
              <img src={logo} alt="OffMrkt" className="h-10" />
            </Link>
          )}
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Admin Section (if admin) */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname.startsWith("/admin")}
                  tooltip="Admin Panel"
                >
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Page-specific content (filters, etc.) */}
        {children}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link to="/dashboard?tab=settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
```

### 2. AppLayout Wrapper Component

```tsx
// src/components/layout/AppLayout.tsx
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;  // Page-specific sidebar content
  pageTitle?: string;
  pageSubtitle?: string;
  pageIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function AppLayout({ 
  children, 
  sidebarContent,
  pageTitle,
  pageSubtitle,
  pageIcon,
  headerActions
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar>{sidebarContent}</AppSidebar>
        
        <SidebarInset>
          {/* Page Header */}
          {pageTitle && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                {pageIcon && (
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {pageIcon}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {pageTitle}
                  </h1>
                  {pageSubtitle && (
                    <p className="text-sm text-muted-foreground">{pageSubtitle}</p>
                  )}
                </div>
              </div>
              {headerActions}
            </div>
          )}
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
```

### 3. Dashboard Page Update

```tsx
// src/pages/Dashboard.tsx - Key structural changes
import { AppLayout } from "@/components/layout/AppLayout";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  // ... existing state and hooks ...

  if (loading) {
    return (
      <AppLayout 
        pageTitle="Dashboard" 
        pageIcon={<LayoutDashboard className="h-5 w-5 text-primary" />}
      >
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle={`Welcome back, ${profile?.full_name?.split(" ")[0] || "Investor"}`}
      pageSubtitle="Manage your property investments"
      pageIcon={<LayoutDashboard className="h-5 w-5 text-primary" />}
      headerActions={
        <Badge variant={investorStatus === "approved" ? "default" : "secondary"}>
          {investorStatus === "approved" ? "Approved Investor" : "Pending Approval"}
        </Badge>
      }
    >
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* ... existing stats cards ... */}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="saved" className="space-y-6">
          {/* ... existing tabs content ... */}
        </Tabs>
      </div>
    </AppLayout>
  );
};
```

### 4. Admin Page Update

```tsx
// src/pages/Admin.tsx - Key structural changes
import { AppLayout } from "@/components/layout/AppLayout";
import { Shield } from "lucide-react";

const Admin = () => {
  // ... existing state and hooks ...

  // Admin sidebar content - section navigation
  const adminSidebarContent = (
    <SidebarGroup>
      <SidebarGroupLabel>Sections</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={currentSection === 'applications'}
            onClick={() => setCurrentSection('applications')}
          >
            <Users className="h-4 w-4" />
            <span>Applications</span>
            {pendingApps > 0 && (
              <Badge className="ml-auto">{pendingApps}</Badge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* ... more section buttons ... */}
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <AppLayout
      pageTitle="Admin Panel"
      pageSubtitle="Manage investors, properties, and leads"
      pageIcon={<Shield className="h-5 w-5 text-primary" />}
      sidebarContent={adminSidebarContent}
    >
      <div className="p-6">
        {/* Section content based on currentSection */}
      </div>
    </AppLayout>
  );
};
```

### 5. Compare Page Update

```tsx
// src/pages/Compare.tsx - Key structural changes
import { AppLayout } from "@/components/layout/AppLayout";
import { Scale } from "lucide-react";

const Compare = () => {
  const { selectedProperties, clearSelection, maxProperties } = useComparison();
  // ... existing hooks ...

  return (
    <AppLayout
      pageTitle="Compare Properties"
      pageSubtitle={`${selectedProperties.length} of ${maxProperties} properties selected`}
      pageIcon={<Scale className="h-5 w-5 text-primary" />}
      headerActions={
        <div className="flex items-center gap-2">
          {canAddMore && (
            <Button asChild variant="outline" size="sm">
              <Link to="/properties">
                <Plus className="h-4 w-4 mr-1.5" />
                Add More
              </Link>
            </Button>
          )}
          {selectedProperties.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear All
            </Button>
          )}
        </div>
      }
    >
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ... loading skeletons ... */}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <ComparisonTable properties={propertiesToCompare} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};
```

### 6. Update Properties Page to Use Shared AppSidebar

Refactor `PropertiesSidebar` to extend `AppSidebar` with the filters section as page-specific content.

### Benefits

| Benefit | Description |
|---------|-------------|
| **Consistent UX** | Same navigation across all app pages |
| **Single Source of Truth** | Navigation defined once in AppSidebar |
| **Flexible** | Pages can add their own sidebar content (filters, sections) |
| **Compare Badge** | Shows selection count in sidebar when comparing |
| **Admin Visibility** | Admin nav only shows for admins |
| **Mobile Ready** | Sidebar collapses to sheet on mobile |

### Visual Result

All authenticated pages will now have:
- Collapsible sidebar with consistent navigation
- Same header structure with page title + icon
- Clean content area with consistent padding
- Unified look matching the Properties page


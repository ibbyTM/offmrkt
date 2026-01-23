

## Adopt Landify UI Layout with OffMrkt Light Theme

### Overview
Transform the Properties page to match the Landify layout structure (sidebar navigation, enhanced toolbar, refined card grid) while keeping your existing royal blue light theme colors exactly as they are.

### What We're Adopting from Landify

| Element | Description |
|---------|-------------|
| Collapsible sidebar | Left navigation with filters integrated |
| Enhanced toolbar | Search, save search, bulk actions, view toggles, filter, sort |
| 4-column property grid | Denser layout on large screens |
| Refined card design | Cleaner layout matching Landify structure |
| Dot indicators on images | Already have, will refine styling |

### What We're Keeping (Your Colors)

| Token | Value | Description |
|-------|-------|-------------|
| `--background` | White (100%) | Page background |
| `--card` | White (100%) | Card surfaces |
| `--primary` | Royal Blue (220 70% 55%) | Primary actions |
| `--border` | Light gray (220 20% 90%) | Subtle borders |
| `--sidebar-background` | Off-white (220 20% 98%) | Sidebar background |

### New Architecture

```text
+------------------+----------------------------------------+
|                  |  Global Header (OffMrkt logo + nav)   |
+------------------+----------------------------------------+
|                  |  Page Header: "Properties" + Actions   |
|    Sidebar       +----------------------------------------+
|    - Navigation  |  Toolbar: Search | Views | Filter     |
|    - Filters     +----------------------------------------+
|                  |                                        |
|                  |   Property Grid (4 columns XL)         |
|                  |                                        |
+------------------+----------------------------------------+
```

### File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/properties/PropertiesSidebar.tsx` | Create | New sidebar with navigation + filters |
| `src/components/properties/PropertiesToolbar.tsx` | Create | Enhanced toolbar component |
| `src/pages/Properties.tsx` | Modify | Integrate sidebar layout structure |
| `src/components/properties/PropertyCard.tsx` | Modify | Refine card layout to match Landify |

---

## Technical Details

### 1. PropertiesSidebar Component

A new sidebar component that combines navigation and property filters:

```tsx
// src/components/properties/PropertiesSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Users, Settings, HelpCircle 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { PropertyFiltersPanel, PropertyFilters } from "./PropertyFilters";
import logo from "@/assets/offmrkt-logo.png";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Properties", url: "/properties", icon: Building2 },
  { title: "Leads", url: "/admin", icon: Users },
];

interface PropertiesSidebarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  cities: string[];
}

export function PropertiesSidebar({ 
  filters, 
  onFiltersChange, 
  cities 
}: PropertiesSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
        {/* Navigation */}
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

        {/* Filters (hidden when collapsed) */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Filters</SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <PropertyFiltersPanel
                filters={filters}
                onFiltersChange={onFiltersChange}
                cities={cities}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link to="/dashboard">
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

### 2. PropertiesToolbar Component

An enhanced toolbar matching the Landify design:

```tsx
// src/components/properties/PropertiesToolbar.tsx
import { Search, Grid3X3, List, Filter, ChevronDown, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertiesToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
}

export function PropertiesToolbar({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onFilterClick,
  activeFilterCount,
}: PropertiesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border bg-background">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Save Search */}
      <Button variant="outline" size="sm">
        Save Search
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 border border-border rounded-md p-1">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Button (mobile/tablet) */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onFilterClick}
        className="lg:hidden"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Sort */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="yield-high">Yield: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Actions - pushed to right */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
    </div>
  );
}
```

### 3. Updated Properties Page Layout

Restructure to use SidebarProvider:

```tsx
// Key changes to src/pages/Properties.tsx
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PropertiesSidebar } from "@/components/properties/PropertiesSidebar";
import { PropertiesToolbar } from "@/components/properties/PropertiesToolbar";

const Properties = () => {
  // ... existing state and hooks ...
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar with navigation + filters */}
        <PropertiesSidebar
          filters={filters}
          onFiltersChange={setFilters}
          cities={cities}
        />

        <SidebarInset>
          {/* Global Header */}
          <Header />

          {/* Page Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Properties
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredProperties.length} deals available
                </p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <PropertiesToolbar
            searchValue={filters.search}
            onSearchChange={(val) => setFilters({ ...filters, search: val })}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onFilterClick={() => setMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* Property Grid - now 4 columns on XL */}
          <main className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>
      
      <ComparisonBar />
    </SidebarProvider>
  );
};
```

### 4. PropertyCard Refinements

Subtle updates to match Landify's card structure while keeping your colors:

```tsx
// Key refinements to PropertyCard
<Card className="group overflow-hidden rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card">
  {/* Image carousel - unchanged */}
  
  <CardContent className="p-4">
    {/* Price + Reference */}
    <div className="flex items-center justify-between mb-1">
      <span className="text-xl font-bold text-foreground">
        {formatPrice(property.asking_price)}
      </span>
      <span className="text-xs text-muted-foreground font-mono">
        #{referenceId}
      </span>
    </div>

    {/* Property Type (new - like Landify) */}
    <p className="text-sm text-muted-foreground mb-1">
      {property.property_type}
    </p>
    
    {/* Location */}
    <div className="flex items-center gap-1 text-muted-foreground mb-3">
      <MapPin className="h-3.5 w-3.5" />
      <span className="text-sm line-clamp-1">
        {property.property_city}, {property.property_postcode}
      </span>
    </div>
    
    {/* Specs - Bed, Bath, Yield */}
    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
      <div className="flex items-center gap-1">
        <Bed className="h-4 w-4" />
        <span>{property.bedrooms || "—"}</span>
      </div>
      <div className="flex items-center gap-1">
        <Bath className="h-4 w-4" />
        <span>{property.bathrooms || "—"}</span>
      </div>
      <div className="flex items-center gap-1">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="font-semibold text-primary">{formatYield(grossYield)}</span>
      </div>
    </div>
    
    {/* CTA Button */}
    <Button className="w-full" variant="default">
      View Details
    </Button>
  </CardContent>
</Card>
```

### Key Features

| Feature | Implementation |
|---------|----------------|
| Collapsible sidebar | Uses `collapsible="icon"` for mini mode |
| Filters in sidebar | Integrated PropertyFiltersPanel |
| Enhanced toolbar | Search, save, views, sort, actions |
| 4-column grid | `xl:grid-cols-4` on large screens |
| Mobile-friendly | Sidebar converts to sheet on mobile |
| Preserved colors | All existing CSS variables unchanged |

### Result

The Properties page will have the sophisticated Landify layout (sidebar navigation, rich toolbar, 4-column grid) while maintaining your clean, professional OffMrkt royal blue light theme throughout.


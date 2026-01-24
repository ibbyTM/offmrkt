import { Link, useLocation, useSearchParams } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Scale, Plus, 
  Settings, HelpCircle, Shield, Heart, Clock, User
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/contexts/ComparisonContext";
import { useIsAdmin } from "@/hooks/useAdminApplications";
import logo from "@/assets/offmrkt-logo.png";

interface AppSidebarProps {
  children?: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { selectedProperties } = useComparison();
  const { data: isAdmin } = useIsAdmin();

  const isDashboard = location.pathname === "/dashboard";
  const currentTab = searchParams.get("tab") || "overview";

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/properties", icon: Building2 },
    { title: "Submit Property", url: "/submit-property", icon: Plus },
  ];

  // Dashboard sub-navigation items
  const dashboardSubItems = [
    { title: "Overview", url: "/dashboard", tab: "overview", icon: LayoutDashboard },
    { title: "Saved Properties", url: "/dashboard?tab=saved", tab: "saved", icon: Heart },
    { title: "My Listings", url: "/dashboard?tab=listings", tab: "listings", icon: Building2 },
    { title: "Reservations", url: "/dashboard?tab=reservations", tab: "reservations", icon: Clock },
  ];

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

      <SidebarContent className="flex flex-col">
        {/* Main Navigation */}
        <SidebarGroup className="flex-shrink-0">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.url && item.url !== "/dashboard"}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Compare - show when there are selections */}
            {selectedProperties.length > 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/compare"}
                  tooltip={`Compare (${selectedProperties.length})`}
                >
                  <Link to="/compare">
                    <Scale className="h-4 w-4" />
                    <span>Compare</span>
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                      {selectedProperties.length}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Dashboard Sub-Navigation - Only show when on dashboard */}
        {isDashboard && (
          <SidebarGroup className="flex-shrink-0">
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              {dashboardSubItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={currentTab === item.tab}
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
        )}

        {/* Admin Section */}
        {isAdmin && (
          <SidebarGroup className="flex-shrink-0">
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

        {/* Page-specific content (filters, sections, etc.) */}
        {children && (
          <>
            <Separator className="mx-2 my-2" />
            <div className="flex-1 overflow-y-auto min-h-0">
              {children}
            </div>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Account Settings">
              <Link to="/dashboard?tab=settings">
                <User className="h-4 w-4" />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & Support">
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

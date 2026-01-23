import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Scale, Plus, 
  Settings, HelpCircle, Shield
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
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/contexts/ComparisonContext";
import { useIsAdmin } from "@/hooks/useAdminApplications";
import logo from "@/assets/offmrkt-logo.png";

interface AppSidebarProps {
  children?: React.ReactNode;
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
        {/* Main Navigation - Fixed, never scrolls away */}
        <SidebarGroup className="flex-shrink-0">
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

        {/* Admin Section - Fixed, never scrolls away */}
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

        {/* Page-specific content (filters, sections, etc.) - Scrollable */}
        {children && (
          <div className="flex-1 overflow-y-auto min-h-0">
            {children}
          </div>
        )}
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

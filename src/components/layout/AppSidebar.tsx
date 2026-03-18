import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Building2, Scale, Plus, 
  HelpCircle, Shield, Megaphone, Heart, Clock, User, LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/contexts/ComparisonContext";
import { useIsAdmin } from "@/hooks/useAdminApplications";
import logo from "@/assets/offthemarkets-logo.png";

interface AppSidebarProps {
  children?: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { selectedProperties } = useComparison();
  const { data: isAdmin } = useIsAdmin();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isDashboard = location.pathname === "/dashboard";
  const currentTab = searchParams.get("tab") || "overview";

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/properties", icon: Building2 },
    { title: "Submit Property", url: "/submit-property", icon: Plus },
  ];

  const dashboardSubItems = [
    { title: "Overview", url: "/dashboard", tab: "overview", icon: LayoutDashboard },
    { title: "Saved Properties", url: "/dashboard?tab=saved", tab: "saved", icon: Heart },
    { title: "My Listings", url: "/dashboard?tab=listings", tab: "listings", icon: Building2 },
    { title: "Reservations", url: "/dashboard?tab=reservations", tab: "reservations", icon: Clock },
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r-0 bg-slate-900 text-slate-300 [&_[data-sidebar=sidebar]]:bg-slate-900 [&_[data-sidebar=sidebar]]:text-slate-300"
    >
      <SidebarHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-center p-2">
          <Link to="/">
            <img src={logo} alt="Off The Markets" className="h-7 w-auto brightness-0 invert" />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <SidebarGroup className="flex-shrink-0">
          <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const active = location.pathname === item.url && item.url !== "/dashboard";
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={active}
                    tooltip={item.title}
                    className={active 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    }
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

            {selectedProperties.length > 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/compare"}
                  tooltip={`Compare (${selectedProperties.length})`}
                  className={location.pathname === "/compare"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }
                >
                  <Link to="/compare">
                    <Scale className="h-4 w-4" />
                    <span>Compare</span>
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs bg-slate-700 text-slate-200 border-0">
                      {selectedProperties.length}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {isDashboard && (
          <SidebarGroup className="flex-shrink-0">
            <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-wider">Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              {dashboardSubItems.map((item) => {
                const active = currentTab === item.tab;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      tooltip={item.title}
                      className={active
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                      }
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup className="flex-shrink-0">
            <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-wider">Admin</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/admin"}
                  tooltip="Admin Panel"
                  className={location.pathname === "/admin"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }
                >
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/admin/ad-creatives"}
                  tooltip="Ad Creatives"
                  className={location.pathname === "/admin/ad-creatives"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }
                >
                  <Link to="/admin/ad-creatives">
                    <Megaphone className="h-4 w-4" />
                    <span>Ad Creatives</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {children && (
          <>
            <Separator className="mx-2 my-2 bg-slate-700/50" />
            <div className="flex-1 overflow-y-auto min-h-0">
              {children}
            </div>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Account Settings" className="text-slate-400 hover:text-slate-100 hover:bg-slate-800">
              <Link to="/dashboard?tab=settings">
                <User className="h-4 w-4" />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & Support" className="text-slate-400 hover:text-slate-100 hover:bg-slate-800">
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              tooltip="Log Out"
              className="text-slate-500 hover:text-red-400 hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

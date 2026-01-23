import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, Building2, Plus, Menu, 
  Settings, HelpCircle, Shield, Scale 
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

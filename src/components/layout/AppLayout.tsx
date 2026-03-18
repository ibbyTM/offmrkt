import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";
import { MobileBottomNav } from "./MobileBottomNav";

interface AppLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  pageIcon?: ReactNode;
  headerActions?: ReactNode;
  showComparisonBar?: boolean;
}

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
            <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border bg-background gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <SidebarTrigger />
                {pageIcon && (
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {pageIcon}
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
                    {pageTitle}
                  </h1>
                  {pageSubtitle && (
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{pageSubtitle}</p>
                  )}
                </div>
              </div>
              <div className="shrink-0">{headerActions}</div>
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

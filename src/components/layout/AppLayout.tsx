import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ComparisonBar } from "@/components/comparison/ComparisonBar";

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

      {/* Comparison Bar (optional) */}
      {showComparisonBar && <ComparisonBar />}
    </SidebarProvider>
  );
}

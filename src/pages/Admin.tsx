import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAdminApplications,
  useUpdateApplicationStatus,
  useIsAdmin,
  type ApplicationStatus,
} from "@/hooks/useAdminApplications";
import {
  useSellerSubmissions,
  useUpdateSubmissionStatus,
  useConvertToListing,
  type SubmissionStatus,
  type SellerSubmission,
  type EnhancedContent,
} from "@/hooks/useSellerSubmissions";
import { useMortgageReferrals } from "@/hooks/useMortgageReferrals";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { MortgageReferralsTable } from "@/components/admin/MortgageReferralsTable";
import { InvestorCRMTab } from "@/components/crm/InvestorCRMTab";
import { FunnelAnalyticsTab } from "@/components/admin/FunnelAnalyticsTab";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Loader2, Users, Building, Clock, UserCog, Banknote, Shield, BarChart3 } from "lucide-react";

type AdminSection = 'home' | 'applications' | 'crm' | 'submissions' | 'mortgage-leads' | 'funnels';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const [currentSection, setCurrentSection] = useState<AdminSection>('home');
  
  // Investor applications state
  const { data: applications = [], isLoading: isLoadingApps } = useAdminApplications();
  const { mutate: updateAppStatus, isPending: isUpdatingApp } = useUpdateApplicationStatus();

  // Seller submissions state
  const { data: submissions = [], isLoading: isLoadingSubs } = useSellerSubmissions();
  const { mutate: updateSubStatus, isPending: isUpdatingSub } = useUpdateSubmissionStatus();
  const { mutate: convertToListing, isPending: isConverting } = useConvertToListing();

  // Mortgage referrals state
  const { data: mortgageReferrals = [], isLoading: isLoadingReferrals } = useMortgageReferrals();

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const pendingSubs = submissions.filter((s) => s.admin_status === "pending").length;

  const handleUpdateAppStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    updateAppStatus({ applicationId, status, adminNotes: notes });
  };

  const handleUpdateSubStatus = (submissionId: string, status: SubmissionStatus, notes?: string) => {
    updateSubStatus({ submissionId, status, adminNotes: notes });
  };

  const handleConvertToListing = (submission: SellerSubmission, enhancedContent?: EnhancedContent) => {
    convertToListing({ submission, enhancedContent });
  };

  // Admin sidebar navigation
  const adminSidebarContent = (
    <SidebarGroup>
      <SidebarGroupLabel>Sections</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={currentSection === 'applications'}
            onClick={() => setCurrentSection('applications')}
            tooltip="Applications"
          >
            <Users className="h-4 w-4" />
            <span>Applications</span>
            {pendingApps > 0 && (
              <Badge className="ml-auto h-5 px-1.5 text-xs bg-amber-500">
                {pendingApps}
              </Badge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={currentSection === 'crm'}
            onClick={() => setCurrentSection('crm')}
            tooltip="Investor CRM"
          >
            <UserCog className="h-4 w-4" />
            <span>Investor CRM</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={currentSection === 'submissions'}
            onClick={() => setCurrentSection('submissions')}
            tooltip="Submissions"
          >
            <Building className="h-4 w-4" />
            <span>Submissions</span>
            {pendingSubs > 0 && (
              <Badge className="ml-auto h-5 px-1.5 text-xs bg-amber-500">
                {pendingSubs}
              </Badge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={currentSection === 'mortgage-leads'}
            onClick={() => setCurrentSection('mortgage-leads')}
            tooltip="Mortgage Leads"
          >
            <Banknote className="h-4 w-4" />
            <span>Mortgage Leads</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={currentSection === 'funnels'}
            onClick={() => setCurrentSection('funnels')}
            tooltip="Funnel Analytics"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Funnels</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );

  // Show loading state while checking auth
  if (authLoading || isCheckingAdmin) {
    return (
      <AppLayout 
        pageTitle="Admin Panel" 
        pageIcon={<Shield className="h-5 w-5 text-primary" />}
      >
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <AppLayout 
        pageTitle="Access Denied" 
        pageIcon={<Shield className="h-5 w-5 text-primary" />}
      >
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <Users className="h-20 w-20 text-muted-foreground mb-6" />
          <h2 className="text-3xl font-bold mb-3">Access Denied</h2>
          <p className="text-xl text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </AppLayout>
    );
  }

  // Get section title and subtitle
  const getSectionInfo = () => {
    switch (currentSection) {
      case 'applications':
        return { title: 'Investor Applications', subtitle: 'Review and approve new investors' };
      case 'crm':
        return { title: 'Investor Database', subtitle: 'All your investors in one place' };
      case 'submissions':
        return { title: 'Property Submissions', subtitle: 'Properties submitted by sellers' };
      case 'mortgage-leads':
        return { title: 'Mortgage Leads', subtitle: 'All referrals sent to your mortgage broker' };
      case 'funnels':
        return { title: 'Funnel Analytics', subtitle: 'Track conversion rates and traffic sources' };
      default:
        return { title: 'Admin Panel', subtitle: 'Manage investors, properties, and leads' };
    }
  };

  const { title, subtitle } = getSectionInfo();

  // Home view with large clickable cards
  if (currentSection === 'home') {
    return (
      <AppLayout
        pageTitle="Admin Panel"
        pageSubtitle="Welcome! Choose what you'd like to manage."
        pageIcon={<Shield className="h-5 w-5 text-primary" />}
        sidebarContent={adminSidebarContent}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid gap-6">
            {/* Applications Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] border-2"
              onClick={() => setCurrentSection('applications')}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-primary/10">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Investor Applications</h2>
                      <p className="text-lg text-muted-foreground">Review and approve new investors</p>
                    </div>
                  </div>
                  {pendingApps > 0 ? (
                    <Badge className="text-lg px-4 py-2 bg-amber-500 hover:bg-amber-500">
                      <Clock className="h-5 w-5 mr-2" />
                      {pendingApps} need review
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      All reviewed ✓
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CRM Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] border-2"
              onClick={() => setCurrentSection('crm')}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-purple-500/10">
                      <UserCog className="h-10 w-10 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Investor Database</h2>
                      <p className="text-lg text-muted-foreground">View all investors and add contacts</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {isLoadingApps ? '...' : applications.length} investors
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] border-2"
              onClick={() => setCurrentSection('submissions')}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-green-500/10">
                      <Building className="h-10 w-10 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Property Submissions</h2>
                      <p className="text-lg text-muted-foreground">Review properties from sellers</p>
                    </div>
                  </div>
                  {pendingSubs > 0 ? (
                    <Badge className="text-lg px-4 py-2 bg-amber-500 hover:bg-amber-500">
                      <Clock className="h-5 w-5 mr-2" />
                      {pendingSubs} need review
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      All reviewed ✓
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mortgage Leads Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] border-2"
              onClick={() => setCurrentSection('mortgage-leads')}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-blue-500/10">
                      <Banknote className="h-10 w-10 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Mortgage Leads</h2>
                      <p className="text-lg text-muted-foreground">View broker referrals with investor details</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {isLoadingReferrals ? '...' : mortgageReferrals.length} leads
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Funnels Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] border-2"
              onClick={() => setCurrentSection('funnels')}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-orange-500/10">
                      <BarChart3 className="h-10 w-10 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Funnel Analytics</h2>
                      <p className="text-lg text-muted-foreground">Track conversions and traffic sources</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    View →
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Section views
  return (
    <AppLayout
      pageTitle={title}
      pageSubtitle={subtitle}
      pageIcon={<Shield className="h-5 w-5 text-primary" />}
      sidebarContent={adminSidebarContent}
    >
      <div className="p-6">
        {/* Applications Section */}
        {currentSection === 'applications' && (
          <div className="space-y-6">
            {pendingApps > 0 && (
              <Badge className="text-xl px-5 py-2 bg-amber-500 hover:bg-amber-500">
                {pendingApps} waiting for review
              </Badge>
            )}
            <ApplicationsTable
              applications={applications}
              isLoading={isLoadingApps}
              onUpdateStatus={handleUpdateAppStatus}
              isUpdating={isUpdatingApp}
            />
          </div>
        )}

        {/* CRM Section */}
        {currentSection === 'crm' && (
          <InvestorCRMTab />
        )}

        {/* Submissions Section */}
        {currentSection === 'submissions' && (
          <div className="space-y-6">
            {pendingSubs > 0 && (
              <Badge className="text-xl px-5 py-2 bg-amber-500 hover:bg-amber-500">
                {pendingSubs} waiting for review
              </Badge>
            )}
            <SubmissionsTable
              submissions={submissions}
              isLoading={isLoadingSubs}
              onUpdateStatus={handleUpdateSubStatus}
              onConvertToListing={handleConvertToListing}
              isUpdating={isUpdatingSub}
              isConverting={isConverting}
            />
          </div>
        )}

        {/* Mortgage Leads Section */}
        {currentSection === 'mortgage-leads' && (
          <MortgageReferralsTable />
        )}

        {/* Funnels Section */}
        {currentSection === 'funnels' && (
          <FunnelAnalyticsTab />
        )}
      </div>
    </AppLayout>
  );
};

export default Admin;

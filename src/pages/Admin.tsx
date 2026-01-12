import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
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
} from "@/hooks/useSellerSubmissions";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { InvestorCRMTab } from "@/components/crm/InvestorCRMTab";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Building, ArrowLeft, Clock, UserCog } from "lucide-react";

type AdminSection = 'home' | 'applications' | 'crm' | 'submissions';

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

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const pendingSubs = submissions.filter((s) => s.admin_status === "pending").length;

  const handleUpdateAppStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    updateAppStatus({ applicationId, status, adminNotes: notes });
  };

  const handleUpdateSubStatus = (submissionId: string, status: SubmissionStatus, notes?: string) => {
    updateSubStatus({ submissionId, status, adminNotes: notes });
  };

  const handleConvertToListing = (submission: SellerSubmission) => {
    convertToListing(submission);
  };

  // Show loading state while checking auth
  if (authLoading || isCheckingAdmin) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <Users className="h-20 w-20 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
          <p className="text-xl text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  // Home navigation with large clickable cards
  if (currentSection === 'home') {
    return (
      <Layout>
        <div className="container py-8 max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-3">Admin Panel</h1>
            <p className="text-xl text-muted-foreground">
              Welcome! Choose what you'd like to manage.
            </p>
          </div>

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
          </div>
        </div>
      </Layout>
    );
  }

  // Section views with back button
  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={() => setCurrentSection('home')}
          className="mb-6 text-lg gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Admin Home
        </Button>

        {/* Applications Section */}
        {currentSection === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  Investor Applications
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Review people who want to become investors
                </p>
              </div>
              {pendingApps > 0 && (
                <Badge className="text-xl px-5 py-2 bg-amber-500 hover:bg-amber-500">
                  {pendingApps} waiting for review
                </Badge>
              )}
            </div>

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
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <UserCog className="h-8 w-8 text-purple-500" />
                Investor Database
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                All your investors in one place
              </p>
            </div>
            <InvestorCRMTab />
          </div>
        )}

        {/* Submissions Section */}
        {currentSection === 'submissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Building className="h-8 w-8 text-green-500" />
                  Property Submissions
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Properties submitted by sellers
                </p>
              </div>
              {pendingSubs > 0 && (
                <Badge className="text-xl px-5 py-2 bg-amber-500 hover:bg-amber-500">
                  {pendingSubs} waiting for review
                </Badge>
              )}
            </div>

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
      </div>
    </Layout>
  );
};

export default Admin;

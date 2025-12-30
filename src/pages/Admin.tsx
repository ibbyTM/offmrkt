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
  type SubmissionStatus,
} from "@/hooks/useSellerSubmissions";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Clock, CheckCircle, XCircle, ShieldCheck, Building, FileText } from "lucide-react";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  
  // Investor applications state
  const [appStatusFilter, setAppStatusFilter] = useState<ApplicationStatus | undefined>(undefined);
  const { data: applications = [], isLoading: isLoadingApps } = useAdminApplications(appStatusFilter);
  const { mutate: updateAppStatus, isPending: isUpdatingApp } = useUpdateApplicationStatus();

  // Seller submissions state
  const [subStatusFilter, setSubStatusFilter] = useState<SubmissionStatus | undefined>(undefined);
  const { data: submissions = [], isLoading: isLoadingSubs } = useSellerSubmissions(subStatusFilter);
  const { mutate: updateSubStatus, isPending: isUpdatingSub } = useUpdateSubmissionStatus();

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const approvedApps = applications.filter((a) => a.status === "approved").length;
  const rejectedApps = applications.filter((a) => a.status === "rejected").length;

  const pendingSubs = submissions.filter((s) => s.admin_status === "pending").length;
  const approvedSubs = submissions.filter((s) => s.admin_status === "approved").length;

  const handleUpdateAppStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    updateAppStatus({ applicationId, status, adminNotes: notes });
  };

  const handleUpdateSubStatus = (submissionId: string, status: SubmissionStatus, notes?: string) => {
    updateSubStatus({ submissionId, status, adminNotes: notes });
  };

  // Show loading state while checking auth
  if (authLoading || isCheckingAdmin) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage investor applications and property submissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingApps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Apps</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{approvedApps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Subs</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingSubs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Subs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{approvedSubs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications" className="gap-2">
              <Users className="h-4 w-4" />
              Investor Applications
              {pendingApps > 0 && (
                <Badge variant="secondary">{pendingApps}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <Building className="h-4 w-4" />
              Property Submissions
              {pendingSubs > 0 && (
                <Badge variant="secondary">{pendingSubs}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Investor Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Investor Applications</CardTitle>
                <CardDescription>Review and manage investor registration requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="all"
                  onValueChange={(value) =>
                    setAppStatusFilter(value === "all" ? undefined : (value as ApplicationStatus))
                  }
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="all" className="gap-2">
                      All
                      <Badge variant="secondary" className="ml-1">
                        {applications.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Pending
                      {pendingApps > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {pendingApps}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <ApplicationsTable
                      applications={applications}
                      isLoading={isLoadingApps}
                      onUpdateStatus={handleUpdateAppStatus}
                      isUpdating={isUpdatingApp}
                    />
                  </TabsContent>
                  <TabsContent value="pending">
                    <ApplicationsTable
                      applications={applications.filter((a) => a.status === "pending")}
                      isLoading={isLoadingApps}
                      onUpdateStatus={handleUpdateAppStatus}
                      isUpdating={isUpdatingApp}
                    />
                  </TabsContent>
                  <TabsContent value="approved">
                    <ApplicationsTable
                      applications={applications.filter((a) => a.status === "approved")}
                      isLoading={isLoadingApps}
                      onUpdateStatus={handleUpdateAppStatus}
                      isUpdating={isUpdatingApp}
                    />
                  </TabsContent>
                  <TabsContent value="rejected">
                    <ApplicationsTable
                      applications={applications.filter((a) => a.status === "rejected")}
                      isLoading={isLoadingApps}
                      onUpdateStatus={handleUpdateAppStatus}
                      isUpdating={isUpdatingApp}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Property Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Property Submissions</CardTitle>
                <CardDescription>Review and approve seller property submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="all"
                  onValueChange={(value) =>
                    setSubStatusFilter(value === "all" ? undefined : (value as SubmissionStatus))
                  }
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="all" className="gap-2">
                      All
                      <Badge variant="secondary" className="ml-1">
                        {submissions.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Pending
                      {pendingSubs > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {pendingSubs}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected
                    </TabsTrigger>
                    <TabsTrigger value="listed" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Listed
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <SubmissionsTable
                      submissions={submissions}
                      isLoading={isLoadingSubs}
                      onUpdateStatus={handleUpdateSubStatus}
                      isUpdating={isUpdatingSub}
                    />
                  </TabsContent>
                  <TabsContent value="pending">
                    <SubmissionsTable
                      submissions={submissions.filter((s) => s.admin_status === "pending")}
                      isLoading={isLoadingSubs}
                      onUpdateStatus={handleUpdateSubStatus}
                      isUpdating={isUpdatingSub}
                    />
                  </TabsContent>
                  <TabsContent value="approved">
                    <SubmissionsTable
                      submissions={submissions.filter((s) => s.admin_status === "approved")}
                      isLoading={isLoadingSubs}
                      onUpdateStatus={handleUpdateSubStatus}
                      isUpdating={isUpdatingSub}
                    />
                  </TabsContent>
                  <TabsContent value="rejected">
                    <SubmissionsTable
                      submissions={submissions.filter((s) => s.admin_status === "rejected")}
                      isLoading={isLoadingSubs}
                      onUpdateStatus={handleUpdateSubStatus}
                      isUpdating={isUpdatingSub}
                    />
                  </TabsContent>
                  <TabsContent value="listed">
                    <SubmissionsTable
                      submissions={submissions.filter((s) => s.admin_status === "listed")}
                      isLoading={isLoadingSubs}
                      onUpdateStatus={handleUpdateSubStatus}
                      isUpdating={isUpdatingSub}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;

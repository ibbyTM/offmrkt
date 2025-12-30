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
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Clock, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>(undefined);
  
  const { data: applications = [], isLoading } = useAdminApplications(statusFilter);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  const handleUpdateStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    updateStatus({ applicationId, status, adminNotes: notes });
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
            <p className="text-muted-foreground">Manage investor applications and approvals</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Investor Applications</CardTitle>
            <CardDescription>Review and manage investor registration requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? undefined : (value as ApplicationStatus))
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
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {pendingCount}
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
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              <TabsContent value="pending">
                <ApplicationsTable
                  applications={applications.filter((a) => a.status === "pending")}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              <TabsContent value="approved">
                <ApplicationsTable
                  applications={applications.filter((a) => a.status === "approved")}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              <TabsContent value="rejected">
                <ApplicationsTable
                  applications={applications.filter((a) => a.status === "rejected")}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;

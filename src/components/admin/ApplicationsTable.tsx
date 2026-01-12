import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, CheckCircle, XCircle, Clock, Mail, Phone, Banknote, Users } from "lucide-react";
import type { InvestorApplication, ApplicationStatus } from "@/hooks/useAdminApplications";
import { ApplicationDetailDialog } from "./ApplicationDetailDialog";

interface ApplicationsTableProps {
  applications: InvestorApplication[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => void;
  isUpdating: boolean;
}

export const ApplicationsTable = ({
  applications,
  isLoading,
  onUpdateStatus,
  isUpdating,
}: ApplicationsTableProps) => {
  const [selectedApplication, setSelectedApplication] = useState<InvestorApplication | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  // Split applications by status
  const pendingApps = applications.filter(a => a.status === "pending");
  const processedApps = applications.filter(a => a.status !== "pending");
  
  // Show pending by default, toggle to show all
  const displayApps = showProcessed ? applications : pendingApps;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-12 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-2xl font-semibold mb-2">No applications yet</p>
          <p className="text-lg text-muted-foreground">Applications will show up here when investors apply.</p>
        </CardContent>
      </Card>
    );
  }

  const formatBudget = (min: number, max: number) => {
    return `£${(min / 1000).toFixed(0)}k - £${(max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      {/* Toggle for showing processed */}
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div>
          <p className="text-lg font-medium">
            {pendingApps.length} {pendingApps.length === 1 ? 'application' : 'applications'} need review
          </p>
          {processedApps.length > 0 && (
            <p className="text-muted-foreground">
              {processedApps.length} already processed
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="show-processed" className="text-base cursor-pointer">
            Show all applications
          </Label>
          <Switch 
            id="show-processed" 
            checked={showProcessed} 
            onCheckedChange={setShowProcessed}
          />
        </div>
      </div>

      {/* Application Cards */}
      {displayApps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-2xl font-semibold mb-2">All caught up!</p>
            <p className="text-lg text-muted-foreground">No pending applications to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayApps.map((application) => (
            <Card 
              key={application.id} 
              className={`border-2 ${application.status === 'pending' ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold">
                        {application.profile?.full_name || "Unknown Name"}
                      </h3>
                      {application.status === 'approved' && (
                        <Badge className="bg-green-500 hover:bg-green-500 text-base px-3 py-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approved
                        </Badge>
                      )}
                      {application.status === 'rejected' && (
                        <Badge variant="destructive" className="text-base px-3 py-1">
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejected
                        </Badge>
                      )}
                      {application.status === 'pending' && (
                        <Badge className="bg-amber-500 hover:bg-amber-500 text-base px-3 py-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Pending Review
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                      {application.profile?.email && (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-5 w-5" />
                          {application.profile.email}
                        </span>
                      )}
                      {application.profile?.phone && (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-5 w-5" />
                          {application.profile.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-2 font-semibold text-primary">
                        <Banknote className="h-5 w-5" />
                        Budget: {formatBudget(application.min_budget, application.max_budget)}
                      </span>
                      <span className="text-muted-foreground">
                        Applied: {format(new Date(application.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      View Details
                    </Button>
                    
                    {application.status === "pending" && (
                      <>
                        <Button
                          size="lg"
                          className="bg-green-600 hover:bg-green-700 text-base px-6"
                          onClick={() => onUpdateStatus(application.id, "approved")}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="lg"
                          className="text-base px-6"
                          onClick={() => onUpdateStatus(application.id, "rejected")}
                          disabled={isUpdating}
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ApplicationDetailDialog
        application={selectedApplication}
        open={!!selectedApplication}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
        onUpdateStatus={onUpdateStatus}
        isUpdating={isUpdating}
      />
    </div>
  );
};

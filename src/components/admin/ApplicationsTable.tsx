import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import type { InvestorApplication, ApplicationStatus } from "@/hooks/useAdminApplications";
import { ApplicationDetailDialog } from "./ApplicationDetailDialog";

interface ApplicationsTableProps {
  applications: InvestorApplication[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => void;
  isUpdating: boolean;
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }> = {
  pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  approved: { label: "Approved", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { label: "Rejected", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
};

export const ApplicationsTable = ({
  applications,
  isLoading,
  onUpdateStatus,
  isUpdating,
}: ApplicationsTableProps) => {
  const [selectedApplication, setSelectedApplication] = useState<InvestorApplication | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No applications found</p>
        <p className="text-sm">Applications will appear here when investors submit them.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Budget Range</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => {
              const status = statusConfig[application.status as ApplicationStatus];
              return (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.profile?.full_name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{application.profile?.email || "No email"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      £{application.min_budget.toLocaleString()} - £{application.max_budget.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {application.purchase_timeline.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {application.investment_experience.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      {status.icon}
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {application.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onUpdateStatus(application.id, "approved")}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onUpdateStatus(application.id, "rejected")}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ApplicationDetailDialog
        application={selectedApplication}
        open={!!selectedApplication}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
        onUpdateStatus={onUpdateStatus}
        isUpdating={isUpdating}
      />
    </>
  );
};

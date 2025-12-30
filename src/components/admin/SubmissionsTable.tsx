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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, CheckCircle, XCircle, Clock, FileText, Plus } from "lucide-react";
import type { SellerSubmission, SubmissionStatus } from "@/hooks/useSellerSubmissions";
import { SubmissionDetailDialog } from "./SubmissionDetailDialog";

const statusConfig: Record<SubmissionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  reviewing: { label: "Reviewing", variant: "outline", icon: <Eye className="h-3 w-3" /> },
  approved: { label: "Approved", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { label: "Rejected", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  listed: { label: "Listed", variant: "default", icon: <FileText className="h-3 w-3" /> },
};

const propertyTypeLabels: Record<string, string> = {
  terraced: "Terraced",
  semi_detached: "Semi-Detached",
  detached: "Detached",
  flat: "Flat",
  bungalow: "Bungalow",
  commercial: "Commercial",
  land: "Land",
  hmo: "HMO",
  other: "Other",
};

interface SubmissionsTableProps {
  submissions: SellerSubmission[];
  isLoading: boolean;
  onUpdateStatus: (submissionId: string, status: SubmissionStatus, notes?: string) => void;
  onConvertToListing: (submission: SellerSubmission) => void;
  isUpdating: boolean;
  isConverting: boolean;
}

export const SubmissionsTable = ({
  submissions,
  isLoading,
  onUpdateStatus,
  onConvertToListing,
  isUpdating,
  isConverting,
}: SubmissionsTableProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<SellerSubmission | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No submissions found</h3>
        <p className="text-muted-foreground">There are no property submissions to review.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => {
              const status = statusConfig[submission.admin_status];
              return (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium truncate max-w-[200px]">{submission.property_address}</p>
                      <p className="text-sm text-muted-foreground">{submission.property_city}, {submission.property_postcode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.contact_name}</p>
                      <p className="text-sm text-muted-foreground">{submission.contact_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{propertyTypeLabels[submission.property_type] || submission.property_type}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(submission.asking_price)}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      {status.icon}
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(submission.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {submission.admin_status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onUpdateStatus(submission.id, "approved")}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onUpdateStatus(submission.id, "rejected")}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {submission.admin_status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => onConvertToListing(submission)}
                          disabled={isConverting}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          List
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <SubmissionDetailDialog
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onUpdateStatus={onUpdateStatus}
        onConvertToListing={onConvertToListing}
        isUpdating={isUpdating}
        isConverting={isConverting}
      />
    </>
  );
};

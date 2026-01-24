import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, CheckCircle, XCircle, Clock, FileText, Plus, MapPin, Banknote, Home, Loader2, Layers } from "lucide-react";
import type { SellerSubmission, SubmissionStatus, EnhancedContent } from "@/hooks/useSellerSubmissions";
import { SubmissionDetailDialog } from "./SubmissionDetailDialog";

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
  onConvertToListing: (submission: SellerSubmission, enhancedContent?: EnhancedContent) => void;
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
  const [showProcessed, setShowProcessed] = useState(false);

  // Split submissions by status
  const pendingSubs = submissions.filter(s => s.admin_status === "pending");
  const processedSubs = submissions.filter(s => s.admin_status !== "pending");
  
  // Show pending by default
  const displaySubs = showProcessed ? submissions : pendingSubs;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Home className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-2xl font-semibold mb-2">No property submissions</p>
          <p className="text-lg text-muted-foreground">Submissions will appear here when sellers submit properties.</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-500 text-base px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-500 text-base px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved (Ready to List)
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="text-base px-3 py-1">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        );
      case 'listed':
        return (
          <Badge className="bg-green-500 hover:bg-green-500 text-base px-3 py-1">
            <FileText className="h-4 w-4 mr-1" />
            Listed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle for showing processed */}
      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div>
          <p className="text-lg font-medium">
            {pendingSubs.length} {pendingSubs.length === 1 ? 'property' : 'properties'} need review
          </p>
          {processedSubs.length > 0 && (
            <p className="text-muted-foreground">
              {processedSubs.length} already processed
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="show-processed-subs" className="text-base cursor-pointer">
            Show all submissions
          </Label>
          <Switch 
            id="show-processed-subs" 
            checked={showProcessed} 
            onCheckedChange={setShowProcessed}
          />
        </div>
      </div>

      {/* Submission Cards */}
      {displaySubs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-2xl font-semibold mb-2">All caught up!</p>
            <p className="text-lg text-muted-foreground">No pending submissions to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displaySubs.map((submission) => (
            <Card 
              key={submission.id} 
              className={`border-2 ${submission.admin_status === 'pending' ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold truncate">
                        {submission.property_address}
                      </h3>
                      <StatusBadge status={submission.admin_status} />
                      {(submission as any).is_multi_unit && (
                        <Badge variant="secondary" className="text-xs">
                          <Layers className="h-3 w-3 mr-1" />
                          Multi-unit
                        </Badge>
                      )}
                      {(submission as any).building_name && (
                        <span className="text-sm text-muted-foreground">
                          ({(submission as any).building_name})
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        {submission.property_city}, {submission.property_postcode}
                      </span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Home className="h-5 w-5" />
                        {propertyTypeLabels[submission.property_type] || submission.property_type}
                      </span>
                      <span className="flex items-center gap-2 font-semibold text-primary text-lg">
                        <Banknote className="h-5 w-5" />
                        {formatCurrency(submission.asking_price)}
                      </span>
                      <span className="text-muted-foreground">
                        From: {submission.contact_name}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      View Details
                    </Button>
                    
                    {submission.admin_status === "pending" && (
                      <>
                        <Button
                          size="lg"
                          className="bg-green-600 hover:bg-green-700 text-base px-6"
                          onClick={() => onConvertToListing(submission)}
                          disabled={isConverting}
                        >
                          {isConverting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Approve & List
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="lg"
                          className="text-base px-6"
                          onClick={() => onUpdateStatus(submission.id, "rejected")}
                          disabled={isUpdating || isConverting}
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

      <SubmissionDetailDialog
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onUpdateStatus={onUpdateStatus}
        onConvertToListing={onConvertToListing}
        isUpdating={isUpdating}
        isConverting={isConverting}
      />
    </div>
  );
};

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Bed,
  Bath,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Plus,
} from "lucide-react";
import type { SellerSubmission, SubmissionStatus } from "@/hooks/useSellerSubmissions";

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

const propertyStatusLabels: Record<string, string> = {
  vacant: "Vacant",
  tenanted: "Tenanted",
  owner_occupied: "Owner Occupied",
  under_renovation: "Under Renovation",
};

const sellingReasonLabels: Record<string, string> = {
  quick_sale: "Quick Sale Needed",
  relocation: "Relocation",
  investment_exit: "Investment Exit",
  inheritance: "Inheritance",
  divorce: "Divorce",
  financial: "Financial Reasons",
  upgrade: "Upgrading",
  downsize: "Downsizing",
  other: "Other",
};

const saleTimelineLabels: Record<string, string> = {
  asap: "ASAP",
  within_1_month: "Within 1 Month",
  within_3_months: "Within 3 Months",
  within_6_months: "Within 6 Months",
  flexible: "Flexible",
};

interface SubmissionDetailDialogProps {
  submission: SellerSubmission | null;
  onClose: () => void;
  onUpdateStatus: (submissionId: string, status: SubmissionStatus, notes?: string) => void;
  onConvertToListing: (submission: SellerSubmission) => void;
  isUpdating: boolean;
  isConverting: boolean;
}

export const SubmissionDetailDialog = ({
  submission,
  onClose,
  onUpdateStatus,
  onConvertToListing,
  isUpdating,
  isConverting,
}: SubmissionDetailDialogProps) => {
  const [adminNotes, setAdminNotes] = useState(submission?.admin_notes || "");

  if (!submission) return null;

  const status = statusConfig[submission.admin_status];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusUpdate = (newStatus: SubmissionStatus) => {
    onUpdateStatus(submission.id, newStatus, adminNotes);
  };

  return (
    <Dialog open={!!submission} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl">Property Submission</DialogTitle>
            <Badge variant={status.variant} className="gap-1">
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <DialogDescription>
            Submitted on {format(new Date(submission.created_at), "dd MMMM yyyy 'at' HH:mm")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 rounded-lg p-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{submission.contact_name}</p>
                {submission.company_name && (
                  <p className="text-sm text-muted-foreground">{submission.company_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${submission.contact_email}`} className="text-primary hover:underline">
                    {submission.contact_email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${submission.contact_phone}`} className="text-primary hover:underline">
                    {submission.contact_phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Property Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">{submission.property_address}</p>
                  <p className="text-muted-foreground">{submission.property_city}, {submission.property_postcode}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{propertyTypeLabels[submission.property_type]}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{propertyStatusLabels[submission.current_status]}</p>
                </div>
                {submission.bedrooms && (
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{submission.bedrooms}</p>
                    </div>
                  </div>
                )}
                {submission.bathrooms && (
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{submission.bathrooms}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Asking Price</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(submission.asking_price)}</p>
              </div>

              {submission.property_description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{submission.property_description}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Sale Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sale Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Reason for Selling</p>
                <p className="font-medium">{sellingReasonLabels[submission.selling_reason]}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Sale Timeline</p>
                <p className="font-medium">{saleTimelineLabels[submission.sale_timeline]}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Compliance Documents */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Compliance Documents
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`rounded-lg p-3 ${submission.has_epc ? "bg-green-500/10" : "bg-muted/50"}`}>
                <p className="text-sm font-medium">EPC</p>
                <p className={`text-xs ${submission.has_epc ? "text-green-600" : "text-muted-foreground"}`}>
                  {submission.has_epc ? `Available (${submission.epc_rating || "N/A"})` : "Not Available"}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${submission.has_gas_safety ? "bg-green-500/10" : "bg-muted/50"}`}>
                <p className="text-sm font-medium">Gas Safety</p>
                <p className={`text-xs ${submission.has_gas_safety ? "text-green-600" : "text-muted-foreground"}`}>
                  {submission.has_gas_safety ? "Available" : "Not Available"}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${submission.has_eicr ? "bg-green-500/10" : "bg-muted/50"}`}>
                <p className="text-sm font-medium">EICR</p>
                <p className={`text-xs ${submission.has_eicr ? "text-green-600" : "text-muted-foreground"}`}>
                  {submission.has_eicr ? "Available" : "Not Available"}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${submission.has_floor_plans ? "bg-green-500/10" : "bg-muted/50"}`}>
                <p className="text-sm font-medium">Floor Plans</p>
                <p className={`text-xs ${submission.has_floor_plans ? "text-green-600" : "text-muted-foreground"}`}>
                  {submission.has_floor_plans ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
          </div>

          {/* Photos */}
          {submission.photo_urls && submission.photo_urls.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Property Photos</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {submission.photo_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Property photo ${index + 1}`}
                      className="rounded-lg aspect-square object-cover"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Additional Notes */}
          {submission.additional_notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Additional Notes from Seller</h3>
                <p className="text-sm bg-muted/50 rounded-lg p-3">{submission.additional_notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Admin Notes */}
          <div>
            <Label htmlFor="admin-notes">Admin Notes</Label>
            <Textarea
              id="admin-notes"
              placeholder="Add internal notes about this submission..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {submission.admin_status !== "rejected" && submission.admin_status !== "listed" && (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("rejected")}
              disabled={isUpdating || isConverting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
          {submission.admin_status === "pending" && (
            <Button
              variant="secondary"
              onClick={() => handleStatusUpdate("reviewing")}
              disabled={isUpdating || isConverting}
            >
              <Eye className="h-4 w-4 mr-2" />
              Mark Reviewing
            </Button>
          )}
          {submission.admin_status !== "approved" && submission.admin_status !== "listed" && (
            <Button
              variant="default"
              onClick={() => handleStatusUpdate("approved")}
              disabled={isUpdating || isConverting}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {submission.admin_status === "approved" && (
            <Button
              onClick={() => onConvertToListing(submission)}
              disabled={isConverting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isConverting ? "Creating..." : "Create Listing"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

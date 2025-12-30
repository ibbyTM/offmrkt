import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
  Banknote,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Target,
} from "lucide-react";
import type { InvestorApplication, ApplicationStatus } from "@/hooks/useAdminApplications";
import { strategyLabels } from "@/lib/propertyUtils";

interface ApplicationDetailDialogProps {
  application: InvestorApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => void;
  isUpdating: boolean;
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }> = {
  pending: { label: "Pending Review", variant: "secondary", icon: <Clock className="h-4 w-4" /> },
  approved: { label: "Approved", variant: "default", icon: <CheckCircle className="h-4 w-4" /> },
  rejected: { label: "Rejected", variant: "destructive", icon: <XCircle className="h-4 w-4" /> },
};

export const ApplicationDetailDialog = ({
  application,
  open,
  onOpenChange,
  onUpdateStatus,
  isUpdating,
}: ApplicationDetailDialogProps) => {
  const [adminNotes, setAdminNotes] = useState(application?.admin_notes || "");

  if (!application) return null;

  const status = statusConfig[application.status as ApplicationStatus];

  const handleApprove = () => {
    onUpdateStatus(application.id, "approved", adminNotes);
    onOpenChange(false);
  };

  const handleReject = () => {
    onUpdateStatus(application.id, "rejected", adminNotes);
    onOpenChange(false);
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Investor Application</DialogTitle>
            <Badge variant={status.variant} className="gap-1">
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <DialogDescription>
            Submitted on {format(new Date(application.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <InfoRow icon={User} label="Full Name" value={application.profile?.full_name || "Not provided"} />
                <InfoRow icon={Mail} label="Email" value={application.profile?.email || "Not provided"} />
                <InfoRow icon={Phone} label="Phone" value={application.profile?.phone || "Not provided"} />
              </div>
            </div>

            <Separator />

            {/* Investment Profile */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Investment Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <InfoRow
                  icon={Banknote}
                  label="Budget Range"
                  value={`£${application.min_budget.toLocaleString()} - £${application.max_budget.toLocaleString()}`}
                />
                <InfoRow
                  icon={Banknote}
                  label="Cash Available"
                  value={application.cash_available.replace(/_/g, " ")}
                />
                <InfoRow
                  icon={Building}
                  label="Properties Owned"
                  value={application.properties_owned?.toString() || "0"}
                />
                <InfoRow
                  icon={Target}
                  label="Properties to Acquire"
                  value={application.properties_to_acquire.toString()}
                />
                <InfoRow
                  icon={Target}
                  label="Target Yield"
                  value={application.target_yield ? `${application.target_yield}%` : "Not specified"}
                />
                <InfoRow
                  icon={Briefcase}
                  label="Experience Level"
                  value={<span className="capitalize">{application.investment_experience.replace(/_/g, " ")}</span>}
                />
              </div>
            </div>

            <Separator />

            {/* Preferences */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Preferences
              </h3>
              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Preferred Locations</p>
                  <div className="flex flex-wrap gap-2">
                    {application.preferred_locations.map((location) => (
                      <Badge key={location} variant="outline" className="capitalize">
                        {location.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Investment Strategies</p>
                  <div className="flex flex-wrap gap-2">
                    {application.preferred_strategies.map((strategy) => (
                      <Badge key={strategy} variant="outline">
                        {strategyLabels[strategy] || strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline & Funding */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline & Funding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <InfoRow
                  icon={Calendar}
                  label="Purchase Timeline"
                  value={<span className="capitalize">{application.purchase_timeline.replace(/_/g, " ")}</span>}
                />
                <InfoRow
                  icon={Banknote}
                  label="Funding Source"
                  value={<span className="capitalize">{application.funding_source.replace(/_/g, " ")}</span>}
                />
                <InfoRow
                  icon={CheckCircle}
                  label="Mortgage Approved"
                  value={application.mortgage_approved ? "Yes" : "No"}
                />
                <InfoRow
                  icon={User}
                  label="Decision Maker"
                  value={application.decision_maker ? "Yes" : "No"}
                />
              </div>
            </div>

            <Separator />

            {/* Services Needed */}
            <div>
              <h3 className="font-semibold mb-3">Services Needed</h3>
              <div className="flex flex-wrap gap-2">
                {application.needs_mortgage_broker && <Badge>Mortgage Broker</Badge>}
                {application.needs_solicitor && <Badge>Solicitor</Badge>}
                {application.needs_refurb_team && <Badge>Refurb Team</Badge>}
                {application.needs_property_management && <Badge>Property Management</Badge>}
                {!application.needs_mortgage_broker &&
                  !application.needs_solicitor &&
                  !application.needs_refurb_team &&
                  !application.needs_property_management && (
                    <span className="text-muted-foreground text-sm">No additional services needed</span>
                  )}
              </div>
            </div>

            {application.referral_source && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Referral Source</h3>
                  <p className="text-muted-foreground">{application.referral_source}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Admin Notes */}
            <div>
              <Label htmlFor="admin-notes" className="font-semibold">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this application..."
                className="mt-2"
                rows={3}
              />
            </div>

            {application.reviewed_at && (
              <div className="text-sm text-muted-foreground">
                Last reviewed on {format(new Date(application.reviewed_at), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {application.status === "pending" && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isUpdating}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isUpdating}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Application
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

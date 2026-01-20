import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Banknote,
  Calendar,
  Building,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import type { MortgageReferral } from "@/hooks/useMortgageReferrals";

interface MortgageReferralDetailDialogProps {
  referral: MortgageReferral | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value || "Not provided"}</p>
    </div>
  </div>
);

const formatCurrency = (amount: number | null) => {
  if (!amount) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const MortgageReferralDetailDialog = ({
  referral,
  open,
  onOpenChange,
}: MortgageReferralDetailDialogProps) => {
  if (!referral) return null;

  const budgetRange =
    referral.min_budget || referral.max_budget
      ? `${formatCurrency(referral.min_budget) || "?"} - ${formatCurrency(referral.max_budget) || "?"}`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Mortgage Lead Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
              <div className="grid gap-1 sm:grid-cols-2">
                <InfoRow
                  icon={User}
                  label="Name"
                  value={referral.investor_name}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={
                    referral.investor_email ? (
                      <a
                        href={`mailto:${referral.investor_email}`}
                        className="text-primary hover:underline"
                      >
                        {referral.investor_email}
                      </a>
                    ) : null
                  }
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={
                    referral.investor_phone ? (
                      <a
                        href={`tel:${referral.investor_phone}`}
                        className="text-primary hover:underline"
                      >
                        {referral.investor_phone}
                      </a>
                    ) : null
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Financial Profile */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Financial Profile</h3>
              <div className="grid gap-1 sm:grid-cols-2">
                <InfoRow
                  icon={Banknote}
                  label="Budget Range"
                  value={budgetRange}
                />
                <InfoRow
                  icon={Banknote}
                  label="Cash Available"
                  value={referral.cash_available}
                />
                <InfoRow
                  icon={Banknote}
                  label="Funding Source"
                  value={referral.funding_source}
                />
                <InfoRow
                  icon={referral.mortgage_approved ? CheckCircle : XCircle}
                  label="Has AIP (Mortgage Approved)"
                  value={
                    referral.mortgage_approved !== null ? (
                      <Badge
                        variant={referral.mortgage_approved ? "default" : "secondary"}
                      >
                        {referral.mortgage_approved ? "Yes" : "No"}
                      </Badge>
                    ) : null
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Investment Profile */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Investment Profile</h3>
              <div className="grid gap-1 sm:grid-cols-2">
                <InfoRow
                  icon={Clock}
                  label="Purchase Timeline"
                  value={referral.purchase_timeline}
                />
                <InfoRow
                  icon={Building}
                  label="Properties Owned"
                  value={referral.properties_owned?.toString()}
                />
                <InfoRow
                  icon={User}
                  label="Experience Level"
                  value={
                    referral.investment_experience === "first_time"
                      ? "First-time investor"
                      : referral.investment_experience === "some_experience"
                        ? "Some experience (1-3 properties)"
                        : referral.investment_experience === "experienced"
                          ? "Experienced (4+ properties)"
                          : referral.investment_experience
                  }
                />
                <InfoRow
                  icon={referral.needs_mortgage_broker ? CheckCircle : XCircle}
                  label="Requested Broker Help"
                  value={
                    referral.needs_mortgage_broker !== null ? (
                      <Badge
                        variant={referral.needs_mortgage_broker ? "default" : "secondary"}
                      >
                        {referral.needs_mortgage_broker ? "Yes" : "No"}
                      </Badge>
                    ) : null
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Referral Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Referral Information</h3>
              <div className="grid gap-1 sm:grid-cols-2">
                <InfoRow
                  icon={Calendar}
                  label="Referral Date"
                  value={
                    referral.created_at
                      ? format(new Date(referral.created_at), "dd MMM yyyy, HH:mm")
                      : null
                  }
                />
                <InfoRow
                  icon={LinkIcon}
                  label="Referrer URL"
                  value={referral.referrer_url || "Direct"}
                />
                {referral.property_id && (
                  <InfoRow
                    icon={Building}
                    label="Property ID"
                    value={
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {referral.property_id}
                      </code>
                    }
                  />
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <Separator />
            <div className="flex gap-3 pt-2">
              {referral.investor_email && (
                <Button asChild>
                  <a href={`mailto:${referral.investor_email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              )}
              {referral.investor_phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${referral.investor_phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

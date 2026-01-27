import { format } from "date-fns";
import { Copy, ExternalLink, Mail, Phone, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { LandingLead } from "@/hooks/useLandingLeads";

interface LeadDetailDialogProps {
  lead: LandingLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInterestTypeBadge(type: string | null) {
  if (!type) return { label: "Unknown", variant: "secondary" as const };

  const sellerTypes = ["sell", "quick-cash", "free-valuation", "landlord-exit"];
  const investorTypes = ["invest", "off-market-deals", "high-yield"];

  if (sellerTypes.includes(type)) {
    return { label: type.replace(/-/g, " "), variant: "default" as const, className: "bg-green-500 hover:bg-green-600" };
  }
  if (investorTypes.includes(type)) {
    return { label: type.replace(/-/g, " "), variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600" };
  }
  if (type === "buy") {
    return { label: "Buy Property", variant: "default" as const, className: "bg-purple-500 hover:bg-purple-600" };
  }
  return { label: type.replace(/_/g, " "), variant: "secondary" as const };
}

export function LeadDetailDialog({
  lead,
  open,
  onOpenChange,
}: LeadDetailDialogProps) {
  if (!lead) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const badgeInfo = getInterestTypeBadge(lead.interest_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lead Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-medium">{lead.full_name}</p>
              </div>
              <Badge className={badgeInfo.className} variant={badgeInfo.variant}>
                {badgeInfo.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{lead.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(lead.email, "Email")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{lead.phone}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(lead.phone!, "Phone")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Referrer */}
          {lead.referrer_url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Source Page</p>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <span className="flex-1 text-sm truncate">{lead.referrer_url}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a href={lead.referrer_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Submitted on {format(new Date(lead.created_at), "PPP 'at' p")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

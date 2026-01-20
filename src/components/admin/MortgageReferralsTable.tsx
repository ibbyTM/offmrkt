import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Banknote,
  Mail,
  Phone,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import {
  useMortgageReferrals,
  exportReferralsToCSV,
  type MortgageReferralFilters as FilterType,
  type MortgageReferral,
} from "@/hooks/useMortgageReferrals";
import { MortgageReferralFilters } from "./MortgageReferralFilters";
import { MortgageReferralDetailDialog } from "./MortgageReferralDetailDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const formatCurrency = (amount: number | null) => {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const MortgageReferralsTable = () => {
  const [filters, setFilters] = useState<FilterType>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<MortgageReferral | null>(null);

  const { data: referrals = [], isLoading } = useMortgageReferrals(filters);

  const handleExport = () => {
    exportReferralsToCSV(referrals);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Export */}
      <div className="flex items-center justify-between gap-4">
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="flex-1">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {filtersOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        <Button onClick={handleExport} disabled={referrals.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV ({referrals.length})
        </Button>
      </div>

      {/* Filters */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent>
          <MortgageReferralFilters filters={filters} onFiltersChange={setFilters} />
        </CollapsibleContent>
      </Collapsible>

      {/* Empty State */}
      {referrals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Banknote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No mortgage leads found</h3>
            <p className="text-muted-foreground text-center">
              Mortgage referrals will appear here when investors click through to your broker.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Investor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Budget Range</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>AIP</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap">
                      {referral.created_at
                        ? format(new Date(referral.created_at), "dd MMM yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {referral.investor_name || "Anonymous"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {referral.investor_email && (
                          <a
                            href={`mailto:${referral.investor_email}`}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="h-3 w-3" />
                            {referral.investor_email}
                          </a>
                        )}
                        {referral.investor_phone && (
                          <a
                            href={`tel:${referral.investor_phone}`}
                            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" />
                            {referral.investor_phone}
                          </a>
                        )}
                        {!referral.investor_email && !referral.investor_phone && (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {referral.min_budget || referral.max_budget
                        ? `${formatCurrency(referral.min_budget)} - ${formatCurrency(referral.max_budget)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {referral.purchase_timeline ? (
                        <Badge variant="outline">{referral.purchase_timeline}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.mortgage_approved !== null ? (
                        referral.mortgage_approved ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            No
                          </Badge>
                        )
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.investment_experience === "first_time" && (
                        <Badge variant="outline">First-time</Badge>
                      )}
                      {referral.investment_experience === "some_experience" && (
                        <Badge variant="outline">1-3 properties</Badge>
                      )}
                      {referral.investment_experience === "experienced" && (
                        <Badge variant="outline">4+ properties</Badge>
                      )}
                      {!referral.investment_experience && "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReferral(referral)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Detail Dialog */}
      <MortgageReferralDetailDialog
        referral={selectedReferral}
        open={!!selectedReferral}
        onOpenChange={(open) => !open && setSelectedReferral(null)}
      />
    </div>
  );
};

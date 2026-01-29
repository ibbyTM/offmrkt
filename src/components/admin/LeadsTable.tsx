import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download, Filter, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { useLandingLeads, exportLeadsToCSV, type LeadFilters, type LandingLead } from "@/hooks/useLandingLeads";
import { LeadFiltersComponent } from "./LeadFilters";
import { LeadDetailDialog } from "./LeadDetailDialog";

function getInterestTypeBadge(type: string | null) {
  if (!type) return { label: "Unknown", className: "" };

  const sellerTypes = ["sell", "quick-cash", "free-valuation", "landlord-exit"];
  const investorTypes = ["invest", "off-market-deals", "high-yield"];

  if (sellerTypes.includes(type)) {
    return { label: type.replace(/-/g, " "), className: "bg-green-500 hover:bg-green-600 text-white" };
  }
  if (investorTypes.includes(type)) {
    return { label: type.replace(/-/g, " "), className: "bg-blue-500 hover:bg-blue-600 text-white" };
  }
  if (type === "buy") {
    return { label: "Buy", className: "bg-purple-500 hover:bg-purple-600 text-white" };
  }
  return { label: type.replace(/_/g, " "), className: "" };
}

export function LeadsTable() {
  const [filters, setFilters] = useState<LeadFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LandingLead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: leads = [], isLoading } = useLandingLeads(filters);

  const hasActiveFilters =
    (filters.interestType && filters.interestType !== "all") ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search;

  const handleRowClick = (lead: LandingLead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  const handleExport = () => {
    exportLeadsToCSV(leads);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  Active
                </Badge>
              )}
              {filtersOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={leads.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Collapsible Filters */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent>
          <LeadFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </CollapsibleContent>
      </Collapsible>

      {/* Empty State */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Inbox className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No leads yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Leads will appear here when visitors submit forms on your landing
            pages and funnels.
          </p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </p>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap hidden sm:table-cell">Email</TableHead>
                    <TableHead className="whitespace-nowrap hidden md:table-cell">Phone</TableHead>
                    <TableHead className="whitespace-nowrap">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const badgeInfo = getInterestTypeBadge(lead.interest_type);
                    return (
                      <TableRow
                        key={lead.id}
                        className="cursor-pointer"
                        onClick={() => handleRowClick(lead)}
                      >
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(new Date(lead.created_at), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{lead.full_name}</TableCell>
                        <TableCell className="text-muted-foreground hidden sm:table-cell">
                          {lead.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden md:table-cell">
                          {lead.phone || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className={badgeInfo.className}>
                            {badgeInfo.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Detail Dialog */}
      <LeadDetailDialog
        lead={selectedLead}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

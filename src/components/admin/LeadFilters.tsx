import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { LeadFilters } from "@/hooks/useLandingLeads";

interface LeadFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
}

const INTEREST_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "sell", label: "Sell Property" },
  { value: "quick-cash", label: "Quick Cash Offer" },
  { value: "free-valuation", label: "Free Valuation" },
  { value: "landlord-exit", label: "Landlord Exit" },
  { value: "invest", label: "Invest" },
  { value: "off-market-deals", label: "Off-Market Deals" },
  { value: "high-yield", label: "High Yield" },
  { value: "buy", label: "Buy Property" },
  { value: "not_sure", label: "Not Sure" },
];

export function LeadFiltersComponent({ filters, onFiltersChange }: LeadFiltersProps) {
  const hasActiveFilters =
    (filters.interestType && filters.interestType !== "all") ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search;

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
      {/* Interest Type */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Interest Type</Label>
        <Select
          value={filters.interestType || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, interestType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            {INTEREST_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date From */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">From Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) =>
                onFiltersChange({ ...filters, dateFrom: date })
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date To */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">To Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Search</Label>
        <Input
          placeholder="Search name or email..."
          value={filters.search || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      {/* Clear Filters */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground invisible">Clear</Label>
        <Button
          variant="ghost"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
}

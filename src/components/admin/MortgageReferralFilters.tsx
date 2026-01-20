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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { MortgageReferralFilters as FilterType } from "@/hooks/useMortgageReferrals";

interface MortgageReferralFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const timelineOptions = [
  { value: "0-3 months", label: "0-3 months" },
  { value: "3-6 months", label: "3-6 months" },
  { value: "6-12 months", label: "6-12 months" },
  { value: "12+ months", label: "12+ months" },
];

const experienceOptions = [
  { value: "first_time", label: "First-time investor" },
  { value: "some_experience", label: "Some experience (1-3 properties)" },
  { value: "experienced", label: "Experienced (4+ properties)" },
];

export const MortgageReferralFilters = ({
  filters,
  onFiltersChange,
}: MortgageReferralFiltersProps) => {
  const hasActiveFilters =
    filters.timeline ||
    filters.minBudget ||
    filters.maxBudget ||
    filters.hasAip !== null ||
    filters.experience ||
    filters.dateFrom ||
    filters.dateTo;

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Timeline Filter */}
        <div className="space-y-2">
          <Label>Purchase Timeline</Label>
          <Select
            value={filters.timeline || ""}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, timeline: value || undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All timelines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All timelines</SelectItem>
              {timelineOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AIP Status Filter */}
        <div className="space-y-2">
          <Label>AIP Status</Label>
          <Select
            value={
              filters.hasAip === true
                ? "yes"
                : filters.hasAip === false
                  ? "no"
                  : ""
            }
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                hasAip:
                  value === "yes" ? true : value === "no" ? false : null,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="yes">Has AIP</SelectItem>
              <SelectItem value="no">No AIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Filter */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            value={filters.experience || ""}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, experience: value || undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              {experienceOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label>Budget Range (£)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minBudget || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minBudget: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxBudget || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxBudget: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label>From Date</Label>
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
                {filters.dateFrom
                  ? format(filters.dateFrom, "dd/MM/yyyy")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) =>
                  onFiltersChange({ ...filters, dateFrom: date || undefined })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label>To Date</Label>
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
                {filters.dateTo
                  ? format(filters.dateTo, "dd/MM/yyyy")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) =>
                  onFiltersChange({ ...filters, dateTo: date || undefined })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

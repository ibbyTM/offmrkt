import { Grid3X3, List, Filter, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertiesToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
  resultsCount: number;
  isLoading?: boolean;
}

export function PropertiesToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onFilterClick,
  activeFilterCount,
  resultsCount,
  isLoading,
}: PropertiesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-background">
      {/* Results Count */}
      <span className="text-sm text-muted-foreground">
        {isLoading ? "Loading..." : `${resultsCount} properties`}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Filter Button (mobile/tablet) */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFilterClick}
        className="lg:hidden"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Sort */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="yield-high">Yield: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 border border-border rounded-md p-1">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <Button variant="outline" size="sm" className="h-9">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button size="sm" className="h-9">
        <Plus className="mr-2 h-4 w-4" />
        Add Property
      </Button>
    </div>
  );
}

import { Search, Grid3X3, List, Filter, ChevronDown, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertiesToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
}

export function PropertiesToolbar({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onFilterClick,
  activeFilterCount,
}: PropertiesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-border bg-background">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Save Search */}
      <Button variant="outline" size="sm">
        Save Search
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 border border-border rounded-md p-1">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Button (mobile/tablet) */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onFilterClick}
        className="lg:hidden"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Sort */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px]">
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

      {/* Actions - pushed to right */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
    </div>
  );
}

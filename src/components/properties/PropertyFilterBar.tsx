import { useState } from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropertyFilters, PropertyFiltersPanel } from "./PropertyFilters";
import { strategyLabels, propertyTypeLabels, formatPrice } from "@/lib/propertyUtils";

interface PropertyFilterBarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  cities: string[];
}

const MIN_PRICE_OPTIONS = [
  { value: "0", label: "No min" },
  { value: "50000", label: "£50,000" },
  { value: "75000", label: "£75,000" },
  { value: "100000", label: "£100,000" },
  { value: "125000", label: "£125,000" },
  { value: "150000", label: "£150,000" },
  { value: "175000", label: "£175,000" },
  { value: "200000", label: "£200,000" },
  { value: "250000", label: "£250,000" },
  { value: "300000", label: "£300,000" },
  { value: "350000", label: "£350,000" },
  { value: "400000", label: "£400,000" },
  { value: "450000", label: "£450,000" },
];

const MAX_PRICE_OPTIONS = [
  { value: "75000", label: "£75,000" },
  { value: "100000", label: "£100,000" },
  { value: "125000", label: "£125,000" },
  { value: "150000", label: "£150,000" },
  { value: "175000", label: "£175,000" },
  { value: "200000", label: "£200,000" },
  { value: "250000", label: "£250,000" },
  { value: "300000", label: "£300,000" },
  { value: "350000", label: "£350,000" },
  { value: "400000", label: "£400,000" },
  { value: "450000", label: "£450,000" },
  { value: "500000", label: "£500,000+" },
];

const BEDROOM_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

export function PropertyFilterBar({
  filters,
  onFiltersChange,
  cities,
}: PropertyFilterBarProps) {
  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: "propertyTypes" | "strategies", value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      city: "",
      minPrice: 0,
      maxPrice: 500000,
      propertyTypes: [],
      strategies: [],
      minBedrooms: 0,
      showSold: false,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.city ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500000 ||
    filters.propertyTypes.length > 0 ||
    filters.strategies.length > 0 ||
    filters.minBedrooms > 0 ||
    filters.showSold;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-card shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search location or postcode..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Location */}
      <Select
        value={filters.city || "all"}
        onValueChange={(value) => updateFilter("city", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All locations</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Min Price */}
      <Select
        value={filters.minPrice.toString()}
        onValueChange={(value) => updateFilter("minPrice", parseInt(value))}
      >
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Min Price" />
        </SelectTrigger>
        <SelectContent>
          {MIN_PRICE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground text-sm">to</span>

      {/* Max Price */}
      <Select
        value={filters.maxPrice.toString()}
        onValueChange={(value) => updateFilter("maxPrice", parseInt(value))}
      >
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Max Price" />
        </SelectTrigger>
        <SelectContent>
          {MAX_PRICE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Bedrooms */}
      <Select
        value={filters.minBedrooms.toString()}
        onValueChange={(value) => updateFilter("minBedrooms", parseInt(value))}
      >
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        <SelectContent>
          {BEDROOM_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Property Type - Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            Property Type
            {filters.propertyTypes.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {filters.propertyTypes.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <div className="space-y-2">
            {Object.entries(propertyTypeLabels).slice(0, 8).map(([value, label]) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-bar-${value}`}
                  checked={filters.propertyTypes.includes(value)}
                  onCheckedChange={() => toggleArrayFilter("propertyTypes", value)}
                />
                <label
                  htmlFor={`type-bar-${value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Strategy - Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            Strategy
            {filters.strategies.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {filters.strategies.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <div className="space-y-2">
            {Object.entries(strategyLabels).map(([value, label]) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`strategy-bar-${value}`}
                  checked={filters.strategies.includes(value)}
                  onCheckedChange={() => toggleArrayFilter("strategies", value)}
                />
                <label
                  htmlFor={`strategy-bar-${value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Show Sold */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-sold-bar"
          checked={filters.showSold}
          onCheckedChange={(checked) => updateFilter("showSold", checked === true)}
        />
        <label htmlFor="show-sold-bar" className="text-sm cursor-pointer whitespace-nowrap">
          Show Sold
        </label>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-muted-foreground hover:text-foreground"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}

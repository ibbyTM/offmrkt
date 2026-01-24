import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { strategyLabels, propertyTypeLabels, formatPrice } from "@/lib/propertyUtils";

export interface PropertyFilters {
  search: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  strategies: string[];
  minBedrooms: number;
  showSold: boolean;
}

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  cities: string[];
}

const PRICE_MAX = 500000;
const PRICE_MIN = 0;

export function PropertyFiltersPanel({
  filters,
  onFiltersChange,
  cities,
}: PropertyFiltersProps) {
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
      minPrice: PRICE_MIN,
      maxPrice: PRICE_MAX,
      propertyTypes: [],
      strategies: [],
      minBedrooms: 0,
      showSold: false,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.city ||
    filters.minPrice > PRICE_MIN ||
    filters.maxPrice < PRICE_MAX ||
    filters.propertyTypes.length > 0 ||
    filters.strategies.length > 0 ||
    filters.minBedrooms > 0 ||
    filters.showSold;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Location</Label>
        <Select
          value={filters.city}
          onValueChange={(value) => updateFilter("city", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
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
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Budget Range
        </Label>
        <div className="px-2">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={5000}
            onValueChange={([min, max]) => {
              updateFilter("minPrice", min);
              updateFilter("maxPrice", max);
            }}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>{filters.maxPrice >= PRICE_MAX ? `${formatPrice(PRICE_MAX)}+` : formatPrice(filters.maxPrice)}</span>
          </div>
        </div>
      </div>

      {/* Minimum Bedrooms */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Min Bedrooms</Label>
        <Select
          value={filters.minBedrooms.toString()}
          onValueChange={(value) => updateFilter("minBedrooms", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Types */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Property Type</Label>
        <div className="space-y-2">
          {Object.entries(propertyTypeLabels).slice(0, 6).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${value}`}
                checked={filters.propertyTypes.includes(value)}
                onCheckedChange={() => toggleArrayFilter("propertyTypes", value)}
              />
              <label
                htmlFor={`type-${value}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Strategies */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Investment Strategy</Label>
        <div className="space-y-2">
          {Object.entries(strategyLabels).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`strategy-${value}`}
                checked={filters.strategies.includes(value)}
                onCheckedChange={() => toggleArrayFilter("strategies", value)}
              />
              <label
                htmlFor={`strategy-${value}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Show Sold Properties */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-sold"
            checked={filters.showSold}
            onCheckedChange={(checked) => updateFilter("showSold", checked === true)}
          />
          <label
            htmlFor="show-sold"
            className="text-sm text-foreground cursor-pointer"
          >
            Show Sold Properties
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

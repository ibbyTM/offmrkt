import { useState, useMemo } from "react";
import { Building } from "lucide-react";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFiltersPanel, PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyFilterBar } from "@/components/properties/PropertyFilterBar";
import { PropertiesToolbar } from "@/components/properties/PropertiesToolbar";
import { AppLayout } from "@/components/layout/AppLayout";
import { useProperties } from "@/hooks/useProperties";

const defaultFilters: PropertyFilters = {
  search: "",
  city: "",
  minPrice: 0,
  maxPrice: 500000,
  propertyTypes: [],
  strategies: [],
  minBedrooms: 0,
  showSold: false,
};

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: properties, isLoading, error } = useProperties();
  
  // Restore scroll position when returning to this page
  useScrollRestoration();

  // Get unique cities from properties
  const cities = useMemo(() => {
    if (!properties) return [];
    const uniqueCities = [...new Set(properties.map((p) => p.property_city))];
    return uniqueCities.sort();
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    let result = properties.filter((property) => {
      // Filter out sold properties if toggle is off
      if (!filters.showSold && property.listing_status === 'sold') {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          property.title.toLowerCase().includes(searchLower) ||
          property.property_city.toLowerCase().includes(searchLower) ||
          property.property_postcode.toLowerCase().includes(searchLower) ||
          property.property_address.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // City filter
      if (filters.city && property.property_city !== filters.city) {
        return false;
      }

      // Price range filter
      if (property.asking_price < filters.minPrice) return false;
      if (filters.maxPrice < 500000 && property.asking_price > filters.maxPrice) {
        return false;
      }

      // Property type filter
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(property.property_type)) {
          return false;
        }
      }

      // Strategy filter
      if (filters.strategies.length > 0) {
        const propertyStrategies = property.strategies || [];
        const hasMatchingStrategy = filters.strategies.some((s) =>
          propertyStrategies.includes(s as any)
        );
        if (!hasMatchingStrategy) return false;
      }

      // Bedrooms filter
      if (filters.minBedrooms > 0) {
        if (!property.bedrooms || property.bedrooms < filters.minBedrooms) {
          return false;
        }
      }

      return true;
    });

    // Sort properties
    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price-high":
        result.sort((a, b) => b.asking_price - a.asking_price);
        break;
      case "price-low":
        result.sort((a, b) => a.asking_price - b.asking_price);
        break;
      case "yield-high":
        result.sort((a, b) => (b.gross_yield_percentage || 0) - (a.gross_yield_percentage || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    // Move sold properties to end (if showing them)
    if (filters.showSold) {
      const available = result.filter(p => p.listing_status !== 'sold');
      const sold = result.filter(p => p.listing_status === 'sold');
      result = [...available, ...sold];
    }

    return result;
  }, [properties, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.city) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 500000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.strategies.length > 0) count++;
    if (filters.minBedrooms > 0) count++;
    if (filters.showSold) count++;
    return count;
  }, [filters]);

  return (
    <AppLayout
      pageTitle="Properties"
      pageSubtitle={isLoading ? "Loading properties..." : `${filteredProperties.length} deals available`}
      pageIcon={<Building className="h-5 w-5 text-primary" />}
      showComparisonBar
    >
      {/* Horizontal Filter Bar (hidden on mobile, shown on lg+) */}
      <div className="hidden lg:block">
        <PropertyFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          cities={cities}
        />
      </div>

      {/* Toolbar */}
      <PropertiesToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onFilterClick={() => setMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
        resultsCount={filteredProperties.length}
        isLoading={isLoading}
      />

      {/* Mobile Filter Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <PropertyFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              cities={cities}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load properties. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No properties found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to see more results.
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters(defaultFilters)}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Property Grid - 4 columns on XL */}
        {!isLoading && !error && filteredProperties.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Properties;

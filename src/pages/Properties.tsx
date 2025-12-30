import { useState, useMemo } from "react";
import { Filter, Grid3X3, List, Building } from "lucide-react";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFiltersPanel, PropertyFilters } from "@/components/properties/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";

const defaultFilters: PropertyFilters = {
  search: "",
  city: "",
  minPrice: 0,
  maxPrice: 500000,
  propertyTypes: [],
  strategies: [],
  minBedrooms: 0,
};

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: properties, isLoading, error } = useProperties();
  
  // Restore scroll position when returning to this page
  useScrollRestoration();

  // Get unique cities from properties
  const cities = useMemo(() => {
    if (!properties) return [];
    const uniqueCities = [...new Set(properties.map((p) => p.property_city))];
    return uniqueCities.sort();
  }, [properties]);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter((property) => {
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
  }, [properties, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.city) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 500000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.strategies.length > 0) count++;
    if (filters.minBedrooms > 0) count++;
    return count;
  }, [filters]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-background-secondary border-b border-border">
        <div className="container py-8 md:py-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Investment Properties
              </h1>
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading properties..."
                  : `${filteredProperties.length} deals available`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-lg text-foreground mb-6">Filters</h2>
              <PropertyFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                cities={cities}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filter & View Controls */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
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

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
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

            {/* Property Grid */}
            {!isLoading && !error && filteredProperties.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Properties;

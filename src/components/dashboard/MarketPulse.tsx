import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { formatPrice, formatYield, propertyTypeLabels } from "@/lib/propertyUtils";

export function MarketPulse() {
  const { data: properties, isLoading } = useProperties();
  
  // Get the 4 most recent available properties
  const featuredProperties = properties
    ?.filter(p => p.listing_status === "available")
    .slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Market Pulse</h2>
            <p className="text-sm text-muted-foreground">Latest investment opportunities</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-2 text-primary hover:text-primary">
          <Link to="/properties">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredProperties.map((property) => {
          const grossYield = property.gross_yield_percentage || 
            (property.estimated_rental_income && property.asking_price 
              ? ((property.estimated_rental_income * 12) / property.asking_price) * 100 
              : null);

          return (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.photo_urls?.[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white font-bold text-lg drop-shadow-lg">
                      {formatPrice(property.asking_price)}
                    </span>
                  </div>

                  {/* Yield Badge */}
                  {grossYield && (
                    <Badge className="absolute top-3 right-3 bg-success/90 hover:bg-success text-success-foreground border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {formatYield(grossYield)} yield
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {property.property_city} · {propertyTypeLabels[property.property_type] || property.property_type}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

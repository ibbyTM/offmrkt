import { Link } from "react-router-dom";
import { ArrowRight, Bed, Bath, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/hooks/useProperties";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  formatYield,
  strategyLabels,
  strategyColors,
  propertyTypeLabels,
} from "@/lib/propertyUtils";

export function FeaturedPropertiesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const { data: properties, isLoading } = useProperties();

  const featuredProperties = properties?.slice(0, 3) || [];

  // Don't render if no properties and not loading
  if (!isLoading && featuredProperties.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      {/* Decorative corner glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        {/* Section Header */}
        <div
          className={cn(
            "mx-auto max-w-xl text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="w-3 h-3 mr-1" />
            Top Investment Picks
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Featured Investment Opportunities
          </h2>
          <p className="text-muted-foreground text-lg">
            Handpicked deals with verified documentation and strong rental yields
          </p>
        </div>

        {/* Properties Grid */}
        <div
          className={cn(
            "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {isLoading
            ? [1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : featuredProperties.map((property, index) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {property.photo_urls?.[0] ? (
                        <img
                          src={property.photo_urls[0]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-background/95 to-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                        <span className="font-bold text-lg">
                          {formatPrice(property.asking_price)}
                        </span>
                      </div>

                      {/* Featured Badge (first property only) */}
                      {index === 0 && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          Top Pick
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Title */}
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1 shrink-0" />
                        <span className="line-clamp-1">
                          {property.property_city}, {property.property_postcode}
                        </span>
                      </div>

                      {/* Details Row */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {property.bathrooms}
                          </span>
                        )}
                        <span className="capitalize">
                          {propertyTypeLabels[property.property_type] || property.property_type}
                        </span>
                      </div>

                      {/* Strategy Tags */}
                      {property.strategies && property.strategies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {property.strategies.slice(0, 3).map((strategy) => (
                            <Badge
                              key={strategy}
                              variant="secondary"
                              className={cn(
                                "text-xs font-medium",
                                strategyColors[strategy]
                              )}
                            >
                              {strategyLabels[strategy] || strategy}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Yield Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">Gross Yield</span>
                        <span className="flex items-center font-semibold text-primary">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {formatYield(property.gross_yield_percentage)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "text-center transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Button asChild size="lg" className="group">
            <Link to="/properties">
              View All Available Deals
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

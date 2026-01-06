import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, TrendingUp, Building, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/hooks/useProperties";
import {
  formatPrice,
  formatYield,
  propertyTypeLabels,
} from "@/lib/propertyUtils";

export function FeaturedPropertyCard() {
  const { data: properties, isLoading } = useProperties();
  
  // Get the first available property as the featured one
  const property = properties?.[0];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-2 border-primary/30 shadow-2xl">
        <Skeleton className="aspect-[4/3] w-full" />
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!property) {
    return null;
  }

  const mainImage = property.photo_urls?.[0];

  return (
    <div className="relative">
      {/* Featured label */}
      <div className="absolute -top-3 left-4 z-10">
        <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1.5 shadow-lg shadow-primary/30 text-sm">
          Featured Deal
        </Badge>
      </div>

      <Link to={`/properties/${property.id}`}>
        <Card className="group overflow-hidden border-2 border-primary/25 shadow-2xl hover:shadow-[0_25px_50px_-12px_hsl(var(--primary)/0.25)] hover:border-primary/40 transition-all duration-500 bg-card">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent to-accent/50">
                <Building className="h-16 w-16 text-primary/40" />
              </div>
            )}
            
            {/* Price overlay with gradient */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-5">
              <span className="text-3xl font-bold text-white drop-shadow-lg">
                {formatPrice(property.asking_price)}
              </span>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Title */}
            <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
              <span className="text-sm font-medium">
                {property.property_city}, {property.property_postcode}
              </span>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-5 text-sm text-muted-foreground mb-5">
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-primary/70" />
                <span className="font-medium">{property.bedrooms || "—"} beds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-primary/70" />
                <span className="font-medium">{property.bathrooms || "—"} baths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4 text-primary/70" />
                <span className="font-medium">{propertyTypeLabels[property.property_type]}</span>
              </div>
            </div>

            {/* Yield and CTA row */}
            <div className="flex items-center justify-between pt-5 border-t border-border/60">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Gross Yield</span>
                  <span className="font-bold text-primary text-lg">
                    {formatYield(property.gross_yield_percentage)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                <span className="text-sm">View Deal</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

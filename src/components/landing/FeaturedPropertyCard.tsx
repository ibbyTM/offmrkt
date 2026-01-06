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
      <Card className="overflow-hidden border-2 border-primary/30 shadow-xl max-w-sm">
        <Skeleton className="aspect-video w-full" />
        <CardContent className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
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
    <div className="relative max-w-sm">
      {/* Featured label */}
      <div className="absolute -top-2.5 left-3 z-10">
        <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 shadow-lg shadow-primary/30 text-xs">
          Featured Deal
        </Badge>
      </div>

      <Link to={`/properties/${property.id}`}>
        <Card className="group overflow-hidden border-2 border-primary/25 shadow-xl hover:shadow-[0_20px_40px_-12px_hsl(var(--primary)/0.25)] hover:border-primary/40 transition-all duration-500 bg-card">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent to-accent/50">
                <Building className="h-12 w-12 text-primary/40" />
              </div>
            )}
            
            {/* Price overlay with gradient */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                {formatPrice(property.asking_price)}
              </span>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Title */}
            <h3 className="font-bold text-lg text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
              <span className="text-sm font-medium">
                {property.property_city}, {property.property_postcode}
              </span>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5 text-primary/70" />
                <span className="font-medium">{property.bedrooms || "—"} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-primary/70" />
                <span className="font-medium">{property.bathrooms || "—"} baths</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-primary/70" />
                <span className="font-medium">{propertyTypeLabels[property.property_type]}</span>
              </div>
            </div>

            {/* Yield and CTA row */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Gross Yield</span>
                  <span className="font-bold text-primary text-base">
                    {formatYield(property.gross_yield_percentage)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-semibold group-hover:gap-2.5 transition-all">
                <span className="text-sm">View Deal</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

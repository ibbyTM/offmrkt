import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, TrendingUp, Building, ArrowRight, Camera } from "lucide-react";
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
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-10 w-full" />
        <CardContent className="p-4">
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
  const photoCount = property.photo_urls?.length || 0;

  // Calculate gross yield dynamically if not stored
  // Both fields are stored as MONTHLY rent, so always multiply by 12
  // Prioritize current_rental_income (actual rent) over estimated_rental_income (market rent)
  const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
  const annualRent = monthlyRent * 12;
  const calculatedGrossYield = property.asking_price > 0 && annualRent > 0
    ? (annualRent / property.asking_price) * 100
    : null;
  const grossYield = property.gross_yield_percentage || calculatedGrossYield;

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
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={(property as any).cover_focal_point ? { objectPosition: `${(property as any).cover_focal_point.x}% ${(property as any).cover_focal_point.y}%` } : undefined}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent">
                <Building className="h-12 w-12 text-primary/40" />
              </div>
            )}
            
            {/* Photo count indicator */}
            {photoCount > 0 && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
                <Camera className="h-3.5 w-3.5" />
                <span>1/{photoCount}</span>
              </div>
            )}
          </div>

          {/* Price bar */}
          <div className="bg-primary px-4 py-2.5">
            <span className="text-lg font-bold text-primary-foreground">
              {formatPrice(property.asking_price)}
            </span>
          </div>

          <CardContent className="p-4">
            {/* Title and location */}
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0 text-primary/70" />
                <span className="text-xs">
                  {property.property_city}, {property.property_postcode}
                </span>
              </div>
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
                    {formatYield(grossYield)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
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

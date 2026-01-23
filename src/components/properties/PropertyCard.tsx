import { Link } from "react-router-dom";
import { Building, MapPin, Bed, Bath, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Property,
  formatPrice,
  formatYield,
  listingStatusLabels,
} from "@/lib/propertyUtils";
import { CompareCheckbox } from "@/components/comparison/CompareCheckbox";
import { PropertyCardMenu } from "./PropertyCardMenu";

interface PropertyCardProps {
  property: Property;
  showCompare?: boolean;
}

export function PropertyCard({ property, showCompare = true }: PropertyCardProps) {
  const mainImage = property.photo_urls?.[0];
  const photoCount = property.photo_urls?.length || 0;

  // Calculate gross yield dynamically if not stored
  const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
  const annualRent = monthlyRent * 12;
  const calculatedGrossYield = property.asking_price > 0 && annualRent > 0
    ? (annualRent / property.asking_price) * 100
    : null;
  const grossYield = property.gross_yield_percentage || calculatedGrossYield;

  // Generate short reference ID from property id
  const referenceId = property.property_reference || `OM${property.id.slice(-4).toUpperCase()}`;

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="group overflow-hidden rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-card">
        {/* Image section with overlay controls */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent">
              <Building className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Top-left: Compare checkbox (icon variant) */}
          {showCompare && (
            <div className="absolute top-3 left-3">
              <CompareCheckbox propertyId={property.id} variant="icon" />
            </div>
          )}

          {/* Bottom center: Carousel dots indicator */}
          {photoCount > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {Array.from({ length: Math.min(photoCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === 0 ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
              {photoCount > 5 && (
                <span className="text-[10px] text-white/80 ml-0.5">+{photoCount - 5}</span>
              )}
            </div>
          )}

          {/* Top-right: Options menu */}
          <PropertyCardMenu propertyId={property.id} />

          {/* Status badge (if not available) */}
          {property.listing_status !== "available" && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 right-14 bg-background/90 text-foreground text-xs font-medium shadow-sm"
            >
              {listingStatusLabels[property.listing_status]}
            </Badge>
          )}
        </div>

        {/* Content section - clean layout */}
        <CardContent className="p-4">
          {/* Price row with reference ID */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-foreground">
              {formatPrice(property.asking_price)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              #{referenceId}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-medium text-foreground line-clamp-1 mb-1">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-sm">
              {property.property_city}, {property.property_postcode}
            </span>
          </div>
          
          {/* Specs row - compact with icons */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms || "—"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms || "—"}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{formatYield(grossYield)}</span>
            </div>
          </div>
          
          {/* Action button - always visible */}
          <Button className="w-full" variant="default">
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

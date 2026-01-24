import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Property,
  formatPrice,
  formatYield,
  listingStatusLabels,
  propertyTypeLabels,
  getSoldInText,
} from "@/lib/propertyUtils";
import { CompareCheckbox } from "@/components/comparison/CompareCheckbox";
import { PropertyCardMenu } from "./PropertyCardMenu";
import { PropertyCardCarousel } from "./PropertyCardCarousel";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  showCompare?: boolean;
}

export function PropertyCard({ property, showCompare = true }: PropertyCardProps) {
  const images = property.photo_urls || [];
  // Calculate gross yield dynamically if not stored
  const monthlyRent = property.current_rental_income || property.estimated_rental_income || 0;
  const annualRent = monthlyRent * 12;
  const calculatedGrossYield = property.asking_price > 0 && annualRent > 0
    ? (annualRent / property.asking_price) * 100
    : null;
  const grossYield = property.gross_yield_percentage || calculatedGrossYield;

  // Generate short reference ID from property id
  const referenceId = property.property_reference || `OM${property.id.slice(-4).toUpperCase()}`;

  // Get property type label
  const propertyTypeLabel = propertyTypeLabels[property.property_type] || property.property_type;

  // Check if property was listed within last 7 days
  const isNew = property.created_at && 
    new Date(property.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Check if property is sold
  const isSold = property.listing_status === "sold";
  const soldInText = isSold && property.created_at 
    ? getSoldInText(property.created_at, property.sold_at) 
    : null;

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className={cn(
        "group overflow-hidden rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card",
        isSold && "opacity-90"
      )}>
        {/* Image section with interactive carousel */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div className={cn(isSold && "grayscale-[30%]")}>
            <PropertyCardCarousel images={images} alt={property.title} />
          </div>
          
          {/* SOLD Banner Overlay */}
          {isSold && (
            <>
              <div className="absolute inset-0 bg-black/20 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-destructive text-destructive-foreground px-6 py-2 font-bold text-lg tracking-wider shadow-xl transform -rotate-3">
                  SOLD
                </div>
              </div>
              {/* Sold in X days badge */}
              {soldInText && (
                <Badge 
                  className="absolute bottom-3 left-3 z-20 bg-destructive/90 text-destructive-foreground text-xs font-semibold shadow-md"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Sold in {soldInText}
                </Badge>
              )}
            </>
          )}
          
          {/* Top-left: Compare checkbox (icon variant) - hide for sold */}
          {showCompare && !isSold && (
            <div className="absolute top-3 left-3 z-20">
              <CompareCheckbox propertyId={property.id} variant="icon" />
            </div>
          )}

          {/* Top-right: Options menu */}
          <PropertyCardMenu propertyId={property.id} />

          {/* New badge for recent listings (not for sold) */}
          {isNew && !isSold && (
            <Badge 
              className="absolute top-3 left-14 z-20 bg-success text-success-foreground text-xs font-semibold shadow-md"
            >
              New
            </Badge>
          )}

          {/* Status badge for reserved/under_offer */}
          {property.listing_status !== "available" && !isSold && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 right-14 bg-background/90 text-foreground text-xs font-medium shadow-sm"
            >
              {listingStatusLabels[property.listing_status]}
            </Badge>
          )}
        </div>

        {/* Content section - refined layout */}
        <CardContent className="p-4">
          {/* Price + Reference */}
          <div className="flex items-center justify-between mb-1">
            <span className={cn(
              "text-xl font-bold",
              isSold ? "text-muted-foreground" : "text-foreground"
            )}>
              {formatPrice(property.asking_price)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              #{referenceId}
            </span>
          </div>

          {/* Property Type */}
          <p className="text-sm text-muted-foreground mb-1">
            {propertyTypeLabel}
          </p>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.property_city}, {property.property_postcode}
            </span>
          </div>
          
          {/* Specs row - Bed, Bath, Yield */}
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
              <TrendingUp className={cn("h-4 w-4", isSold ? "text-muted-foreground" : "text-primary")} />
              <span className={cn("font-semibold", isSold ? "text-muted-foreground" : "text-primary")}>
                {formatYield(grossYield)}
              </span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button 
            className="w-full" 
            variant={isSold ? "outline" : "default"}
          >
            {isSold ? "View History" : "View Details"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

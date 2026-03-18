import { Link } from "react-router-dom";
import { X, Building, ExternalLink, BedDouble, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Property,
  formatPrice,
  formatYield,
  listingStatusLabels,
} from "@/lib/propertyUtils";

interface MobileComparisonCardProps {
  property: Property;
  onRemove: (id: string) => void;
}

export function MobileComparisonCard({ property, onRemove }: MobileComparisonCardProps) {
  const monthlyRent = property.current_rental_income || property.estimated_rental_income;
  const grossYield = property.gross_yield_percentage || (() => {
    const annual = (monthlyRent || 0) * 12;
    return property.asking_price > 0 && annual > 0
      ? (annual / property.asking_price) * 100
      : null;
  })();

  return (
    <div className="min-w-[280px] snap-start rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      {/* Header with image */}
      <div className="relative">
        <button
          onClick={() => onRemove(property.id)}
          className="absolute top-1 right-1 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          {property.photo_urls?.[0] ? (
            <img
              src={property.photo_urls[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Title & location */}
      <div>
        <h3 className="font-semibold text-foreground text-sm line-clamp-2">{property.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{property.property_city}</p>
        <Badge variant="secondary" className="text-xs mt-1.5">
          {listingStatusLabels[property.listing_status]}
        </Badge>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">Price</div>
          <div className="font-semibold text-foreground">{formatPrice(property.asking_price)}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">Gross Yield</div>
          <div className="font-semibold text-primary">{grossYield ? formatYield(grossYield) : "—"}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">Monthly Rent</div>
          <div className="font-semibold text-foreground">{monthlyRent ? formatPrice(monthlyRent) : "—"}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground">ROCE</div>
          <div className="font-semibold text-foreground">{property.roce_percentage ? formatYield(property.roce_percentage) : "—"}</div>
        </div>
      </div>

      {/* Beds & baths */}
      <div className="flex gap-3 text-xs text-muted-foreground">
        {property.bedrooms != null && (
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} bed
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms} bath
          </span>
        )}
      </div>

      {/* View button */}
      <Button asChild variant="outline" size="sm" className="w-full mt-auto">
        <Link to={`/properties/${property.id}`}>
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          View Details
        </Link>
      </Button>
    </div>
  );
}

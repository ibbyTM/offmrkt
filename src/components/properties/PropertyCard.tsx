import { Link } from "react-router-dom";
import { Building, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Property,
  formatPrice,
  formatYield,
  propertyTypeLabels,
  listingStatusLabels,
} from "@/lib/propertyUtils";
import { CompareCheckbox } from "@/components/comparison/CompareCheckbox";

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

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="group overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        {/* Clean Image - minimal overlays */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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
          
          {/* Photo count - subtle top-left */}
          {photoCount > 1 && (
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>1/{photoCount}</span>
            </div>
          )}

          {/* Compare - subtle top-right */}
          {showCompare && (
            <div className="absolute top-2 right-2">
              <CompareCheckbox propertyId={property.id} />
            </div>
          )}
        </div>

        {/* Price Bar */}
        <div className="bg-primary px-4 py-2.5 flex justify-between items-center">
          <span className="text-primary-foreground font-bold text-xl">
            {formatPrice(property.asking_price)}
          </span>
          {property.listing_status !== "available" && (
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs font-medium">
              {listingStatusLabels[property.listing_status]}
            </Badge>
          )}
        </div>

        {/* Content - simplified */}
        <CardContent className="p-4">
          <p className="text-primary font-semibold">
            {property.bedrooms || "—"} bed {propertyTypeLabels[property.property_type]}
          </p>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
            {property.title}, {property.property_city}
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Gross Yield: <span className="font-semibold text-foreground">{formatYield(grossYield)}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

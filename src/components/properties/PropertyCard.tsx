import { Link } from "react-router-dom";
import { Building, Camera, MapPin, Bed, Bath, TrendingUp, ArrowRight } from "lucide-react";
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
      <Card className="group overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
        {/* Image section */}
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
          
          {/* Photo count - subtle top-left */}
          {photoCount > 1 && (
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>1/{photoCount}</span>
            </div>
          )}

          {/* Compare - subtle top-right */}
          {showCompare && (
            <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity">
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

        {/* Content - enhanced with icons */}
        <CardContent className="p-4">
          {/* Location with icon */}
          <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
            <span className="text-sm font-medium line-clamp-1">
              {property.title}, {property.property_city}
            </span>
          </div>

          {/* Property specs with icons */}
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
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Gross Yield</span>
                <span className="font-bold text-primary text-sm">
                  {formatYield(grossYield)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Deal</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

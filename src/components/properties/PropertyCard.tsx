import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, TrendingUp, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Property,
  formatPrice,
  formatYield,
  strategyLabels,
  strategyColors,
  propertyTypeLabels,
} from "@/lib/propertyUtils";
import { CompareCheckbox } from "@/components/comparison/CompareCheckbox";

interface PropertyCardProps {
  property: Property;
  showCompare?: boolean;
}

export function PropertyCard({ property, showCompare = true }: PropertyCardProps) {
  const mainImage = property.photo_urls?.[0];
  const strategies = property.strategies || [];

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="group overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        {/* Image */}
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
          
          {/* Price Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground font-bold text-base px-3 py-1 shadow-md">
              {formatPrice(property.asking_price)}
            </Badge>
          </div>

          {/* Status Badge & Compare Checkbox */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {property.listing_status !== "available" && (
              <Badge variant="secondary" className="bg-background/90 font-medium">
                {property.listing_status === "reserved" ? "Reserved" : property.listing_status}
              </Badge>
            )}
          </div>

          {/* Compare Checkbox */}
          {showCompare && (
            <div className="absolute bottom-3 right-3">
              <CompareCheckbox propertyId={property.id} />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.property_city}, {property.property_postcode}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms || "—"} bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms || "—"} bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="h-4 w-4" />
              <span>{propertyTypeLabels[property.property_type]}</span>
            </div>
          </div>

          {/* Strategy Tags */}
          {strategies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {strategies.slice(0, 3).map((strategy) => (
                <Badge
                  key={strategy}
                  variant="secondary"
                  className={cn("text-xs font-medium", strategyColors[strategy])}
                >
                  {strategyLabels[strategy]}
                </Badge>
              ))}
              {strategies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{strategies.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t border-border mt-auto">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Gross Yield</span>
            </div>
            <span className="font-semibold text-primary">
              {formatYield(property.gross_yield_percentage)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

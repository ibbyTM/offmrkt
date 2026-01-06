import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, TrendingUp, Building, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperties } from "@/hooks/useProperties";
import {
  formatPrice,
  formatYield,
  strategyLabels,
  propertyTypeLabels,
} from "@/lib/propertyUtils";

export function FeaturedPropertyCard() {
  const { data: properties, isLoading } = useProperties();
  
  // Get the first available property as the featured one
  const property = properties?.[0];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
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
  const strategies = property.strategies || [];

  return (
    <div className="relative">
      {/* Featured label */}
      <div className="absolute -top-3 left-4 z-10">
        <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 shadow-md">
          Featured Deal
        </Badge>
      </div>

      <Link to={`/properties/${property.id}`}>
        <Card className="group overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent">
                <Building className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            
            {/* Price overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-2xl font-bold text-white">
                {formatPrice(property.asking_price)}
              </span>
            </div>
          </div>

          <CardContent className="p-5">
            {/* Title */}
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                {property.property_city}, {property.property_postcode}
              </span>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4" />
                <span>{propertyTypeLabels[property.property_type]}</span>
              </div>
            </div>

            {/* Yield and CTA row */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Gross Yield</span>
                <span className="font-bold text-primary">
                  {formatYield(property.gross_yield_percentage)}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

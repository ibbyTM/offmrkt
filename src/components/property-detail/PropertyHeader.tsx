import { MapPin, Bed, Bath, Maximize, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Property, formatPrice, strategyLabels, strategyColors, propertyTypeLabels, listingStatusLabels } from "@/lib/propertyUtils";
import { cn } from "@/lib/utils";

interface PropertyHeaderProps {
  property: Property;
}

const statusColors: Record<string, string> = {
  available: "bg-emerald-500 text-white",
  reserved: "bg-amber-500 text-white",
  under_offer: "bg-blue-500 text-white",
  sold: "bg-red-500 text-white",
};

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge className={cn("text-sm px-3 py-1", statusColors[property.listing_status])}>
          {listingStatusLabels[property.listing_status]}
        </Badge>
        <Badge variant="outline" className="text-sm">
          {propertyTypeLabels[property.property_type]}
        </Badge>
      </div>

      {/* Title & Price */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
          <div className="flex items-center text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {property.property_address}, {property.property_city} {property.property_postcode}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {formatPrice(property.asking_price)}
          </p>
          {property.gross_yield_percentage && (
            <p className="text-sm text-muted-foreground">
              {(property.gross_yield_percentage / 100).toFixed(1)}% Gross Yield
            </p>
          )}
        </div>
      </div>

      {/* Key Details */}
      <div className="flex flex-wrap gap-6 py-4 border-y border-border">
        {property.bedrooms && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-lg">
              <Bed className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-semibold">{property.bedrooms}</p>
            </div>
          </div>
        )}
        {property.bathrooms && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-lg">
              <Bath className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-semibold">{property.bathrooms}</p>
            </div>
          </div>
        )}
        {property.square_feet && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-lg">
              <Maximize className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Size</p>
              <p className="font-semibold">{property.square_feet.toLocaleString()} sq ft</p>
            </div>
          </div>
        )}
        {property.epc_rating && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-lg">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EPC Rating</p>
              <p className="font-semibold">{property.epc_rating}</p>
            </div>
          </div>
        )}
      </div>

      {/* Strategy Tags */}
      {property.strategies && property.strategies.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Suitable for:</p>
          <div className="flex flex-wrap gap-2">
            {property.strategies.map((strategy) => (
              <Badge
                key={strategy}
                className={cn("text-sm", strategyColors[strategy])}
              >
                {strategyLabels[strategy]}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { MapPin, Calendar, Share2, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property, formatPrice, strategyLabels, strategyColors, propertyTypeLabels, listingStatusLabels, getSoldInText } from "@/lib/propertyUtils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

interface PropertyHeaderProps {
  property: Property;
}

const statusColors: Record<string, string> = {
  available: "bg-emerald-500 text-white",
  reserved: "bg-amber-500 text-white",
  under_offer: "bg-blue-500 text-white",
  sold: "bg-destructive text-destructive-foreground",
};

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const isSold = property.listing_status === "sold";
  const soldInText = isSold && property.created_at 
    ? getSoldInText(property.created_at, property.sold_at) 
    : null;

  const addedDate = property.created_at 
    ? format(new Date(property.created_at), "dd/MM/yyyy")
    : null;

  const soldDate = property.sold_at 
    ? format(new Date(property.sold_at), "dd/MM/yyyy")
    : null;

  return (
    <div className="space-y-4">
      {/* Reference & Share Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={cn("text-sm px-3 py-1", statusColors[property.listing_status])}>
            {listingStatusLabels[property.listing_status]}
          </Badge>
          {property.is_tenanted && (
            <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
              TENANTED
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            {propertyTypeLabels[property.property_type]}
          </Badge>
          {/* Sold in X days achievement badge */}
          {isSold && soldInText && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-sm px-3 py-1">
              <Clock className="h-3 w-3 mr-1" />
              Sold in {soldInText}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {property.property_reference && (
            <span className="text-xs text-muted-foreground font-mono">
              Ref: {property.property_reference}
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Title & Price */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className={cn(
            "text-3xl font-bold",
            isSold ? "text-muted-foreground" : "text-foreground"
          )}>
            {property.title}
          </h1>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {property.property_address}, {property.property_city} {property.property_postcode}
              </span>
            </div>
            {/* Show sold date for sold properties, added date for others */}
            {isSold && soldDate ? (
              <div className="flex items-center text-destructive text-sm font-medium">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                <span>Sold {soldDate}</span>
              </div>
            ) : addedDate && (
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Added {addedDate}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-3xl font-bold",
            isSold ? "text-muted-foreground line-through decoration-2" : "text-primary"
          )}>
            {formatPrice(property.asking_price)}
          </p>
          {!isSold && (
            <p className="text-sm text-muted-foreground">
              + Reservation Fee
            </p>
          )}
          {isSold && (
            <p className="text-sm font-medium text-destructive">
              Sale Complete
            </p>
          )}
          {property.gross_yield_percentage && !isSold && (
            <p className="text-sm font-medium text-emerald-600">
              {(property.gross_yield_percentage / 100).toFixed(1)}% Gross Yield
            </p>
          )}
        </div>
      </div>

      {/* Strategy Tags */}
      {property.strategies && property.strategies.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {property.strategies.map((strategy) => (
            <Badge
              key={strategy}
              className={cn("text-sm", strategyColors[strategy], isSold && "opacity-60")}
            >
              {strategyLabels[strategy]}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { X, Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/contexts/ComparisonContext";
import {
  Property,
  formatPrice,
  formatYield,
  propertyTypeLabels,
  listingStatusLabels,
} from "@/lib/propertyUtils";
import { cn } from "@/lib/utils";
import { MortgageCalculatorSection } from "./MortgageCalculatorSection";

interface ComparisonTableProps {
  properties: Property[];
}

interface MetricRow {
  label: string;
  getValue: (p: Property) => string | number | null;
  format?: "currency" | "percentage" | "number" | "text";
  highlightBest?: "highest" | "lowest";
}

// Helper function to calculate gross yield dynamically
function calculateGrossYield(p: Property): number | null {
  const monthlyRent = p.current_rental_income || p.estimated_rental_income || 0;
  const annualRent = monthlyRent * 12;
  if (p.asking_price > 0 && annualRent > 0) {
    return (annualRent / p.asking_price) * 100;
  }
  return null;
}

const metricRows: MetricRow[] = [
  { label: "Asking Price", getValue: (p) => p.asking_price, format: "currency", highlightBest: "lowest" },
  { label: "Deposit Required", getValue: (p) => p.deposit_required, format: "currency", highlightBest: "lowest" },
  { label: "Refurb Cost", getValue: (p) => p.refurb_cost, format: "currency", highlightBest: "lowest" },
  { label: "End Value (GDV)", getValue: (p) => p.end_value_gdv, format: "currency", highlightBest: "highest" },
  { label: "Gross Yield", getValue: (p) => p.gross_yield_percentage || calculateGrossYield(p), format: "percentage", highlightBest: "highest" },
  { label: "ROCE", getValue: (p) => p.roce_percentage, format: "percentage", highlightBest: "highest" },
  { label: "Cash ROI", getValue: (p) => p.cash_roi_percentage, format: "percentage", highlightBest: "highest" },
  { label: "Leveraged ROI", getValue: (p) => p.leveraged_roi_percentage, format: "percentage", highlightBest: "highest" },
  { label: "Market Discount", getValue: (p) => p.market_discount_percentage, format: "percentage", highlightBest: "highest" },
  { label: "Monthly Rent", getValue: (p) => p.estimated_rental_income, format: "currency", highlightBest: "highest" },
  { label: "Current Monthly Rent", getValue: (p) => p.current_rental_income, format: "currency", highlightBest: "highest" },
  { label: "Annual Rent", getValue: (p) => {
    const monthlyRent = p.current_rental_income || p.estimated_rental_income || 0;
    return monthlyRent > 0 ? monthlyRent * 12 : null;
  }, format: "currency", highlightBest: "highest" },
  { label: "Bedrooms", getValue: (p) => p.bedrooms, format: "number" },
  { label: "Bathrooms", getValue: (p) => p.bathrooms, format: "number" },
  { label: "Square Feet", getValue: (p) => p.square_feet, format: "number" },
  { label: "Property Type", getValue: (p) => p.property_type, format: "text" },
  { label: "Tenure", getValue: (p) => p.tenure, format: "text" },
  { label: "EPC Rating", getValue: (p) => p.epc_rating, format: "text" },
  { label: "Tenanted", getValue: (p) => (p.is_tenanted ? "Yes" : "No"), format: "text" },
  { label: "Status", getValue: (p) => p.listing_status, format: "text" },
];

function formatValue(value: string | number | null, format?: string): string {
  if (value === null || value === undefined) return "—";
  
  switch (format) {
    case "currency":
      return formatPrice(Number(value));
    case "percentage":
      return formatYield(Number(value));
    case "number":
      return value.toLocaleString();
    case "text":
      if (typeof value === "string") {
        return propertyTypeLabels[value] || listingStatusLabels[value] || value;
      }
      return String(value);
    default:
      return String(value);
  }
}

function getBestIndex(
  properties: Property[],
  getValue: (p: Property) => string | number | null,
  type: "highest" | "lowest"
): number | null {
  const values = properties.map((p) => {
    const val = getValue(p);
    return typeof val === "number" ? val : null;
  });
  
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return null;
  
  const target = type === "highest" ? Math.max(...validValues) : Math.min(...validValues);
  return values.findIndex((v) => v === target);
}

export function ComparisonTable({ properties }: ComparisonTableProps) {
  const { removeProperty } = useComparison();

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Building className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No properties to compare
        </h3>
        <p className="text-muted-foreground mb-6">
          Select properties from the listings to compare them side by side.
        </p>
        <Button asChild variant="outline">
          <Link to="/properties">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background z-10 p-4 text-left font-medium text-muted-foreground border-b border-border min-w-[140px]">
              Property
            </th>
            {properties.map((property) => (
              <th key={property.id} className="p-4 border-b border-border min-w-[200px]">
                <div className="relative">
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-3">
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
                  
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {property.property_city}
                  </p>
                  
                  <Badge variant="secondary" className="text-xs">
                    {listingStatusLabels[property.listing_status]}
                  </Badge>
                  
                  <Button asChild variant="outline" size="sm" className="w-full mt-3">
                    <Link to={`/properties/${property.id}`}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metricRows.map((row) => {
            const bestIndex = row.highlightBest
              ? getBestIndex(properties, row.getValue, row.highlightBest)
              : null;

            return (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="sticky left-0 bg-background z-10 p-4 font-medium text-sm text-muted-foreground">
                  {row.label}
                </td>
                {properties.map((property, index) => {
                  const value = row.getValue(property);
                  const isBest = bestIndex === index;
                  
                  return (
                    <td
                      key={property.id}
                      className={cn(
                        "p-4 text-sm text-center",
                        isBest && "bg-primary/5 font-semibold text-primary"
                      )}
                    >
                      {formatValue(value, row.format)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mortgage Calculator Section */}
      <MortgageCalculatorSection properties={properties} />
    </div>
  );
}

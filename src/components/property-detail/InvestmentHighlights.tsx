import { Check } from "lucide-react";
import { Property } from "@/lib/propertyUtils";

interface InvestmentHighlightsProps {
  property: Property;
}

export default function InvestmentHighlights({ property }: InvestmentHighlightsProps) {
  // Generate default highlights if none provided
  const generateDefaultHighlights = (): string[] => {
    const highlights: string[] = [];
    
    if (property.is_tenanted) {
      highlights.push("Tenant in situ – immediate income");
    }
    
    if (property.gross_yield_percentage && property.gross_yield_percentage > 800) {
      highlights.push(`Strong gross yield of ${(property.gross_yield_percentage / 100).toFixed(1)}%`);
    }
    
    if (property.market_discount_percentage && property.market_discount_percentage > 0) {
      highlights.push(`${(property.market_discount_percentage / 100).toFixed(1)}% below market value`);
    }
    
    if (property.asking_price < 100000) {
      highlights.push("Low capital entry point");
    }
    
    if (property.strategies?.includes("cash_roi")) {
      highlights.push("Ideal for yield-focused investors");
    }
    
    if (property.strategies?.includes("brrr")) {
      highlights.push("BRRR strategy potential");
    }
    
    if (property.refurb_cost === 0 || property.refurb_cost === null) {
      highlights.push("No refurbishment required");
    }
    
    return highlights.length > 0 ? highlights : ["Investment opportunity"];
  };

  const highlights = property.investment_highlights?.length 
    ? property.investment_highlights 
    : generateDefaultHighlights();

  if (!highlights.length) return null;

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-900">
      <h3 className="text-lg font-semibold text-foreground mb-4">Investment Highlights</h3>
      <ul className="space-y-3">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="p-1 bg-emerald-500 rounded-full">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <span className="text-foreground">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

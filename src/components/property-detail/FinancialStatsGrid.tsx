import { PoundSterling, Hammer, TrendingUp, Home, BarChart3, Percent, Info } from "lucide-react";
import { Property, formatPrice } from "@/lib/propertyUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinancialStatsGridProps {
  property: Property;
}

export default function FinancialStatsGrid({ property }: FinancialStatsGridProps) {
  // Prioritize current_rental_income (actual rent) over estimated_rental_income (market rent)
  const annualRent = (property.current_rental_income || property.estimated_rental_income || 0) * 12;
  
  // Auto-calculate gross ROCE (leveraged)
  const deposit = property.deposit_required || Math.round(property.asking_price * 0.25);
  const refurbCost = property.refurb_cost || 0;
  const totalCashInvested = deposit + refurbCost;
  
  // Gross ROCE: Annual rent / Total cash invested (deposit + refurb)
  const calculatedROCE = totalCashInvested > 0 && annualRent > 0
    ? (annualRent / totalCashInvested) * 100
    : 0;
  
  const stats = [
    {
      icon: PoundSterling,
      label: "Deposit",
      value: property.deposit_required 
        ? formatPrice(property.deposit_required)
        : formatPrice(Math.round(property.asking_price * 0.25)),
      sublabel: property.deposit_required ? null : "(25% estimated)",
    },
    {
      icon: Hammer,
      label: "Refurb",
      value: formatPrice(property.refurb_cost || 0),
      sublabel: null,
    },
    {
      icon: Home,
      label: "End Value (GDV)",
      value: property.end_value_gdv 
        ? formatPrice(property.end_value_gdv)
        : "—",
      sublabel: null,
    },
    {
      icon: TrendingUp,
      label: "Rent",
      value: annualRent > 0 ? `${formatPrice(annualRent)}/year` : "—",
      sublabel: annualRent > 0 
        ? `${formatPrice(Math.round(annualRent / 12))}/month`
        : null,
    },
    {
      icon: BarChart3,
      label: "ROCE",
      value: property.roce_percentage 
        ? `${(property.roce_percentage / 100).toFixed(1)}%`
        : calculatedROCE !== 0 
          ? `${calculatedROCE.toFixed(1)}%`
          : "—",
      sublabel: "Leveraged (75% LTV)",
      tooltip: "Return on Capital Employed: Annual Rent ÷ (Deposit + Refurb Costs)",
    },
    {
      icon: Percent,
      label: "Market Discount",
      value: property.market_discount_percentage 
        ? `${(property.market_discount_percentage / 100).toFixed(1)}%`
        : "—",
      sublabel: "Below Market Value",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center justify-center gap-1">
              {stat.label}
              {stat.tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-help text-muted-foreground/70 hover:text-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px] text-xs">{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </p>
            <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
            {stat.sublabel && (
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sublabel}</p>
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

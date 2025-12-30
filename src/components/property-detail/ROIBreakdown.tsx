import { TrendingUp, Calculator, PoundSterling, Percent } from "lucide-react";
import { Property, formatPrice } from "@/lib/propertyUtils";

interface ROIBreakdownProps {
  property: Property;
}

export default function ROIBreakdown({ property }: ROIBreakdownProps) {
  // Calculate placeholder ROI figures based on property data
  const monthlyRent = property.estimated_rental_income || property.current_rental_income || 0;
  const annualRent = monthlyRent * 12;
  const grossYield = property.asking_price > 0 ? (annualRent / property.asking_price) * 100 : 0;
  
  // Placeholder calculations
  const estimatedCosts = Math.round(annualRent * 0.25); // 25% for costs
  const netAnnualIncome = annualRent - estimatedCosts;
  const netYield = property.asking_price > 0 ? (netAnnualIncome / property.asking_price) * 100 : 0;
  
  // Leveraged scenario (75% LTV)
  const deposit = property.asking_price * 0.25;
  const mortgageAmount = property.asking_price * 0.75;
  const mortgageRate = 5.5; // 5.5% interest rate
  const annualMortgageCost = mortgageAmount * (mortgageRate / 100);
  const leveragedCashflow = annualRent - estimatedCosts - annualMortgageCost;
  const cashOnCashReturn = deposit > 0 ? (leveragedCashflow / deposit) * 100 : 0;

  const roiItems = [
    {
      icon: PoundSterling,
      label: "Estimated Monthly Rent",
      value: monthlyRent > 0 ? formatPrice(monthlyRent) + "/month" : "Not specified",
      highlight: false,
    },
    {
      icon: Percent,
      label: "Gross Yield",
      value: grossYield > 0 ? `${grossYield.toFixed(1)}%` : "—",
      highlight: false,
    },
    {
      icon: Calculator,
      label: "Net Yield (est.)",
      value: netYield > 0 ? `${netYield.toFixed(1)}%` : "—",
      sublabel: "After 25% running costs",
      highlight: false,
    },
    {
      icon: TrendingUp,
      label: "Cash-on-Cash Return",
      value: cashOnCashReturn > 0 ? `${cashOnCashReturn.toFixed(1)}%` : "—",
      sublabel: "With 75% LTV @ 5.5%",
      highlight: true,
    },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">Investment Analysis</h2>
      
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {roiItems.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              item.highlight ? "bg-primary/10 border border-primary/20" : "bg-muted"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${item.highlight ? "bg-primary/20" : "bg-background"}`}>
                <item.icon className={`h-5 w-5 ${item.highlight ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className={`text-lg font-bold ${item.highlight ? "text-primary" : "text-foreground"}`}>
                  {item.value}
                </p>
                {item.sublabel && (
                  <p className="text-xs text-muted-foreground mt-1">{item.sublabel}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leveraged Scenario Breakdown */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-foreground mb-4">Leveraged Investment Scenario</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Purchase Price</span>
            <span className="font-medium">{formatPrice(property.asking_price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deposit (25%)</span>
            <span className="font-medium">{formatPrice(deposit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mortgage Amount (75% LTV)</span>
            <span className="font-medium">{formatPrice(mortgageAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annual Rent</span>
            <span className="font-medium text-emerald-600">+{formatPrice(annualRent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Running Costs (25%)</span>
            <span className="font-medium text-red-500">-{formatPrice(estimatedCosts)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mortgage Interest @ 5.5%</span>
            <span className="font-medium text-red-500">-{formatPrice(annualMortgageCost)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-semibold text-foreground">Annual Cashflow</span>
            <span className={`font-bold ${leveragedCashflow >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {leveragedCashflow >= 0 ? "+" : ""}{formatPrice(leveragedCashflow)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
        * These figures are estimates only. Actual returns may vary. Running costs include management, 
        maintenance, insurance, and void periods. Consult a financial advisor before investing.
      </p>
    </div>
  );
}

import { useState } from "react";
import { Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property, formatPrice, calculateMonthlyPayment } from "@/lib/propertyUtils";
import { cn } from "@/lib/utils";

interface MortgageCalculatorSectionProps {
  properties: Property[];
}

interface MortgageMetric {
  label: string;
  getValue: (property: Property, ltv: number, rate: number, term: number) => number | null;
  format: "currency" | "currency-monthly" | "percentage";
  highlightBest?: "highest" | "lowest";
}

const mortgageMetrics: MortgageMetric[] = [
  {
    label: "Deposit Required",
    getValue: (p, ltv) => p.asking_price * (1 - ltv / 100),
    format: "currency",
    highlightBest: "lowest",
  },
  {
    label: "Loan Amount",
    getValue: (p, ltv) => p.asking_price * (ltv / 100),
    format: "currency",
  },
  {
    label: "Monthly Payment",
    getValue: (p, ltv, rate, term) => {
      const loanAmount = p.asking_price * (ltv / 100);
      return calculateMonthlyPayment(loanAmount, rate, term);
    },
    format: "currency-monthly",
    highlightBest: "lowest",
  },
  {
    label: "Monthly Cash Flow",
    getValue: (p, ltv, rate, term) => {
      const loanAmount = p.asking_price * (ltv / 100);
      const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, term);
      const monthlyRent = p.estimated_rental_income || 0;
      return monthlyRent - monthlyPayment;
    },
    format: "currency-monthly",
    highlightBest: "highest",
  },
  {
    label: "Annual Cash Flow",
    getValue: (p, ltv, rate, term) => {
      const loanAmount = p.asking_price * (ltv / 100);
      const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, term);
      const monthlyRent = p.estimated_rental_income || 0;
      return (monthlyRent - monthlyPayment) * 12;
    },
    format: "currency",
    highlightBest: "highest",
  },
  {
    label: "Cash-on-Cash ROI",
    getValue: (p, ltv, rate, term) => {
      const deposit = p.asking_price * (1 - ltv / 100);
      const loanAmount = p.asking_price * (ltv / 100);
      const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, term);
      const monthlyRent = p.estimated_rental_income || 0;
      const annualCashFlow = (monthlyRent - monthlyPayment) * 12;
      if (deposit === 0) return null;
      return (annualCashFlow / deposit) * 100;
    },
    format: "percentage",
    highlightBest: "highest",
  },
];

function formatMetricValue(value: number | null, format: string): string {
  if (value === null) return "—";

  switch (format) {
    case "currency":
      return formatPrice(Math.round(value));
    case "currency-monthly":
      return `${formatPrice(Math.round(value))}/mo`;
    case "percentage":
      return `${value.toFixed(1)}%`;
    default:
      return String(value);
  }
}

function getBestIndex(
  values: (number | null)[],
  type: "highest" | "lowest"
): number | null {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return null;

  const target = type === "highest" ? Math.max(...validValues) : Math.min(...validValues);
  return values.findIndex((v) => v === target);
}

export function MortgageCalculatorSection({ properties }: MortgageCalculatorSectionProps) {
  const [ltv, setLtv] = useState(75);
  const [interestRate, setInterestRate] = useState(5.5);
  const [term, setTerm] = useState(25);

  if (properties.length === 0) return null;

  return (
    <div className="border-t border-border">
      {/* Calculator Header */}
      <div className="bg-muted/50 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Mortgage Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LTV Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Loan to Value (LTV)</Label>
              <span className="text-sm font-semibold text-primary">{ltv}%</span>
            </div>
            <Slider
              value={[ltv]}
              onValueChange={([val]) => setLtv(val)}
              min={50}
              max={90}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Interest Rate</Label>
              <span className="text-sm font-semibold text-primary">{interestRate}%</span>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={([val]) => setInterestRate(val)}
              min={2}
              max={10}
              step={0.25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Term Select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Mortgage Term</Label>
            <Select value={String(term)} onValueChange={(val) => setTerm(Number(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 15, 20, 25, 30, 35].map((years) => (
                  <SelectItem key={years} value={String(years)}>
                    {years} years
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mortgage Metrics Table */}
      <table className="w-full border-collapse">
        <tbody>
          {mortgageMetrics.map((metric) => {
            const values = properties.map((p) =>
              metric.getValue(p, ltv, interestRate, term)
            );
            const bestIndex = metric.highlightBest
              ? getBestIndex(values, metric.highlightBest)
              : null;

            return (
              <tr key={metric.label} className="border-b border-border last:border-0">
                <td className="sticky left-0 bg-background z-10 p-4 font-medium text-sm text-muted-foreground min-w-[140px]">
                  {metric.label}
                </td>
                {properties.map((property, index) => {
                  const value = values[index];
                  const isBest = bestIndex === index;
                  const isNegative = value !== null && value < 0;

                  return (
                    <td
                      key={property.id}
                      className={cn(
                        "p-4 text-sm text-center min-w-[200px]",
                        isBest && "bg-primary/5 font-semibold text-primary",
                        isNegative && !isBest && "text-destructive"
                      )}
                    >
                      {formatMetricValue(value, metric.format)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

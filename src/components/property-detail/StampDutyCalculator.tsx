import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/propertyUtils";

interface StampDutyCalculatorProps {
  propertyPrice: number;
}

export default function StampDutyCalculator({ propertyPrice }: StampDutyCalculatorProps) {
  const [isAdditionalProperty, setIsAdditionalProperty] = useState(true);
  const [stampDuty, setStampDuty] = useState(0);

  useEffect(() => {
    // UK Stamp Duty calculation (as of 2024)
    // Standard rates and additional property surcharge (5%)
    const calculateStampDuty = (price: number, additional: boolean): number => {
      const surcharge = additional ? 0.05 : 0;
      let duty = 0;

      // Up to £250,000 (0% standard, 5% additional only)
      if (price <= 250000) {
        duty = price * surcharge;
      } 
      // £250,001 to £925,000 (5% + surcharge on portion above £250k)
      else if (price <= 925000) {
        duty = 250000 * surcharge + (price - 250000) * (0.05 + surcharge);
      }
      // £925,001 to £1,500,000 (10% + surcharge on portion above £925k)
      else if (price <= 1500000) {
        duty = 250000 * surcharge + 
               675000 * (0.05 + surcharge) + 
               (price - 925000) * (0.10 + surcharge);
      }
      // Above £1,500,000 (12% + surcharge on portion above £1.5m)
      else {
        duty = 250000 * surcharge + 
               675000 * (0.05 + surcharge) + 
               575000 * (0.10 + surcharge) + 
               (price - 1500000) * (0.12 + surcharge);
      }

      return Math.round(duty);
    };

    setStampDuty(calculateStampDuty(propertyPrice, isAdditionalProperty));
  }, [propertyPrice, isAdditionalProperty]);

  const effectiveRate = ((stampDuty / propertyPrice) * 100).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Property Price:</span>
        </div>
        <span className="font-semibold">{formatPrice(propertyPrice)}</span>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="additional-property" className="text-sm">
          Additional property (5% surcharge)
        </Label>
        <Switch
          id="additional-property"
          checked={isAdditionalProperty}
          onCheckedChange={setIsAdditionalProperty}
        />
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Stamp Duty:</span>
          <span className="text-xl font-bold text-primary">{formatPrice(stampDuty)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Effective Rate:</span>
          <span className="font-medium">{effectiveRate}%</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        *Based on current UK Stamp Duty rates. This is an estimate only. 
        Please consult a solicitor for accurate calculations.
      </p>
    </div>
  );
}

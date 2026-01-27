

## Add Legal Fees and Stamp Duty to Leveraged Investment Breakdown

### Overview

Add two new cost lines to the leveraged scenario breakdown:
1. **Legal Fees**: Fixed at £1,500
2. **Stamp Duty**: 5% for personal purchase, 1% for company purchase (with a toggle)

These will be added to the total cash required (along with deposit), which will then be used to calculate the Cash-on-Cash Return.

### New Calculation Logic

```text
Total Cash Required = Deposit + Legal Fees + Stamp Duty

Cash-on-Cash Return = Annual Cashflow ÷ Total Cash Required
```

For a £100,000 property:
- Deposit (25%): £25,000
- Legal Fees: £1,500  
- Stamp Duty (5% personal): £5,000
- **Total Cash Required**: £31,500

### Visual Layout

```text
Leveraged Investment Scenario
────────────────────────────────────────────────
Purchase Price                        £100,000
Deposit (25%)                          £25,000
Legal Fees                              £1,500
Stamp Duty (5%)                         £5,000
  [ ] Purchasing through a company (1% SDLT)
────────────────────────────────────────────────
Total Cash Required                    £31,500
Mortgage Amount (75% LTV)              £75,000
────────────────────────────────────────────────
Annual Rent                           +£12,000
Mortgage Interest @ 5.5%               -£4,125
────────────────────────────────────────────────
Annual Cashflow                        +£7,875
Cash-on-Cash Return                      25.0%
```

---

### Technical Details

**File: `src/components/property-detail/ROIBreakdown.tsx`**

1. **Add state for company purchase toggle**:
   ```tsx
   import { useState } from "react";
   import { Switch } from "@/components/ui/switch";
   import { Label } from "@/components/ui/label";
   
   const [isCompanyPurchase, setIsCompanyPurchase] = useState(false);
   ```

2. **Add new calculations** (after deposit calculation):
   ```tsx
   const legalFees = 1500;
   const stampDutyRate = isCompanyPurchase ? 0.01 : 0.05;
   const stampDuty = property.asking_price * stampDutyRate;
   const totalCashRequired = deposit + legalFees + stampDuty;
   ```

3. **Update Cash-on-Cash calculation** to use total cash required:
   ```tsx
   // Before
   const cashOnCashReturn = deposit > 0 ? (leveragedCashflow / deposit) * 100 : 0;
   
   // After
   const cashOnCashReturn = totalCashRequired > 0 ? (leveragedCashflow / totalCashRequired) * 100 : 0;
   ```

4. **Add new rows to the breakdown table** (after Deposit row):
   ```tsx
   <div className="flex justify-between">
     <span className="text-muted-foreground">Legal Fees</span>
     <span className="font-medium">{formatPrice(legalFees)}</span>
   </div>
   <div className="flex justify-between">
     <span className="text-muted-foreground">
       Stamp Duty ({isCompanyPurchase ? "1%" : "5%"})
     </span>
     <span className="font-medium">{formatPrice(stampDuty)}</span>
   </div>
   <div className="flex items-center justify-between py-2">
     <Label htmlFor="company-purchase" className="text-xs text-muted-foreground">
       Purchasing through a company (1% SDLT)
     </Label>
     <Switch
       id="company-purchase"
       checked={isCompanyPurchase}
       onCheckedChange={setIsCompanyPurchase}
     />
   </div>
   <div className="flex justify-between pt-2 border-t border-dashed border-border">
     <span className="font-medium text-foreground">Total Cash Required</span>
     <span className="font-medium">{formatPrice(totalCashRequired)}</span>
   </div>
   ```

### File to Modify

| File | Change |
|------|--------|
| `src/components/property-detail/ROIBreakdown.tsx` | Add legal fees, stamp duty with company toggle, update cash-on-cash calculation |

### Result

The breakdown will now show:
- Legal fees (£1,500 fixed)
- Stamp duty (5% personal / 1% company with toggle)
- Total cash required (deposit + fees + duty)
- Cash-on-Cash Return calculated against the true total investment

This gives a more accurate picture of the actual return on money invested.


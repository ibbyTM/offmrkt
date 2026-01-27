

## Remove Running Costs from Leveraged Investment Scenario

### Overview

Simplify the "Leveraged Investment Scenario" breakdown by removing the running costs line. The section will only show mortgage-related deductions, making the cashflow calculation cleaner.

### Current vs New Display

| Current | After Change |
|---------|--------------|
| Purchase Price | Purchase Price |
| Deposit (25%) | Deposit (25%) |
| Mortgage Amount (75% LTV) | Mortgage Amount (75% LTV) |
| Annual Rent | Annual Rent |
| **Est. Running Costs (25%)** | *(removed)* |
| Mortgage Interest @ 5.5% | Mortgage Interest @ 5.5% |
| Annual Cashflow | Annual Cashflow |

### Cashflow Calculation Change

```text
Before: Annual Cashflow = Rent - Running Costs - Mortgage Interest
After:  Annual Cashflow = Rent - Mortgage Interest
```

---

### Technical Details

**File: `src/components/property-detail/ROIBreakdown.tsx`**

1. **Remove unused variables** (lines 15-17):
   - Delete `estimatedCosts` calculation
   - Delete `netAnnualIncome` calculation
   - Delete `netYield` calculation

2. **Update cashflow calculation** (line 24):
   ```tsx
   // Before
   const leveragedCashflow = annualRent - estimatedCosts - annualMortgageCost;
   
   // After
   const leveragedCashflow = annualRent - annualMortgageCost;
   ```

3. **Remove "Net Yield" card** from the `roiItems` array (lines 40-46) since it references running costs

4. **Remove the running costs row** from the breakdown table (lines 106-109):
   ```tsx
   // Delete this block
   <div className="flex justify-between">
     <span className="text-muted-foreground">Est. Running Costs (25%)</span>
     <span className="font-medium text-red-500">-{formatPrice(estimatedCosts)}</span>
   </div>
   ```

5. **Update disclaimer text** (lines 123-126) to remove mention of running costs:
   ```tsx
   // Before
   "* These figures are estimates only. Actual returns may vary. Running costs include management, 
   maintenance, insurance, and void periods. Consult a financial advisor before investing."
   
   // After
   "* These figures are estimates only. Actual returns may vary based on interest rates and 
   market conditions. Consult a financial advisor before investing."
   ```

### File to Modify

| File | Change |
|------|--------|
| `src/components/property-detail/ROIBreakdown.tsx` | Remove running costs line, update cashflow calc, update disclaimer |


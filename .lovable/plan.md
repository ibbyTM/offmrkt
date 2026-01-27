

## Add Cash-on-Cash Return to Leveraged Breakdown

### The Issue

The Cash-on-Cash Return (annual cashflow ÷ deposit) is already being calculated correctly and displayed in the summary cards at the top. However, it's **not shown in the detailed breakdown table** at the bottom where the cashflow is calculated step-by-step.

### Current vs Proposed

The leveraged scenario breakdown currently ends with "Annual Cashflow". You want to add the final yield calculation:

| Current Breakdown | Proposed Breakdown |
|------------------|-------------------|
| Purchase Price | Purchase Price |
| Deposit (25%) | Deposit (25%) |
| Mortgage Amount | Mortgage Amount |
| Annual Rent | Annual Rent |
| Mortgage Interest | Mortgage Interest |
| **Annual Cashflow** | Annual Cashflow |
| *(ends here)* | **Cash-on-Cash Return = 27.1%** |

### Visual Result

```text
Annual Cashflow                    +£6,780
─────────────────────────────────────────
Cash-on-Cash Return                 27.1%
```

---

### Technical Details

**File: `src/components/property-detail/ROIBreakdown.tsx`**

Add a new row after the "Annual Cashflow" row (after line 103):

```tsx
<div className="flex justify-between pt-3 border-t border-border">
  <span className="font-semibold text-foreground">Annual Cashflow</span>
  <span className={`font-bold ${leveragedCashflow >= 0 ? "text-emerald-600" : "text-red-500"}`}>
    {leveragedCashflow >= 0 ? "+" : ""}{formatPrice(leveragedCashflow)}
  </span>
</div>
{/* Add this new row */}
<div className="flex justify-between">
  <span className="font-semibold text-foreground">Cash-on-Cash Return</span>
  <span className="font-bold text-primary text-lg">
    {cashOnCashReturn.toFixed(1)}%
  </span>
</div>
```

### File to Modify

| File | Change |
|------|--------|
| `src/components/property-detail/ROIBreakdown.tsx` | Add Cash-on-Cash Return row at the bottom of the leveraged scenario breakdown |

### Result

The detailed breakdown will now conclude with the final yield percentage (27.1% in your example), making it clear how the return on investment is calculated from the deposit and annual cashflow.


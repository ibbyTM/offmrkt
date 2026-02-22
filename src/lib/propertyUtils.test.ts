import { describe, it, expect } from "vitest";
import {
  getSoldInText,
  formatPrice,
  formatYield,
  calculateMonthlyPayment,
} from "./propertyUtils";

// ---------------------------------------------------------------------------
// getSoldInText
// ---------------------------------------------------------------------------
describe("getSoldInText", () => {
  const base = "2024-01-01T00:00:00Z";

  const soldAt = (days: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  it("returns null when soldAt is null", () => {
    expect(getSoldInText(base, null)).toBeNull();
  });

  it("returns 'Same day!' for 0 days", () => {
    expect(getSoldInText(base, soldAt(0))).toBe("Same day!");
  });

  it("returns '1 day' for 1 day", () => {
    expect(getSoldInText(base, soldAt(1))).toBe("1 day");
  });

  it("returns 'N days' for 2–6 days", () => {
    expect(getSoldInText(base, soldAt(2))).toBe("2 days");
    expect(getSoldInText(base, soldAt(6))).toBe("6 days");
  });

  it("returns '1 week' for exactly 7 days", () => {
    expect(getSoldInText(base, soldAt(7))).toBe("1 week");
  });

  it("returns 'N weeks' for 8–29 days", () => {
    expect(getSoldInText(base, soldAt(14))).toBe("2 weeks");
    expect(getSoldInText(base, soldAt(21))).toBe("3 weeks");
    // 28–29 days should be "4 weeks", not "0 months" (previously bugged)
    expect(getSoldInText(base, soldAt(28))).toBe("4 weeks");
    expect(getSoldInText(base, soldAt(29))).toBe("4 weeks");
  });

  it("returns '1 month' for exactly 30 days", () => {
    expect(getSoldInText(base, soldAt(30))).toBe("1 month");
  });

  it("returns 'N months' for multi-month periods", () => {
    expect(getSoldInText(base, soldAt(60))).toBe("2 months");
    expect(getSoldInText(base, soldAt(90))).toBe("3 months");
  });
});

// ---------------------------------------------------------------------------
// formatPrice
// ---------------------------------------------------------------------------
describe("formatPrice", () => {
  it("formats whole numbers in GBP with no decimal places", () => {
    expect(formatPrice(100000)).toBe("£100,000");
    expect(formatPrice(1500000)).toBe("£1,500,000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("£0");
  });

  it("rounds to nearest pound", () => {
    // Intl.NumberFormat with maximumFractionDigits 0 rounds half-up
    expect(formatPrice(99999.5)).toBe("£100,000");
  });
});

// ---------------------------------------------------------------------------
// formatYield
// ---------------------------------------------------------------------------
describe("formatYield", () => {
  it("returns '—' for null", () => {
    expect(formatYield(null)).toBe("—");
  });

  it("formats to one decimal place", () => {
    expect(formatYield(7)).toBe("7.0%");
    // IEEE 754: 7.55 is stored as ~7.5499…, so toFixed(1) rounds to "7.5"
    expect(formatYield(7.55)).toBe("7.5%");
    expect(formatYield(7.56)).toBe("7.6%");
    expect(formatYield(0)).toBe("0.0%");
  });
});

// ---------------------------------------------------------------------------
// calculateMonthlyPayment
// ---------------------------------------------------------------------------
describe("calculateMonthlyPayment", () => {
  it("returns principal / numPayments when rate is 0", () => {
    // £120,000 over 10 years at 0% = £1,000/month
    expect(calculateMonthlyPayment(120000, 0, 10)).toBeCloseTo(1000, 2);
  });

  it("calculates correct monthly repayment for standard BTL mortgage", () => {
    // £150,000 at 5% over 25 years ≈ £876.89/month (standard amortisation)
    expect(calculateMonthlyPayment(150000, 5, 25)).toBeCloseTo(876.89, 1);
  });

  it("calculates correct monthly repayment for a short-term loan", () => {
    // £50,000 at 3% over 5 years ≈ £898.43/month (standard amortisation)
    expect(calculateMonthlyPayment(50000, 3, 5)).toBeCloseTo(898.43, 1);
  });

  it("increases payment when interest rate increases", () => {
    const low = calculateMonthlyPayment(200000, 2, 25);
    const high = calculateMonthlyPayment(200000, 6, 25);
    expect(high).toBeGreaterThan(low);
  });

  it("increases payment when term decreases", () => {
    const long = calculateMonthlyPayment(200000, 4, 30);
    const short = calculateMonthlyPayment(200000, 4, 15);
    expect(short).toBeGreaterThan(long);
  });
});

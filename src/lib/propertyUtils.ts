import { Tables } from "@/integrations/supabase/types";
import { differenceInDays } from "date-fns";

export type Property = Tables<"properties">;

/**
 * Calculate "Sold in X days/weeks" text from created_at to sold_at
 */
export const getSoldInText = (createdAt: string, soldAt: string | null): string | null => {
  if (!soldAt) return null;
  
  const days = differenceInDays(new Date(soldAt), new Date(createdAt));
  
  if (days === 0) return "Same day!";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week";
  if (weeks < 4) return `${weeks} weeks`;
  
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""}`;
};

export const strategyLabels: Record<string, string> = {
  cash_roi: "Cash ROI",
  brrr: "BRRR",
  leveraged: "Leveraged",
  capital_growth: "Capital Growth",
  hands_on: "Hands On",
  hands_off: "Hands Off",
  btl: "Buy-to-Let",
  social_housing: "Social Housing",
};

export const strategyColors: Record<string, string> = {
  cash_roi: "bg-emerald-100 text-emerald-700",
  brrr: "bg-blue-100 text-blue-700",
  leveraged: "bg-purple-100 text-purple-700",
  capital_growth: "bg-amber-100 text-amber-700",
  hands_on: "bg-orange-100 text-orange-700",
  hands_off: "bg-sky-100 text-sky-700",
  btl: "bg-rose-100 text-rose-700",
  social_housing: "bg-teal-100 text-teal-700",
};

export const propertyTypeLabels: Record<string, string> = {
  terraced: "Terraced",
  semi_detached: "Semi-Detached",
  detached: "Detached",
  flat: "Flat",
  bungalow: "Bungalow",
  commercial: "Commercial",
  land: "Land",
  hmo: "HMO",
  other: "Other",
};

export const listingStatusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  under_offer: "Under Offer",
  sold: "Sold",
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatYield = (percentage: number | null): string => {
  if (percentage === null) return "—";
  return `${percentage.toFixed(1)}%`;
};

/**
 * Calculate monthly mortgage payment using standard amortization formula
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) return principal / numPayments;

  const payment =
    principal *
    ((monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1));

  return payment;
};

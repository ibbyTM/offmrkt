import { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;

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
  return `${(percentage / 100).toFixed(1)}%`;
};

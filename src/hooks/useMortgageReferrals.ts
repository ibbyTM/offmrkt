import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type MortgageReferral = Tables<"mortgage_referrals">;

export interface MortgageReferralFilters {
  timeline?: string;
  minBudget?: number;
  maxBudget?: number;
  hasAip?: boolean | null;
  experience?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const useMortgageReferrals = (filters?: MortgageReferralFilters, enabled = true) => {
  return useQuery({
    queryKey: ["admin-mortgage-referrals", filters],
    enabled,
    queryFn: async () => {
      let query = supabase
        .from("mortgage_referrals")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.timeline) {
        query = query.eq("purchase_timeline", filters.timeline);
      }

      if (filters?.minBudget !== undefined && filters.minBudget > 0) {
        query = query.gte("min_budget", filters.minBudget);
      }

      if (filters?.maxBudget !== undefined && filters.maxBudget > 0) {
        query = query.lte("max_budget", filters.maxBudget);
      }

      if (filters?.hasAip !== null && filters?.hasAip !== undefined) {
        query = query.eq("mortgage_approved", filters.hasAip);
      }

      if (filters?.experience) {
        query = query.eq("investment_experience", filters.experience);
      }

      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom.toISOString());
      }

      if (filters?.dateTo) {
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte("created_at", endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MortgageReferral[];
    },
  });
};

export const exportReferralsToCSV = (referrals: MortgageReferral[]) => {
  const headers = [
    "Date",
    "Name",
    "Email",
    "Phone",
    "Budget Min",
    "Budget Max",
    "Cash Available",
    "Timeline",
    "Has AIP",
    "Experience",
    "Properties Owned",
    "Funding Source",
    "Needs Broker",
    "Referrer URL",
  ];

  const rows = referrals.map((r) => [
    r.created_at ? new Date(r.created_at).toLocaleDateString("en-GB") : "",
    r.investor_name || "",
    r.investor_email || "",
    r.investor_phone || "",
    r.min_budget?.toString() || "",
    r.max_budget?.toString() || "",
    r.cash_available || "",
    r.purchase_timeline || "",
    r.mortgage_approved ? "Yes" : r.mortgage_approved === false ? "No" : "",
    r.investment_experience || "",
    r.properties_owned?.toString() || "",
    r.funding_source || "",
    r.needs_mortgage_broker ? "Yes" : r.needs_mortgage_broker === false ? "No" : "",
    r.referrer_url || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `mortgage-leads-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

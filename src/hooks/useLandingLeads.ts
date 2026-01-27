import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface LandingLead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  interest_type: string | null;
  referrer_url: string | null;
  created_at: string;
}

export interface LeadFilters {
  interestType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export function useLandingLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: ["admin-landing-leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("landing_leads")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply interest type filter
      if (filters.interestType && filters.interestType !== "all") {
        query = query.eq("interest_type", filters.interestType);
      }

      // Apply date range filters
      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt("created_at", endDate.toISOString());
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as LandingLead[];
    },
  });
}

export function exportLeadsToCSV(leads: LandingLead[]) {
  const headers = ["Date", "Full Name", "Email", "Phone", "Interest Type", "Referrer URL"];
  
  const rows = leads.map((lead) => [
    format(new Date(lead.created_at), "yyyy-MM-dd HH:mm"),
    lead.full_name,
    lead.email,
    lead.phone || "",
    lead.interest_type || "",
    lead.referrer_url || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

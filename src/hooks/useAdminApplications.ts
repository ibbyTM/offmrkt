import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

export type InvestorApplication = Tables<"investor_applications"> & {
  profile?: {
    full_name: string;
    email: string;
    phone: string | null;
  };
};

export type ApplicationStatus = "pending" | "approved" | "rejected";

export const useAdminApplications = (statusFilter?: ApplicationStatus) => {
  return useQuery({
    queryKey: ["admin-applications", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("investor_applications")
        .select(`
          *,
          profile:profiles!investor_applications_user_id_fkey(full_name, email, phone)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to flatten the profile
      return (data || []).map((app) => ({
        ...app,
        profile: Array.isArray(app.profile) ? app.profile[0] : app.profile,
      })) as InvestorApplication[];
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
      adminNotes,
    }: {
      applicationId: string;
      status: ApplicationStatus;
      adminNotes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("investor_applications")
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq("id", applicationId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast({
        title: "Application Updated",
        description: `Application has been ${variables.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
      console.error("Error updating application:", error);
    },
  });
};

export const useIsAdmin = () => {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }

      return !!data;
    },
  });
};

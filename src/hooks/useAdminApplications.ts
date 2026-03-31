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

export const useAdminApplications = (statusFilter?: ApplicationStatus, enabled = true) => {
  return useQuery({
    queryKey: ["admin-applications", statusFilter],
    enabled,
    queryFn: async () => {
      // Fetch applications
      let query = supabase
        .from("investor_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data: applications, error: appError } = await query;
      if (appError) throw appError;

      if (!applications || applications.length === 0) {
        return [] as InvestorApplication[];
      }

      // Fetch profiles for these users
      const userIds = applications.map(app => app.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, phone")
        .in("user_id", userIds);

      if (profileError) throw profileError;

      // Create a map for quick lookup
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Combine the data
      return applications.map((app) => ({
        ...app,
        profile: profileMap.get(app.user_id) || undefined,
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
      recipientEmail,
      recipientName,
    }: {
      applicationId: string;
      status: ApplicationStatus;
      adminNotes?: string;
      recipientEmail?: string;
      recipientName?: string;
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

      // Send status email
      if (recipientEmail && (status === "approved" || status === "rejected")) {
        const templateName = status === "approved" ? "application-approved" : "application-rejected";
        const firstName = recipientName?.split(" ")[0] || "Investor";

        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName,
            recipientEmail,
            idempotencyKey: `app-${status}-${applicationId}`,
            templateData: { name: firstName },
          },
        });
      }
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

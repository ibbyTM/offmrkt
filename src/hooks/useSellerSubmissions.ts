import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, Enums } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

export type SellerSubmission = Tables<"seller_submissions">;
export type SubmissionStatus = Enums<"submission_status">;

export const useSellerSubmissions = (statusFilter?: SubmissionStatus) => {
  return useQuery({
    queryKey: ["seller-submissions", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("seller_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("admin_status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SellerSubmission[];
    },
  });
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      status,
      adminNotes,
    }: {
      submissionId: string;
      status: SubmissionStatus;
      adminNotes?: string;
    }) => {
      const { error } = await supabase
        .from("seller_submissions")
        .update({
          admin_status: status,
          admin_notes: adminNotes,
        })
        .eq("id", submissionId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seller-submissions"] });
      toast({
        title: "Submission Updated",
        description: `Property submission has been ${variables.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive",
      });
      console.error("Error updating submission:", error);
    },
  });
};

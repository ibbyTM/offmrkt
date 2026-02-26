import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type SellerSubmission = Tables<"seller_submissions">;

export function useUserSubmissions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["user-submissions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("seller_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SellerSubmission[];
    },
    enabled: !!user,
  });

  const updateSubmission = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"seller_submissions"> }) => {
      const { data, error } = await supabase
        .from("seller_submissions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property submission updated successfully");
    },
    onError: (error) => {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    },
  });

  const deleteSubmission = useMutation({
    mutationFn: async (id: string) => {
      // First delete any linked property to avoid foreign key constraint
      const { error: propError } = await supabase
        .from("properties")
        .delete()
        .eq("submission_id", id);

      if (propError) throw propError;

      const { error } = await supabase
        .from("seller_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-submissions"] });
      toast.success("Property submission deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    },
  });

  return {
    submissions,
    isLoading,
    updateSubmission,
    deleteSubmission,
  };
}

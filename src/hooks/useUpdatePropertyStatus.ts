import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ListingStatus = Database["public"]["Enums"]["listing_status"];

interface UpdateStatusParams {
  propertyId: string;
  status: ListingStatus;
}

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, status }: UpdateStatusParams) => {
      const updates: {
        listing_status: ListingStatus;
        updated_at: string;
        sold_at: string | null;
      } = {
        listing_status: status,
        updated_at: new Date().toISOString(),
        // Set sold_at when marking as sold, clear it otherwise
        sold_at: status === "sold" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("properties")
        .update(updates)
        .eq("id", propertyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Status Updated",
        description: `Property marked as ${variables.status.replace("_", " ")}.`,
      });
    },
    onError: (error) => {
      console.error("Failed to update property status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update property status.",
        variant: "destructive",
      });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/lib/propertyUtils";
import { toast } from "@/hooks/use-toast";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async (): Promise<Property[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("listing_status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async (): Promise<Property | null> => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdatePropertyContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      content,
    }: {
      propertyId: string;
      content: { title: string; description: string; highlights: string[] };
    }) => {
      const { data, error } = await supabase
        .from("properties")
        .update({
          title: content.title,
          property_description: content.description,
          investment_highlights: content.highlights,
          updated_at: new Date().toISOString(),
        })
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
        title: "Content Updated",
        description: "Property content has been enhanced with AI.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update property content.",
        variant: "destructive",
      });
    },
  });
}

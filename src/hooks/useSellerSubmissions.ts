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

export interface EnhancedContent {
  title: string;
  description: string;
  highlights: string[];
}

export const useConvertToListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submission,
      enhancedContent,
    }: {
      submission: SellerSubmission;
      enhancedContent?: EnhancedContent;
    }) => {
      // Check if a property already exists for this submission
      const { data: existingProperty } = await supabase
        .from("properties")
        .select("id")
        .eq("submission_id", submission.id)
        .maybeSingle();

      if (existingProperty) {
        // Property already exists - just update submission status to "listed"
        // The sync_submission_to_property trigger will handle syncing the updates
        const { error: updateError } = await supabase
          .from("seller_submissions")
          .update({ admin_status: "listed" })
          .eq("id", submission.id);

        if (updateError) throw updateError;
        return existingProperty;
      }

      // Generate title - use enhanced if available, otherwise default
      const defaultTitle = `${submission.bedrooms || ""} Bed ${submission.property_type.replace("_", " ")} in ${submission.property_city}`.trim();
      const title = enhancedContent?.title || defaultTitle;
      
      // Use enhanced description if available
      const description = enhancedContent?.description || submission.property_description;
      
      // Use enhanced highlights if available
      const highlights = enhancedContent?.highlights || null;

      // No existing property - create new listing
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          title,
          property_address: submission.property_address,
          property_city: submission.property_city,
          property_postcode: submission.property_postcode,
          property_type: submission.property_type,
          property_description: description,
          asking_price: submission.asking_price,
          bedrooms: submission.bedrooms,
          bathrooms: submission.bathrooms,
          current_status: submission.current_status,
          epc_rating: submission.epc_rating,
          has_epc: submission.has_epc,
          has_gas_safety: submission.has_gas_safety,
          has_eicr: submission.has_eicr,
          has_floor_plans: submission.has_floor_plans,
          photo_urls: submission.photo_urls,
          current_rental_income: submission.current_monthly_rent,
          estimated_rental_income: submission.estimated_monthly_rent,
          listing_status: "available",
          submission_id: submission.id,
          investment_highlights: highlights,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Note: The database trigger 'trigger_auto_list_on_property_insert' 
      // automatically sets admin_status = 'listed' when property is created

      return property;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seller-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      
      const message = variables.enhancedContent
        ? "Property has been published with AI-enhanced content."
        : "Property has been published and is now live.";
      
      toast({
        title: "Listing Created",
        description: message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create property listing.",
        variant: "destructive",
      });
      console.error("Error converting to listing:", error);
    },
  });
};

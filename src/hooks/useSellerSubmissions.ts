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

export const useConvertToListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: SellerSubmission) => {
      // Create the property listing from the submission
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert({
          title: `${submission.bedrooms || ""} Bed ${submission.property_type.replace("_", " ")} in ${submission.property_city}`.trim(),
          property_address: submission.property_address,
          property_city: submission.property_city,
          property_postcode: submission.property_postcode,
          property_type: submission.property_type,
          property_description: submission.property_description,
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
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Update submission status to listed
      const { error: updateError } = await supabase
        .from("seller_submissions")
        .update({ admin_status: "listed" })
        .eq("id", submission.id);

      if (updateError) throw updateError;

      return property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Listing Created",
        description: "Property has been published and is now live.",
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

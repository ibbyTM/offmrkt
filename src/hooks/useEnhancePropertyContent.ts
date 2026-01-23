import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PropertyData {
  property_address: string;
  property_city: string;
  property_postcode?: string;
  property_type: string;
  property_description?: string;
  asking_price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  current_status?: string;
  current_monthly_rent?: number | null;
  estimated_monthly_rent?: number | null;
  epc_rating?: string | null;
  investment_strategies?: string[];
}

export interface EnhancedContent {
  title: string;
  description: string;
  highlights: string[];
}

export const useEnhancePropertyContent = () => {
  return useMutation({
    mutationFn: async (propertyData: PropertyData): Promise<EnhancedContent> => {
      const { data, error } = await supabase.functions.invoke("enhance-property-content", {
        body: propertyData,
      });

      if (error) {
        throw new Error(error.message || "Failed to enhance content");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as EnhancedContent;
    },
    onError: (error: Error) => {
      const message = error.message;
      
      if (message.includes("Rate limit")) {
        toast({
          title: "Rate Limited",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        });
      } else if (message.includes("credits")) {
        toast({
          title: "Credits Exhausted",
          description: "AI credits have run out. Please contact support.",
          variant: "destructive",
        });
      } else if (message.includes("Admin access")) {
        toast({
          title: "Access Denied",
          description: "Admin privileges required for AI enhancement.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Enhancement Failed",
          description: message || "Could not enhance property content. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
};

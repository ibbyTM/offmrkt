import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSaveProperty(propertyId: string) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if property is already saved on mount
  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      return;
    }

    const checkIfSaved = async () => {
      const { data } = await supabase
        .from("saved_properties")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .maybeSingle();

      setIsSaved(!!data);
    };

    checkIfSaved();
  }, [user, propertyId]);

  const toggleSave = async () => {
    if (!user) {
      toast.info("Please log in to save properties to your favorites");
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        // Remove from favorites
        const { error } = await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId);

        if (error) {
          toast.error("Failed to remove from favorites");
        } else {
          setIsSaved(false);
          toast.success("Removed from favorites");
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("saved_properties")
          .insert({ user_id: user.id, property_id: propertyId });

        if (error) {
          toast.error("Failed to save property");
        } else {
          setIsSaved(true);
          toast.success("Saved to favorites!");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { isSaved, isLoading, toggleSave };
}

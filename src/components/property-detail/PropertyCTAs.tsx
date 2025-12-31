import { useState, useEffect } from "react";
import { Heart, ShieldCheck, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Property, formatPrice, listingStatusLabels } from "@/lib/propertyUtils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface PropertyCTAsProps {
  property: Property;
}

export default function PropertyCTAs({ property }: PropertyCTAsProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isAvailable = property.listing_status === "available";

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
        .eq("property_id", property.id)
        .maybeSingle();

      setIsSaved(!!data);
    };

    checkIfSaved();
  }, [user, property.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Please log in to save properties to your favorites");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        // Remove from favorites
        const { error } = await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", property.id);

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
          .insert({ user_id: user.id, property_id: property.id });

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
      setIsSaving(false);
    }
  };

  const handleReserve = () => {
    if (!isLoggedIn) {
      toast.info("Please register and verify your account to reserve properties");
      return;
    }
    toast.info("Reservation feature coming soon!");
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
      {/* Price */}
      <div className="text-center mb-6 pb-6 border-b border-border">
        <p className="text-sm text-muted-foreground mb-1">Asking Price</p>
        <p className="text-3xl font-bold text-primary">
          {formatPrice(property.asking_price)}
        </p>
        {property.gross_yield_percentage && (
          <p className="text-sm text-muted-foreground mt-1">
            {(property.gross_yield_percentage / 100).toFixed(1)}% Gross Yield
          </p>
        )}
      </div>

      {/* Status */}
      {!isAvailable && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-center">
          <p className="text-amber-700 dark:text-amber-400 font-medium">
            This property is {listingStatusLabels[property.listing_status].toLowerCase()}
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3">
        {isLoggedIn ? (
          <>
            <Button
              onClick={handleToggleFavorite}
              variant={isSaved ? "default" : "outline"}
              className={cn("w-full", isSaved && "bg-red-500 hover:bg-red-600 text-white")}
              disabled={isSaving}
            >
              <Heart className={cn("mr-2 h-4 w-4", isSaved && "fill-current")} />
              {isSaved ? "Saved to Favorites" : "Save to Favorites"}
            </Button>
            
            {isAvailable && (
              <Button
                onClick={handleReserve}
                className="w-full"
                size="lg"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Reserve with Deposit
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={handleToggleFavorite}
              variant={isSaved ? "default" : "outline"}
              className={cn("w-full", isSaved && "bg-red-500 hover:bg-red-600 text-white")}
              disabled={isSaving}
            >
              <Heart className={cn("mr-2 h-4 w-4", isSaved && "fill-current")} />
              {isSaved ? "Saved to Favorites" : "Save to Favorites"}
            </Button>
            
            <Button
              asChild
              className="w-full"
              size="lg"
            >
              <Link to="/register">
                <UserPlus className="mr-2 h-5 w-5" />
                Register to Reserve
              </Link>
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>

      {/* Trust indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure reservation process</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Verified property details</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Full refund if not satisfied</span>
          </div>
        </div>
      </div>
    </div>
  );
}

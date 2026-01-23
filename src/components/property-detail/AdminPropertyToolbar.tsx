import { useState } from "react";
import { Property } from "@/lib/propertyUtils";
import { useEnhancePropertyContent, PropertyData } from "@/hooks/useEnhancePropertyContent";
import { useUpdatePropertyContent } from "@/hooks/useProperties";
import { EnhanceContentDialog } from "@/components/admin/EnhanceContentDialog";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles } from "lucide-react";

interface AdminPropertyToolbarProps {
  property: Property;
}

export function AdminPropertyToolbar({ property }: AdminPropertyToolbarProps) {
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<{
    title: string;
    description: string;
    highlights: string[];
  } | null>(null);

  const enhanceMutation = useEnhancePropertyContent();
  const updateMutation = useUpdatePropertyContent();

  const handleEnhanceWithAI = async () => {
    const propertyData: PropertyData = {
      property_address: property.property_address,
      property_city: property.property_city,
      property_postcode: property.property_postcode,
      property_type: property.property_type,
      property_description: property.property_description || undefined,
      asking_price: property.asking_price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      current_monthly_rent: property.current_rental_income,
      estimated_monthly_rent: property.estimated_rental_income,
      epc_rating: property.epc_rating,
      investment_strategies: property.strategies || undefined,
    };

    try {
      const result = await enhanceMutation.mutateAsync(propertyData);
      setEnhancedContent(result);
      setShowEnhanceDialog(true);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleApplyEnhancedContent = async (content: {
    title: string;
    description: string;
    highlights: string[];
  }) => {
    await updateMutation.mutateAsync({
      propertyId: property.id,
      content,
    });
    setShowEnhanceDialog(false);
    setEnhancedContent(null);
  };

  const originalContent = {
    title: property.title,
    description: property.property_description || "",
    highlights: property.investment_highlights || [],
  };

  return (
    <>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-800 dark:text-amber-200">
              Admin Controls
            </span>
          </div>
          <Button
            onClick={handleEnhanceWithAI}
            disabled={enhanceMutation.isPending}
            variant="outline"
            className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {enhanceMutation.isPending ? "Enhancing..." : "Enhance with AI"}
          </Button>
        </div>
      </div>

      {enhancedContent && (
        <EnhanceContentDialog
          open={showEnhanceDialog}
          onClose={() => {
            setShowEnhanceDialog(false);
            setEnhancedContent(null);
          }}
          originalContent={originalContent}
          enhancedContent={enhancedContent}
          onApply={handleApplyEnhancedContent}
          isApplying={updateMutation.isPending}
        />
      )}
    </>
  );
}

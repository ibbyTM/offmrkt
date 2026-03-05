import { useState } from "react";
import { Property, listingStatusLabels } from "@/lib/propertyUtils";
import { useEnhancePropertyContent, PropertyData } from "@/hooks/useEnhancePropertyContent";
import { useUpdatePropertyContent } from "@/hooks/useProperties";
import { useUpdatePropertyStatus } from "@/hooks/useUpdatePropertyStatus";
import { EnhanceContentDialog } from "@/components/admin/EnhanceContentDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, Sparkles, Focus, Crosshair } from "lucide-react";
import { FocalPointEditor } from "@/components/admin/FocalPointEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ListingStatus = Database["public"]["Enums"]["listing_status"];

interface AdminPropertyToolbarProps {
  property: Property;
}

const statusOptions: { value: ListingStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "under_offer", label: "Under Offer" },
  { value: "sold", label: "Sold" },
];

export function AdminPropertyToolbar({ property }: AdminPropertyToolbarProps) {
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false);
  const [showFocalPointEditor, setShowFocalPointEditor] = useState(false);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ListingStatus | null>(null);
  const [enhancedContent, setEnhancedContent] = useState<{
    title: string;
    description: string;
    highlights: string[];
  } | null>(null);
  const [isDetectingFocus, setIsDetectingFocus] = useState(false);

  const enhanceMutation = useEnhancePropertyContent();
  const updateMutation = useUpdatePropertyContent();
  const statusMutation = useUpdatePropertyStatus();

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

  const handleStatusChange = (newStatus: ListingStatus) => {
    if (newStatus === "sold") {
      setPendingStatus(newStatus);
      setShowSoldConfirm(true);
    } else {
      statusMutation.mutate({ propertyId: property.id, status: newStatus });
    }
  };

  const confirmSold = () => {
    if (pendingStatus) {
      statusMutation.mutate({ propertyId: property.id, status: pendingStatus });
    }
    setShowSoldConfirm(false);
    setPendingStatus(null);
  };

  const handleDetectFocus = async () => {
    setIsDetectingFocus(true);
    try {
      const { data, error } = await supabase.functions.invoke("detect-focal-point", {
        body: { propertyId: property.id },
      });
      if (error) throw error;
      toast.success(`Focal point set to ${data.x}%, ${data.y}%`);
    } catch (err: any) {
      toast.error(err.message || "Failed to detect focal point");
    } finally {
      setIsDetectingFocus(false);
    }
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
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-700 dark:text-amber-300">Status:</span>
              <Select
                value={property.listing_status}
                onValueChange={(value) => handleStatusChange(value as ListingStatus)}
                disabled={statusMutation.isPending}
              >
                <SelectTrigger className="w-[140px] bg-background border-amber-300 dark:border-amber-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Set Focus (Manual) Button */}
            <Button
              onClick={() => setShowFocalPointEditor(true)}
              variant="outline"
              className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              <Crosshair className="h-4 w-4 mr-2" />
              Set Focus
            </Button>

            {/* Detect Focal Point Button */}
            <Button
              onClick={handleDetectFocus}
              disabled={isDetectingFocus}
              variant="outline"
              className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              <Focus className="h-4 w-4 mr-2" />
              {isDetectingFocus ? "Detecting..." : "Detect Focus"}
            </Button>

            {/* Enhance with AI Button */}
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
      </div>

      {/* Sold Confirmation Dialog */}
      <AlertDialog open={showSoldConfirm} onOpenChange={setShowSoldConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Property as Sold?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the property as sold and record today's date as the sale date. 
              The property will no longer appear in public listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSold}>
              Confirm Sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhance Content Dialog */}
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
      {/* Manual Focal Point Editor */}
      <FocalPointEditor
        open={showFocalPointEditor}
        onClose={() => setShowFocalPointEditor(false)}
        property={property}
      />
    </>
  );
}

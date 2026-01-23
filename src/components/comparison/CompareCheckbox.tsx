import * as React from "react";
import { Check, Plus } from "lucide-react";
import { useComparison } from "@/contexts/ComparisonContext";
import { cn } from "@/lib/utils";

interface CompareCheckboxProps {
  propertyId: string;
  className?: string;
}

export const CompareCheckbox = React.forwardRef<HTMLButtonElement, CompareCheckboxProps>(
  ({ propertyId, className }, ref) => {
    const { isSelected, toggleProperty, canAddMore } = useComparison();
    const selected = isSelected(propertyId);
    const disabled = !selected && !canAddMore;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        toggleProperty(propertyId);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
          selected
            ? "bg-primary text-primary-foreground"
            : disabled
            ? "bg-muted/80 text-muted-foreground cursor-not-allowed"
            : "bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground",
          className
        )}
      >
        {selected ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Selected</span>
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" />
            <span>Compare</span>
          </>
        )}
      </button>
    );
  }
);
CompareCheckbox.displayName = "CompareCheckbox";

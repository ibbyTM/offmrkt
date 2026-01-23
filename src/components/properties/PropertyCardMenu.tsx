import { Heart, Share2, Flag, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSaveProperty } from "@/hooks/useSaveProperty";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PropertyCardMenuProps {
  propertyId: string;
}

export function PropertyCardMenu({ propertyId }: PropertyCardMenuProps) {
  const { isSaved, isLoading, toggleSave } = useSaveProperty(propertyId);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${propertyId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Thank you for your feedback. We'll review this listing.");
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
          aria-label="Property options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-popover border border-border shadow-lg z-50"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem 
          onClick={handleSave}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Heart 
            className={cn(
              "mr-2 h-4 w-4",
              isSaved && "fill-current text-red-500"
            )} 
          />
          {isSaved ? "Remove from Saved" : "Save Property"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleShare}
          className="cursor-pointer"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleReport}
          className="cursor-pointer"
        >
          <Flag className="mr-2 h-4 w-4" />
          Report Listing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

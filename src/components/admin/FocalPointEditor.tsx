import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/lib/propertyUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crosshair } from "lucide-react";
import { toast } from "sonner";

interface FocalPointEditorProps {
  open: boolean;
  onClose: () => void;
  property: Property;
}

function parseFocalPoint(fp: unknown): { x: number; y: number } {
  if (fp && typeof fp === "object" && "x" in (fp as any) && "y" in (fp as any)) {
    return { x: Number((fp as any).x), y: Number((fp as any).y) };
  }
  return { x: 50, y: 50 };
}

export function FocalPointEditor({ open, onClose, property }: FocalPointEditorProps) {
  const initial = parseFocalPoint(property.cover_focal_point);
  const [point, setPoint] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const imageUrl = property.photo_urls?.[0];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      setPoint({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("properties")
        .update({ cover_focal_point: point as any, updated_at: new Date().toISOString() })
        .eq("id", property.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(`Focal point set to ${point.x}%, ${point.y}%`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save focal point");
    } finally {
      setIsSaving(false);
    }
  };

  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crosshair className="h-5 w-5" />
            Set Focal Point
          </DialogTitle>
          <DialogDescription>
            Click on the image to set where the crop should focus. The preview card shows how it will look.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Clickable image */}
          <div
            ref={imgRef}
            className="relative w-full cursor-crosshair overflow-hidden rounded-lg border border-border"
            onClick={handleClick}
          >
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
            />
            {/* Crosshair marker */}
            <div
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-1 rounded-full border-2 border-primary" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-primary -translate-y-1/2" />
            </div>
          </div>

          {/* Live preview */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground shrink-0">
              Card preview ({point.x}%, {point.y}%)
            </div>
            <div className="w-48 overflow-hidden rounded-lg border border-border">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${point.x}% ${point.y}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

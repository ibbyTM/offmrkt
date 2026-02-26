import { useState, useRef, useCallback } from "react";
import { Maximize2, FileText, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FloorPlansProps {
  floorPlanUrls: string[];
}

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"]);

function getFileType(url: string): "image" | "pdf" | "unknown" {
  try {
    const pathname = decodeURIComponent(new URL(url).pathname).toLowerCase().trim();
    const ext = pathname.split(".").pop() || "";
    if (ext === "pdf") return "pdf";
    if (IMAGE_EXTENSIONS.has(ext)) return "image";
  } catch {
    // malformed URL – fall through
  }
  return "unknown";
}

export default function FloorPlans({ floorPlanUrls }: FloorPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleImageError = useCallback((url: string) => {
    setFailedImages((prev) => new Set(prev).add(url));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!viewerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // fullscreen not supported
    }
  }, []);

  // Listen for fullscreen exit via Escape
  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement) setIsFullscreen(false);
  }, []);

  if (floorPlanUrls.length === 0) return null;

  const resolveType = (url: string): "image" | "document" => {
    if (failedImages.has(url)) return "document";
    const ft = getFileType(url);
    return ft === "image" ? "image" : "document";
  };

  return (
    <>
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Floor Plans</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {floorPlanUrls.map((url, index) => {
            const type = resolveType(url);
            return type === "document" ? (
              <div
                key={index}
                onClick={() => setSelectedPlan(url)}
                className="flex flex-col items-center justify-center gap-3 h-48 bg-muted rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <FileText className="h-12 w-12 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  View Floor Plan {floorPlanUrls.length > 1 ? index + 1 : ""}
                </span>
              </div>
            ) : (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setSelectedPlan(url)}
              >
                <img
                  src={url}
                  alt={`Floor Plan ${index + 1}`}
                  className="w-full h-48 object-contain bg-muted rounded-lg"
                  onError={() => handleImageError(url)}
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors rounded-lg flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    View Full Size
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!selectedPlan}
        onOpenChange={(open) => {
          if (!open) {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
            setSelectedPlan(null);
            setIsFullscreen(false);
          }
        }}
      >
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between shrink-0">
            <DialogTitle>Floor Plan</DialogTitle>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="mr-8">
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 mr-2" />
              ) : (
                <Maximize2 className="h-4 w-4 mr-2" />
              )}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </DialogHeader>

          <div
            ref={(el) => {
              (viewerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              if (el) {
                el.onfullscreenchange = handleFullscreenChange;
              }
            }}
            className="flex-1 min-h-0 px-4 pb-4 bg-background"
          >
            {selectedPlan && (
              resolveType(selectedPlan) === "document" ? (
                <iframe
                  src={selectedPlan}
                  title="Floor Plan"
                  className="w-full h-full rounded-lg border-0"
                />
              ) : (
                <img
                  src={selectedPlan}
                  alt="Floor Plan Full Size"
                  className="w-full h-full object-contain"
                  onError={() => handleImageError(selectedPlan)}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

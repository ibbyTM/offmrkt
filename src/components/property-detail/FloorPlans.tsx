import { useState, useRef, useCallback, useEffect } from "react";
import { Maximize2, FileText, Minimize2, RotateCcw } from "lucide-react";
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
const MIN_SCALE = 1;
const MAX_SCALE = 5;

function getFileType(url: string): "image" | "pdf" | "unknown" {
  try {
    const pathname = decodeURIComponent(new URL(url).pathname).toLowerCase().trim();
    const ext = pathname.split(".").pop() || "";
    if (ext === "pdf") return "pdf";
    if (IMAGE_EXTENSIONS.has(ext)) return "image";
  } catch {
    // malformed URL
  }
  return "unknown";
}

function getTouchDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

export default function FloorPlans({ floorPlanUrls }: FloorPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Zoom & pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef(1);

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const isZoomed = scale > 1.05;

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

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement) setIsFullscreen(false);
  }, []);

  // --- Wheel zoom ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => {
      const next = prev - e.deltaY * 0.002;
      return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    });
  }, []);

  // --- Touch pinch ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getTouchDistance(e.touches[0], e.touches[1]);
      pinchStartScale.current = scale;
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const ratio = dist / pinchStartDist.current;
      const next = pinchStartScale.current * ratio;
      setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    pinchStartDist.current = null;
  }, []);

  // --- Pointer pan ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [scale, translate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTranslate({
      x: translateStart.current.x + dx / scale,
      y: translateStart.current.y + dy / scale,
    });
  }, [scale]);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Reset zoom when plan changes or dialog closes
  useEffect(() => {
    resetZoom();
  }, [selectedPlan, resetZoom]);

  if (floorPlanUrls.length === 0) return null;

  const resolveType = (url: string): "image" | "document" => {
    if (failedImages.has(url)) return "document";
    const ft = getFileType(url);
    return ft === "image" ? "image" : "document";
  };

  const isImage = selectedPlan ? resolveType(selectedPlan) === "image" : false;

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
            <div className="flex items-center gap-2 mr-8">
              {isImage && isZoomed && (
                <Button variant="ghost" size="sm" onClick={resetZoom}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Zoom
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 mr-2" />
                ) : (
                  <Maximize2 className="h-4 w-4 mr-2" />
                )}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
            </div>
          </DialogHeader>

          <div
            ref={(el) => {
              (viewerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              if (el) {
                el.onfullscreenchange = handleFullscreenChange;
              }
            }}
            className="flex-1 min-h-0 px-4 pb-4 bg-background overflow-hidden"
          >
            {selectedPlan && (
              resolveType(selectedPlan) === "document" ? (
                <iframe
                  src={selectedPlan}
                  title="Floor Plan"
                  className="w-full h-full rounded-lg border-0"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center select-none"
                  style={{ touchAction: "none", cursor: isZoomed ? "grab" : "default" }}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >
                  <img
                    src={selectedPlan}
                    alt="Floor Plan Full Size"
                    className="max-w-full max-h-full object-contain pointer-events-none"
                    draggable={false}
                    style={{
                      transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
                      transformOrigin: "center center",
                      transition: isPanning.current ? "none" : "transform 0.1s ease-out",
                    }}
                    onError={() => handleImageError(selectedPlan)}
                  />
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

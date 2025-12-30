import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  photos: string[];
  title: string;
}

export default function PropertyGallery({ photos, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasPhotos = photos.length > 0;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!hasPhotos) {
    return (
      <div className="bg-muted rounded-xl h-96 flex flex-col items-center justify-center text-muted-foreground">
        <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">No photos available</p>
        <p className="text-sm">Photos will be added soon</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative rounded-xl overflow-hidden bg-muted">
        <img
          src={photos[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="w-full h-96 object-cover"
        />
        
        {photos.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <img
                src={photo}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-20 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

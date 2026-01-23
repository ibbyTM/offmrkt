import { useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";

interface PropertyCardCarouselProps {
  images: string[];
  alt: string;
}

export function PropertyCardCarousel({ images, alt }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultipleImages = images.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // No images - show placeholder
  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-accent">
        <Building className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Current Image */}
      <img
        src={images[currentIndex]}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Navigation Arrows - visible on hover */}
      {hasMultipleImages && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Clickable Dots */}
      {hasMultipleImages && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={(e) => goToSlide(e, i)}
              className={`h-2 w-2 rounded-full transition-all hover:scale-125 ${
                i === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
          {images.length > 5 && (
            <span className="text-[10px] text-white/80 ml-0.5 drop-shadow">
              +{images.length - 5}
            </span>
          )}
        </div>
      )}
    </>
  );
}

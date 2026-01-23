import { useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardCarouselProps {
  images: string[];
  alt: string;
}

export function PropertyCardCarousel({ images, alt }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const hasMultipleImages = images.length > 1;
  const minSwipeDistance = 50;

  const animateToSlide = (newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating) return;
    setSlideDirection(direction);
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
      setSlideDirection(null);
    }, 150);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && hasMultipleImages) {
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      animateToSlide(newIndex, 'left');
    }
    if (isRightSwipe && hasMultipleImages) {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      animateToSlide(newIndex, 'right');
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    animateToSlide(newIndex, 'right');
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating) return;
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    animateToSlide(newIndex, 'left');
  };

  const goToSlide = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating || index === currentIndex) return;
    const direction = index > currentIndex ? 'left' : 'right';
    animateToSlide(index, direction);
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
    <div
      className="w-full h-full relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Current Image */}
      <img
        src={images[currentIndex]}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-105",
          isAnimating && slideDirection === 'left' && "opacity-0 -translate-x-2",
          isAnimating && slideDirection === 'right' && "opacity-0 translate-x-2",
          !isAnimating && "opacity-100 translate-x-0"
        )}
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
    </div>
  );
}

import { useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardCarouselProps {
  images: string[];
  alt: string;
  focalPoint?: { x: number; y: number } | null;
}

export function PropertyCardCarousel({ images, alt, focalPoint }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  const hasMultipleImages = images.length > 1;
  const minSwipeDistance = 50;

  const animateToSlide = (newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating) return;
    setPrevIndex(currentIndex);
    setNextIndex(newIndex);
    setSlideDirection(direction);
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
      setPrevIndex(null);
      setNextIndex(null);
      setSlideDirection(null);
    }, 300);
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
      className="w-full h-full relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Current/Static Image (when not animating) */}
      {!isAnimating && (
        <img
          src={images[currentIndex]}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          style={currentIndex === 0 && focalPoint ? { objectPosition: `${focalPoint.x}% ${focalPoint.y}%` } : undefined}
        />
      )}

      {/* Outgoing image (slides out) */}
      {isAnimating && prevIndex !== null && (
        <img
          src={images[prevIndex]}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out",
            slideDirection === 'left' && "-translate-x-full",
            slideDirection === 'right' && "translate-x-full"
          )}
        />
      )}

      {/* Incoming image (slides in) */}
      {isAnimating && nextIndex !== null && (
        <img
          src={images[nextIndex]}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out",
            "translate-x-0"
          )}
        />
      )}

      {/* Navigation Arrows - visible on hover */}
      {hasMultipleImages && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 z-10"
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
              className={`h-2.5 w-2.5 rounded-full p-1.5 box-content transition-all hover:scale-125 ${
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

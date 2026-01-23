

## Interactive Image Carousel for Property Cards

### Overview
Transform the static carousel dots on property cards into fully interactive controls, allowing users to browse property images directly from the card without navigating to the detail page.

### Current State vs Proposed

| Current | Proposed |
|---------|----------|
| Static dots (always shows first highlighted) | Clickable dots that switch images |
| Only first image displayed | All images accessible via carousel |
| No navigation arrows | Hover-reveal prev/next arrows |
| Click anywhere goes to detail page | Carousel controls don't trigger navigation |

### Visual Design

```text
┌─────────────────────────────────────┐
│ [☐]                            [⋮] │
│                                     │
│  [◀]    [Property Image]     [▶]   │  ← Arrows appear on hover
│                                     │
│            [●○○○○]                  │  ← Clickable dots
└─────────────────────────────────────┘
```

### Technical Implementation

#### 1. Create PropertyCardCarousel Component

**File:** `src/components/properties/PropertyCardCarousel.tsx` (NEW)

A self-contained image carousel component for property cards:

```typescript
interface PropertyCardCarouselProps {
  images: string[];
  alt: string;
}

export function PropertyCardCarousel({ images, alt }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
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
  
  return (
    <>
      {/* Current Image */}
      <img src={images[currentIndex]} alt={alt} className="..." />
      
      {/* Navigation Arrows (visible on hover) */}
      {images.length > 1 && (
        <>
          <button onClick={goToPrevious} className="...">
            <ChevronLeft />
          </button>
          <button onClick={goToNext} className="...">
            <ChevronRight />
          </button>
        </>
      )}
      
      {/* Clickable Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(i);
              }}
              className={`h-2 w-2 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
```

**Key Features:**
- `useState` for tracking current image index
- `e.preventDefault()` and `e.stopPropagation()` on all controls to prevent card navigation
- Left/right arrows visible on hover (using group-hover)
- Dots clickable to jump to specific images
- Loops around at the ends for seamless navigation
- Limits visible dots to 5 (with +N indicator for more)

#### 2. Update PropertyCard.tsx

Replace the static image and dots with the new carousel component:

```tsx
// Replace lines 39-74 with:
<PropertyCardCarousel 
  images={property.photo_urls || []}
  alt={property.title}
/>
```

The carousel component will handle:
- Displaying the current image
- Navigation arrows (hover-reveal)
- Clickable dots indicator
- Fallback for no images (Building icon)

#### 3. Update FeaturedPropertiesSection.tsx

Apply the same carousel component to the featured property cards on the landing page for consistency.

### File Changes Summary

| File | Change |
|------|--------|
| `src/components/properties/PropertyCardCarousel.tsx` | NEW - Interactive carousel component |
| `src/components/properties/PropertyCard.tsx` | Use PropertyCardCarousel component |
| `src/components/landing/FeaturedPropertiesSection.tsx` | Use PropertyCardCarousel component |

### User Experience Details

**Navigation Arrows:**
- Appear on hover (opacity-0 to opacity-100 transition)
- Positioned at left/right edges of the image
- Semi-transparent background for visibility over any image
- Prevent card click when clicked

**Clickable Dots:**
- Active dot: solid white
- Inactive dots: semi-transparent white (50%)
- Maximum 5 dots shown, with "+N" text if more images exist
- Clicking a dot jumps directly to that image
- Smooth transition between images

**Interaction Boundaries:**
- Clicking arrows or dots does NOT navigate to property detail
- Clicking anywhere else on the card still navigates as expected
- Keyboard navigation not required for cards (available on detail page)

### Result

- Users can preview all property images directly from the grid view
- Reduces friction for quick property browsing
- Matches modern property portal UX patterns
- Consistent behavior across all property cards (main grid + featured)




## Add Swipe Gesture Support to Property Card Carousel

### Overview
Enhance the PropertyCardCarousel component to detect and respond to touch swipe gestures, allowing mobile users to intuitively browse property images by swiping left or right.

### Implementation Approach

We'll implement native touch event handling (no external libraries needed) to keep the bundle size minimal and provide a responsive, lightweight solution.

### Technical Details

#### Touch Gesture Detection Logic

The swipe detection will track:
- **Touch start position** (X coordinate when finger touches)
- **Touch end position** (X coordinate when finger lifts)
- **Swipe threshold** (minimum distance to register as intentional swipe, ~50px)

```text
Swipe Left (→ to ←):  Go to next image
Swipe Right (← to →): Go to previous image
```

#### State Management

New state to track touch interactions:
- `touchStart`: X position where touch began (null when not touching)
- `touchEnd`: X position where touch ended

#### Event Handlers

| Event | Purpose |
|-------|---------|
| `onTouchStart` | Capture starting X position |
| `onTouchMove` | Update current position (for potential visual feedback) |
| `onTouchEnd` | Calculate swipe direction and navigate |

#### Swipe Threshold

A minimum swipe distance of 50 pixels prevents accidental navigation from small touches while still feeling responsive.

### File Changes

| File | Change |
|------|--------|
| `src/components/properties/PropertyCardCarousel.tsx` | Add touch event handlers and swipe detection logic |

### Updated Component Structure

```typescript
export function PropertyCardCarousel({ images, alt }: PropertyCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px) to register as intentional
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && hasMultipleImages) {
      // Swiped left → go to next image
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe && hasMultipleImages) {
      // Swiped right → go to previous image
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  // Existing navigation functions remain unchanged...

  return (
    <div
      className="w-full h-full"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <img src={images[currentIndex]} alt={alt} ... />
      {/* Navigation arrows and dots remain unchanged */}
    </div>
  );
}
```

### User Experience

| Gesture | Result |
|---------|--------|
| Swipe left | Next image (loops to first) |
| Swipe right | Previous image (loops to last) |
| Short touch/tap | No navigation (below threshold) |
| Vertical swipe | Ignored (only horizontal detected) |

### Key Features

- **No external dependencies**: Uses native touch events
- **Minimal threshold**: 50px prevents accidental swipes
- **Horizontal only**: Vertical swipes won't interfere with page scrolling
- **Looping navigation**: Seamlessly wraps around image array
- **Works alongside existing controls**: Dots and arrows still function normally

### Result

Mobile users can now naturally swipe through property images directly on the card, matching the gesture patterns they expect from modern apps like Airbnb and Rightmove.


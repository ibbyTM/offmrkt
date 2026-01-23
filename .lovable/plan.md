

## True Swipe Animation for Property Card Carousel

### Overview
Replace the current fade + subtle slide effect with a genuine swiping animation where images physically slide across the full width of the container, matching the feel of native mobile carousels.

### Current vs Proposed

| Current | Proposed |
|---------|----------|
| Fade out with 8px translate | Full-width slide (100%) |
| Single image fades to next | Old image slides out, new slides in |
| Subtle, minimal movement | Visible directional swipe |

### Visual Effect

```text
Swipe Left (next image):
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  Image 1    │   ──►    │ 1 ──► │ ◄── 2│   ──►    │   Image 2   │
└─────────────┘          └─────────────┘          └─────────────┘
                    (full slide motion)
```

### Technical Approach

Instead of a fade effect, we'll use a **dual-image sliding technique**:
- Show both the current and incoming image
- Slide them together in the swipe direction
- Use `overflow-hidden` on container to clip the animation

### Implementation Details

#### 1. Track Previous Index

Store both the current and previous image indices to render both during transition:

```typescript
const [currentIndex, setCurrentIndex] = useState(0);
const [prevIndex, setPrevIndex] = useState<number | null>(null);
const [isAnimating, setIsAnimating] = useState(false);
const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
```

#### 2. Animation Wrapper

Update the animation function to track the outgoing image:

```typescript
const animateToSlide = (newIndex: number, direction: 'left' | 'right') => {
  if (isAnimating) return;
  setPrevIndex(currentIndex);
  setSlideDirection(direction);
  setIsAnimating(true);
  
  setTimeout(() => {
    setCurrentIndex(newIndex);
    setIsAnimating(false);
    setPrevIndex(null);
    setSlideDirection(null);
  }, 300); // Match transition duration
};
```

#### 3. Render Two Images During Transition

Show both images stacked, then animate them together:

```tsx
<div className="w-full h-full relative overflow-hidden">
  {/* Incoming image (new) */}
  <img
    src={images[isAnimating ? (slideDirection === 'left' ? nextIndex : prevNextIndex) : currentIndex]}
    alt={alt}
    className={cn(
      "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out",
      isAnimating && slideDirection === 'left' && "translate-x-0", // Slides in from right
      isAnimating && slideDirection === 'right' && "translate-x-0", // Slides in from left
      !isAnimating && "translate-x-0"
    )}
    style={{
      transform: isAnimating 
        ? 'translateX(0%)' 
        : slideDirection === 'left' 
          ? 'translateX(100%)' 
          : 'translateX(-100%)'
    }}
  />
  
  {/* Outgoing image (current) */}
  {isAnimating && prevIndex !== null && (
    <img
      src={images[prevIndex]}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
      style={{
        transform: slideDirection === 'left' ? 'translateX(-100%)' : 'translateX(100%)'
      }}
    />
  )}
</div>
```

### Simplified Single-Image Approach

A cleaner alternative using CSS transforms on a single image with keyframe-like states:

```tsx
<div className="w-full h-full relative overflow-hidden">
  <img
    src={images[currentIndex]}
    alt={alt}
    className={cn(
      "w-full h-full object-cover transition-transform duration-300 ease-out",
      isAnimating && slideDirection === 'left' && "-translate-x-full",
      isAnimating && slideDirection === 'right' && "translate-x-full",
      !isAnimating && "translate-x-0"
    )}
  />
</div>
```

This slides the current image fully off-screen, then the new image appears in place.

### Animation Timing

| Property | Value | Purpose |
|----------|-------|---------|
| Duration | 300ms | Visible but snappy |
| Easing | `ease-out` | Natural deceleration |
| Transform | ±100% | Full-width slide |
| Overflow | hidden | Clean edge clipping |

### File Changes

| File | Change |
|------|--------|
| `src/components/properties/PropertyCardCarousel.tsx` | Replace fade animation with full-width slide |

### Key Changes from Current Implementation

1. **Remove opacity transitions** - No more fading
2. **Use `translate-x-full` / `-translate-x-full`** - Full 100% width movement instead of 8px
3. **Add `overflow-hidden`** - Clips images at container edges
4. **Adjust timing** - 300ms for the full slide to be visible

### Result

Images will now visually swipe across the card like a native mobile carousel, providing clear directional feedback that matches user expectations from apps like Instagram, Airbnb, and Tinder.


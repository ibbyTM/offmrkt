
## Animate Property Card Image Transitions

### Overview
Add smooth, eased sliding animations to the property card carousel so image transitions feel polished and controlled rather than instant swaps.

### Animation Approach

We'll implement a **CSS-based sliding transition** using `transform: translateX()` with easing. This approach:
- Uses GPU-accelerated CSS transforms for smooth 60fps animation
- Requires no external animation libraries
- Works seamlessly with existing swipe gestures

### Visual Effect

```text
Current State:           Transition:              End State:
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  Image 1    │   ──►    │ Image 1 │ 2 │   ──►    │   Image 2   │
└─────────────┘          └─────────────┘          └─────────────┘
                         (slides left)
```

### Technical Implementation

#### 1. Update State Management

Add state to track the sliding direction for proper animation:

```typescript
const [isAnimating, setIsAnimating] = useState(false);
const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
```

#### 2. Animation Technique

Use a fade + subtle slide effect which works well for carousels where images can vary significantly:

```typescript
// Trigger animation state before changing index
const animateToSlide = (newIndex: number, direction: 'left' | 'right') => {
  setSlideDirection(direction);
  setIsAnimating(true);
  
  // After brief fade-out, change image and fade-in
  setTimeout(() => {
    setCurrentIndex(newIndex);
    setIsAnimating(false);
  }, 150); // Half the total transition time
};
```

#### 3. CSS Transitions

Apply eased transitions to the image element:

```tsx
<img
  src={images[currentIndex]}
  alt={alt}
  className={cn(
    "w-full h-full object-cover transition-all duration-300 ease-out",
    "group-hover:scale-105",
    isAnimating && slideDirection === 'left' && "opacity-0 -translate-x-2",
    isAnimating && slideDirection === 'right' && "opacity-0 translate-x-2",
    !isAnimating && "opacity-100 translate-x-0"
  )}
/>
```

### Animation Timing

| Property | Value | Purpose |
|----------|-------|---------|
| Duration | 300ms | Feels snappy but visible |
| Easing | `ease-out` | Natural deceleration |
| Opacity | 0 → 1 | Smooth crossfade |
| Transform | ±8px slide | Directional hint |

### File Changes

| File | Change |
|------|--------|
| `src/components/properties/PropertyCardCarousel.tsx` | Add animation state and transition classes |

### Updated Navigation Functions

All navigation methods (arrows, dots, swipe) will use the new animation wrapper:

```typescript
const goToPrevious = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (isAnimating) return; // Prevent rapid clicking
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
```

### Key Features

- **Directional awareness**: Sliding left vs right provides visual context
- **Debounced transitions**: Prevents animation conflicts from rapid clicks
- **GPU-accelerated**: Uses `transform` and `opacity` for smooth performance
- **No external dependencies**: Pure CSS transitions with React state
- **Preserves existing behavior**: Swipe gestures, dots, and arrows all animate consistently

### Result

Image transitions will feel smooth and intentional with a subtle slide and fade effect, matching modern property portal experiences like Airbnb and Rightmove.

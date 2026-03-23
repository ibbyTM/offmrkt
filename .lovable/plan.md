

## Fix Hero Pipeline Flow — Three Targeted Issues

### 1. SVG Dashed Connector Lines with Arrowheads
**Current**: Plain `border-dashed` divs + lucide `ArrowRight` icons between elements.
**Fix**: Replace each connector segment with an inline SVG containing:
- A horizontal dashed line (`stroke: #4F46E5`, `stroke-dasharray: 6 4`, `stroke-width: 1.5`)
- A small filled triangular arrowhead marker at the end (`<marker>` with `<polygon>` fill `#4F46E5`)
- Each SVG is ~40-50px wide, vertically centered with `items-center`

Create a reusable `DashedArrow` component that renders the SVG, used 3 times between the 4 pipeline elements.

### 2. Close the Gap — Pipeline Floats Up
**Current**: `PipelineFlow` has `mt-12` creating dead space below trust line.
**Fix**: Change `mt-12` to `mt-8` (32px) on the `PipelineFlow` wrapper. This pulls the flow diagram snug beneath the trust line within the hero container.

### 3. Market Insight Card — Floating Overlay on Pipeline Panel
**Current**: `FloatingCardMarket` is absolutely positioned at `right-[3%] bottom-[18%]` — sits as a standalone floating card.
**Fix**: Remove `FloatingCardMarket` from the top-level floating cards. Instead, render the Market Insight card *inside* `PipelineFlow`, positioned absolutely relative to the pipeline panel card. Place it overlapping the top-right corner of the pipeline panel with `absolute -top-6 -right-6 rotate-[2deg] z-10`. This creates the stacked card effect.

### File Changed
- `src/components/landing/HeroSection.tsx`


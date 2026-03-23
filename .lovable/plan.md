

## Fix Hero Bottom Gap

The large grey dead space below the pipeline diagram is caused by `min-h-[85vh]` on the hero section. The content doesn't fill 85vh, so Flexbox `justify-center` adds equal padding top and bottom.

### Change — `src/components/landing/HeroSection.tsx`

- Remove `min-h-[85vh]` and `flex flex-col justify-center` from the section element
- The container's existing `py-16 lg:pt-24 lg:pb-10` already controls spacing — no min-height needed
- Result: section shrinks to fit its content, pipeline flow sits ~40px above the logo bar

Single line change on line 309.

### Files Changed
- `src/components/landing/HeroSection.tsx`


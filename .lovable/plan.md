

## DualPathSection — Further Visual Polish

The section already uses solid primary (sell) and dark foreground (buy) backgrounds. Here are meaningful upgrades to push it further:

### Changes

**`src/components/landing/DualPathSection.tsx`**

1. **Hover effects** — Add `hover:scale-[1.02] transition-transform` to each card for the ZooPro-style lift on hover
2. **Stagger animation** — Switch to the standardised `staggerChildren: 0.1` container/child variant pattern used across other landing sections
3. **Sharper heading** — Replace generic "Which describes you best?" with something more direct: "How can we help?"
4. **Check icons** — Replace the `w-1 h-1` dots in the bullet lists with small `Check` icons from lucide for better scannability
5. **Arrow on buy CTA** — Add the same `ArrowRight` hover animation to the "Browse Deals" button for consistency with the sell card

Single file change, purely visual.

### Files Changed
- `src/components/landing/DualPathSection.tsx`


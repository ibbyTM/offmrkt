

## Break the White Wall — Alternating Section Backgrounds

### Problem
Nearly every landing section uses `bg-background` (white). The two that use `bg-muted/30` are barely distinguishable. The page reads as one continuous white surface with no visual rhythm.

### Strategy
Alternate between three background treatments to create clear section breaks:
1. **White** (`bg-background`) — default
2. **Light grey** (`bg-slate-50`) — visible but neutral
3. **Dark** (`bg-slate-900 text-white`) — high impact for key sections

### Section Background Map

```text
Hero            → bg-background (white)
DualPath        → bg-background (white) — already has colored cards
Benefits        → bg-slate-50 (light grey)
FeaturedProps   → bg-background (white) — cards provide contrast
HowItWorks     → bg-slate-900 (dark) — strong visual break
Testimonials    → bg-slate-50 (light grey)
Aftercare       → bg-background (white)
FAQ             → bg-slate-50 (light grey)
Contact         → bg-slate-900 (dark) — pre-footer dark band
Footer          → bg-slate-900 (already dark)
```

This gives a rhythm of: white → white → grey → white → **dark** → grey → white → grey → **dark** → dark

### Changes

**1. `src/components/landing/BenefitsSection.tsx`**
- Change `bg-background` → `bg-slate-50`

**2. `src/components/landing/HowItWorksSection.tsx`**
- Change `bg-muted/30` → `bg-slate-900`
- All text: `text-white`, `text-slate-400` for descriptions
- Step circles: `border-white` with `bg-slate-900`, number text `text-white`
- Connecting line: `bg-slate-700`

**3. `src/components/landing/TestimonialsSection.tsx`**
- Change `bg-background` → `bg-slate-50`

**4. `src/components/landing/FAQSection.tsx`**
- Change `bg-muted/30` → `bg-slate-50` (actually visible now)

**5. `src/components/landing/ContactSection.tsx`**
- Change `bg-background` → `bg-slate-900`
- All text white/slate-300, form inputs get `bg-slate-800 border-slate-700 text-white`
- Contact cards: `bg-slate-800 border-slate-700`
- Map placeholder: `bg-slate-800`
- Flows into the dark footer seamlessly

### Files Changed
- `src/components/landing/BenefitsSection.tsx` — bg-slate-50
- `src/components/landing/HowItWorksSection.tsx` — dark section
- `src/components/landing/TestimonialsSection.tsx` — bg-slate-50
- `src/components/landing/FAQSection.tsx` — bg-slate-50
- `src/components/landing/ContactSection.tsx` — dark section


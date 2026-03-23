

## Hero — Image Background + Trimmed Stats

### Changes

**`src/components/landing/HeroSection.tsx`**

1. **Full-bleed image background** — Add an Unsplash aerial property/cityscape photo as `bg-cover bg-center` with a dark gradient overlay (`from-slate-900/90 via-slate-900/70 to-slate-900/40`). Taller section (`py-24 lg:py-36`).

2. **All text → white** — Headline `text-white`, accent span stays `text-primary`, subtitle `text-white/70`, "I Want to Buy" button gets `border-white/30 text-white hover:bg-white/10`.

3. **Stats grid → glass cards** — `bg-white/10 backdrop-blur-sm border-white/20 text-white`. Accent card stays `bg-primary`.

4. **Remove investor/investment stats** — Drop "1,200+ investors" and "£50M+ Total invested". Keep:
   - `500+` Properties listed
   - `8.5%` Average gross yield (accent)
   - `7 days` Avg time to completion
   - Replace 4th with `£0` Seller fees

5. **Remove trust line** — Delete the "1,200+ investors · £50M+ invested · 8.5% avg yield" text entirely.

6. **Mobile** — Overlay more opaque (`from-slate-900/95`) for readability.

**`src/components/landing/DualPathSection.tsx`**

7. **Bigger cards** — `p-10 md:p-12`, `max-w-5xl`, card titles `text-3xl`.
8. **Richer backgrounds** — Sell: `bg-gradient-to-br from-primary to-primary/80`. Buy: `bg-slate-900 text-white` (replacing `bg-foreground`).
9. **Section bg** — `bg-slate-50` so cards pop.

### Files Changed
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/DualPathSection.tsx`


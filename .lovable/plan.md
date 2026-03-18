

## Add Plus Jakarta Sans Font Pairing

### Changes

**1. `index.html`** — Add Plus Jakarta Sans to the Google Fonts link (line 13):
```
family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700;800
```

**2. `tailwind.config.ts`** — Add a `display` font family:
```ts
fontFamily: {
  sans: ["Inter", "system-ui", "sans-serif"],
  display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
},
```

**3. Apply `font-display` to headings globally** in `src/index.css`:
```css
@layer base {
  h1, h2, h3, h4 {
    font-family: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
  }
}
```

This gives all headings the distinctive geometric display font automatically — no component-level changes needed. Inter stays as the body/UI font.

### Files Changed
- `index.html` — load Plus Jakarta Sans
- `tailwind.config.ts` — add `font-display` utility
- `src/index.css` — apply to h1-h4 globally


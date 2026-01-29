

## Generate "Off The Markets" Logo Concept

Create an AI-powered logo generation feature using the abstract M-as-roof approach with teal/navy brand colors.

---

### Approach

Use Lovable's built-in AI image generation (Gemini) to create logo concepts. I'll build a simple edge function to generate the logo and display the result.

---

### What Will Be Generated

**Design Brief for AI:**
- Abstract "M" letterform shaped like a roof/house silhouette
- Clean, minimal, geometric style
- Teal (#14B8A6) and navy (#1E3A5A) color palette
- Professional typography for "Off The Markets" wordmark
- White/transparent background for versatility
- Modern, sophisticated aesthetic matching premium property investment brand

---

### Files to Create/Update

| File | Purpose |
|------|---------|
| `supabase/functions/generate-logo/index.ts` | Edge function to call Gemini image generation API |
| `src/pages/LogoGenerator.tsx` | Simple page to trigger generation and display results |
| `src/App.tsx` | Add route for the logo generator page |

---

### Implementation Details

**1. Edge Function (generate-logo)**

```typescript
// Uses Lovable AI Gateway with google/gemini-2.5-flash-image
// Prompt engineered for logo design with specific brand requirements
// Returns base64 image data
```

**2. Logo Generator Page**

- Simple UI with a "Generate Logo" button
- Displays generated logo concepts
- Option to download or save preferred design

**3. Generation Prompt**

The AI will be prompted to create:
> "A minimalist logo for 'Off The Markets' property investment brand. The design features an abstract letter M transformed into a roof/house silhouette. Use a sophisticated teal (#14B8A6) and navy (#1E3A5A) color palette. Clean geometric lines, modern sans-serif typography. Professional, premium aesthetic suitable for a luxury property marketplace. White background, vector-style clarity."

---

### Technical Notes

- Uses `google/gemini-2.5-flash-image` model (or Pro for higher quality)
- No API key required - uses Lovable's built-in AI gateway
- Generated images can be downloaded and used as the new logo asset
- Multiple variations can be generated to find the best concept


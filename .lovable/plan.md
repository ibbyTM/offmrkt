

## Fix Floor Plans to Support PDF Files

### Problem
The floor plan for this property was uploaded as a PDF file, but the `FloorPlans` component only renders `<img>` tags, which cannot display PDFs. This results in a broken image icon.

### Solution
Update `FloorPlans.tsx` to detect whether each floor plan URL is a PDF or an image, and render accordingly:
- **Images** (jpg, png, webp, etc.): Continue using `<img>` tags as before
- **PDFs**: Render an `<iframe>` or a styled link/button that opens the PDF in a new tab, with a PDF icon placeholder in the grid

### Changes

**File: `src/components/property-detail/FloorPlans.tsx`**

1. Add a helper function to check if a URL ends with `.pdf`
2. For PDF files in the grid: show a styled card with a FileText icon and "View Floor Plan (PDF)" button that opens in a new tab
3. For PDF files in the lightbox dialog: embed using `<iframe>` or `<object>` for inline viewing, with a fallback "Open in new tab" link
4. For image files: keep existing behavior unchanged (thumbnail + click-to-expand lightbox)

### Technical Detail
- Use `lucide-react` `FileText` icon for the PDF placeholder card
- Detect PDF by checking if the URL string ends with `.pdf` (case-insensitive)
- The lightbox for PDFs will use an `<object>` tag with PDF type for inline viewing, plus a direct download/open link as fallback

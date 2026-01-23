

## AI Auto-Improve Property Titles & Descriptions

### Overview
Create an AI-powered feature that automatically enhances property titles and descriptions to maintain consistency, improve SEO, and create professional, compelling copy across all listings.

### How It Will Work

The system will provide **two modes** of operation:

| Mode | Use Case | When It Runs |
|------|----------|--------------|
| **Manual** | Admin clicks "Enhance with AI" on any property | On-demand from Admin panel |
| **Auto** | AI improves content when a submission is converted to listing | During "Convert to Listing" flow |

### What The AI Will Do

Given raw property data, the AI will generate:

1. **Professional Title** - Concise, attention-grabbing headline
   - Example: "123 Main St, M1" → "High-Yield 3-Bed Terrace in Central Manchester"

2. **Compelling Description** - Well-structured, benefit-focused copy
   - Highlights key investment metrics (yield, location, potential)
   - Maintains consistent tone and format across all properties
   - Includes key facts without fluff

3. **Investment Highlights** - Auto-generate bullet points if empty
   - E.g., "Strong rental demand", "Below market value", "Tenanted from day one"

### User Experience

**For Admins reviewing submissions:**
```text
┌─────────────────────────────────────────────────────┐
│  Property: 45 Oak Lane, Manchester                  │
│  Current Title: "45 Oak Lane"                       │
│  Description: "3 bed house for sale"                │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ✨ Enhance with AI                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  → Generates preview                                │
│  → Admin can approve/edit before saving             │
└─────────────────────────────────────────────────────┘
```

**When converting submission to listing:**
```text
┌─────────────────────────────────────────────────────┐
│  Converting to Listing...                           │
│                                                     │
│  ☐ Auto-enhance title & description with AI        │
│                                                     │
│  [Cancel]                    [Convert to Listing]   │
└─────────────────────────────────────────────────────┘
```

### Technical Implementation

#### 1. New Edge Function: `enhance-property-content`

**File:** `supabase/functions/enhance-property-content/index.ts`

This function will:
- Accept property data (address, city, type, beds, baths, price, yield, strategies, etc.)
- Use Lovable AI (gemini-3-flash-preview) to generate enhanced content
- Return structured JSON with improved title, description, and highlights
- Use tool calling for structured output extraction

**AI Prompt Strategy:**
```text
You are a UK property investment copywriter. Given the property details below,
create professional marketing content that appeals to buy-to-let investors.

Rules:
- Title: Max 60 chars, include key selling point + location
- Description: 100-150 words, structured with investment focus
- Highlights: 3-5 bullet points about investment potential

Property Data:
[property details injected here]
```

**Response Structure (via tool calling):**
```json
{
  "title": "High-Yield 3-Bed Terrace Near University Quarter",
  "description": "Prime investment opportunity in Manchester's...",
  "highlights": [
    "7.2% gross yield with tenanted income",
    "15% below market value",
    "Walking distance to university campus"
  ]
}
```

#### 2. Frontend Hook: `useEnhancePropertyContent`

**File:** `src/hooks/useEnhancePropertyContent.ts`

A React Query mutation hook that:
- Calls the edge function with property data
- Returns loading/error states
- Provides the enhanced content for preview

#### 3. Admin UI: Enhancement Button

**File:** `src/components/admin/SubmissionDetailDialog.tsx` (modify)

Add an "Enhance with AI" button that:
- Shows a sparkle icon (Wand2 from lucide-react)
- Triggers the AI enhancement
- Shows a preview modal with before/after comparison
- Allows admin to approve, edit, or cancel

#### 4. Convert to Listing Enhancement

**File:** `src/hooks/useSellerSubmissions.ts` (modify)

Add optional AI enhancement during conversion:
- Add checkbox option in conversion flow
- If enabled, call enhance function before creating listing
- Use enhanced content in the new property record

### File Changes Summary

| File | Change |
|------|--------|
| `supabase/functions/enhance-property-content/index.ts` | NEW - Edge function for AI content enhancement |
| `supabase/config.toml` | Add function config |
| `src/hooks/useEnhancePropertyContent.ts` | NEW - React hook for calling enhancement |
| `src/components/admin/EnhanceContentDialog.tsx` | NEW - Preview dialog for enhanced content |
| `src/components/admin/SubmissionDetailDialog.tsx` | Add "Enhance with AI" button |
| `src/hooks/useSellerSubmissions.ts` | Add enhancement option to conversion |

### Edge Function: Tool Calling for Structured Output

The function will use Lovable AI's tool calling feature to ensure consistent JSON output:

```typescript
const body = {
  model: "google/gemini-3-flash-preview",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: propertyDataPrompt }
  ],
  tools: [{
    type: "function",
    function: {
      name: "enhance_property_content",
      description: "Generate professional property listing content",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "60 char max title" },
          description: { type: "string", description: "100-150 word description" },
          highlights: { 
            type: "array", 
            items: { type: "string" },
            description: "3-5 investment highlight bullets"
          }
        },
        required: ["title", "description", "highlights"]
      }
    }
  }],
  tool_choice: { type: "function", function: { name: "enhance_property_content" } }
};
```

### Security & Rate Limiting

- Edge function requires admin authentication (verified via JWT claims)
- Rate limit handling (429) with user-friendly error messages
- Credit exhaustion handling (402) with appropriate messaging

### Result

- **Consistent branding** - All properties have professional, uniform copy
- **Time savings** - Admins don't need to write descriptions manually
- **SEO-friendly** - Properly structured titles and descriptions
- **Flexible** - Can be used on-demand or automatically during conversion


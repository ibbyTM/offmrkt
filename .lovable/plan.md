

## Regenerate AI Content for Listed Properties

### Overview
Add the ability for admins to regenerate AI-enhanced titles, descriptions, and highlights on already-listed properties directly from the property detail page. This enables admins to improve listing content at any time, not just during the initial conversion.

### How It Will Work

When an admin views a property detail page, they will see an **admin toolbar** with an "Enhance with AI" button. Clicking it triggers the existing AI enhancement flow, showing a preview dialog where they can review, edit, and apply the improved content.

```text
┌─────────────────────────────────────────────────────────┐
│  Admin Toolbar (only visible to admins)                 │
│  ┌───────────────────┐  ┌───────────────────────────┐  │
│  │ ✨ Enhance with AI │  │ 📝 Edit Property (future) │  │
│  └───────────────────┘  └───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
│                                                         │
│  [Property Gallery]                                     │
│  [Property Details...]                                  │
```

### Technical Implementation

#### 1. Create Property Update Mutation

**File:** `src/hooks/useProperties.ts`

Add a new mutation hook to update property content:

```typescript
export const useUpdatePropertyContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      content,
    }: {
      propertyId: string;
      content: { title: string; description: string; highlights: string[] };
    }) => {
      const { data, error } = await supabase
        .from("properties")
        .update({
          title: content.title,
          property_description: content.description,
          investment_highlights: content.highlights,
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        title: "Content Updated",
        description: "Property content has been enhanced with AI.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update property content.",
        variant: "destructive",
      });
    },
  });
};
```

#### 2. Create Admin Toolbar Component

**File:** `src/components/property-detail/AdminPropertyToolbar.tsx` (NEW)

A toolbar that shows only for admin users with the enhance button:

```typescript
interface AdminPropertyToolbarProps {
  property: Property;
}

export const AdminPropertyToolbar = ({ property }: AdminPropertyToolbarProps) => {
  // Use useIsAdmin hook to check admin status
  // Use useEnhancePropertyContent for AI generation
  // Use useUpdatePropertyContent to save changes
  // Render EnhanceContentDialog for preview/edit
  
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800 dark:text-amber-200">Admin Controls</span>
        </div>
        <Button onClick={handleEnhanceWithAI} disabled={isPending}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isPending ? "Enhancing..." : "Enhance with AI"}
        </Button>
      </div>
    </div>
  );
};
```

#### 3. Integrate Toolbar into Property Detail Page

**File:** `src/pages/PropertyDetail.tsx`

Add the admin toolbar component above the property content:

```typescript
import { AdminPropertyToolbar } from "@/components/property-detail/AdminPropertyToolbar";
import { useIsAdmin } from "@/hooks/useAdminApplications";

// Inside component:
const { data: isAdmin } = useIsAdmin();

// In render, after "Back to Properties" link:
{isAdmin && <AdminPropertyToolbar property={property} />}
```

### File Changes Summary

| File | Change |
|------|--------|
| `src/hooks/useProperties.ts` | Add `useUpdatePropertyContent` mutation hook |
| `src/components/property-detail/AdminPropertyToolbar.tsx` | NEW - Admin toolbar with AI enhance button |
| `src/pages/PropertyDetail.tsx` | Import and render AdminPropertyToolbar for admins |

### User Flow

1. Admin navigates to any property detail page
2. Sees the admin toolbar with "Enhance with AI" button
3. Clicks the button - AI generates improved content
4. Preview dialog shows original vs. enhanced content side-by-side
5. Admin can edit the enhanced content if needed
6. Clicks "Apply Changes" to save to the database
7. Property page updates with new content

### Reusing Existing Components

This implementation maximizes code reuse:
- `useEnhancePropertyContent` - Existing hook for AI generation
- `EnhanceContentDialog` - Existing preview/edit dialog
- `useIsAdmin` - Existing admin check hook

Only new code needed:
- `useUpdatePropertyContent` - Save enhanced content to properties table
- `AdminPropertyToolbar` - Thin wrapper that orchestrates the flow

### Security

- Admin check via `useIsAdmin` hook (existing RLS-backed check)
- Properties table has RLS policy: "Admins can update properties" 
- Edge function `enhance-property-content` already validates admin status via JWT claims

### Result

Admins can improve any listed property's content at any time, ensuring all listings maintain professional, consistent copy that maximizes investor interest.


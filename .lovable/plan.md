

## Add Functional Dropdown Menu to Property Cards

### Overview
Replace the placeholder 3-dot options button with a fully functional dropdown menu providing quick actions: Save Property, Share, and Report.

### Menu Actions

| Action | Description | Behavior |
|--------|-------------|----------|
| **Save Property** | Add/remove from favorites | Toggle save state, requires login |
| **Share** | Copy property link | Copy URL to clipboard |
| **Report** | Flag listing issue | Show toast (placeholder for future) |

### Visual Design

```text
┌─────────────────────────────────┐
│ [☐]              [●●●○○]   [⋮] │ ← Click triggers dropdown
│        [Property Image]        │
│                                │
└────────────────────────────────┘
                              ┌─────────────────┐
                              │ ♡ Save Property │
                              │ 🔗 Share        │
                              │ ⚑ Report        │
                              └─────────────────┘
```

### Technical Implementation

#### 1. Create Reusable Hook for Save Functionality

**File:** `src/hooks/useSaveProperty.ts` (NEW)

Extract the save/unsave logic from PropertyCTAs into a reusable hook so it can be shared between the card dropdown and the detail page.

```typescript
export function useSaveProperty(propertyId: string) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if saved on mount
  useEffect(() => { /* query saved_properties */ }, [user, propertyId]);

  const toggleSave = async () => {
    // Insert or delete from saved_properties
    // Show appropriate toast
  };

  return { isSaved, isLoading, toggleSave };
}
```

#### 2. Create PropertyCardMenu Component

**File:** `src/components/properties/PropertyCardMenu.tsx` (NEW)

A self-contained dropdown menu component for property cards:

```typescript
interface PropertyCardMenuProps {
  property: Property;
}

export function PropertyCardMenu({ property }: PropertyCardMenuProps) {
  const { isSaved, isLoading, toggleSave } = useSaveProperty(property.id);

  const handleShare = () => {
    const url = `${window.location.origin}/properties/${property.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleReport = () => {
    toast.info("Thank you for your feedback. We'll review this listing.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="...">
          <MoreVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem onClick={toggleSave}>
          <Heart className={isSaved ? "fill-current text-red-500" : ""} />
          {isSaved ? "Remove from Saved" : "Save Property"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare}>
          <Share2 />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReport}>
          <Flag />
          Report Listing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### 3. Update PropertyCard.tsx

Replace the placeholder button with the new `PropertyCardMenu` component:

```tsx
// Before (lines 77-86)
<button onClick={(e) => { e.preventDefault(); }}>
  <MoreVertical />
</button>

// After
<PropertyCardMenu property={property} />
```

#### 4. Update PropertyCTAs to Use Shared Hook

Refactor `PropertyCTAs.tsx` to use the new `useSaveProperty` hook instead of inline state management, ensuring consistency across the app.

### File Changes Summary

| File | Change |
|------|--------|
| `src/hooks/useSaveProperty.ts` | NEW - Reusable hook for save/unsave functionality |
| `src/components/properties/PropertyCardMenu.tsx` | NEW - Dropdown menu component |
| `src/components/properties/PropertyCard.tsx` | Import and use PropertyCardMenu |
| `src/components/property-detail/PropertyCTAs.tsx` | Refactor to use useSaveProperty hook |

### Event Handling

The dropdown must prevent the card's Link navigation when clicked:
- Use `e.preventDefault()` and `e.stopPropagation()` on menu trigger
- The Radix DropdownMenu handles this automatically for menu items

### Dropdown Styling

Following the existing dropdown pattern from `src/components/ui/dropdown-menu.tsx`:
- Solid background (`bg-popover`) for visibility
- High z-index to overlay the card
- Proper dark mode support with `text-popover-foreground`
- Smooth animations on open/close

### User Experience

| User State | Save Action |
|------------|-------------|
| Logged in | Toggle save state immediately |
| Not logged in | Show toast prompting to log in |

### Result

- Users can quickly save properties without navigating to the detail page
- Easy sharing via clipboard copy
- Report option for flagging issues (placeholder for future moderation system)
- Consistent save state across cards and detail pages via shared hook


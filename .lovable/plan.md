

## Fix React Ref Forwarding Warnings

### Problem
Two components are causing React console warnings because they don't support ref forwarding:
1. `Badge` - used extensively throughout the app
2. `CompareCheckbox` - used in property cards

These warnings appear on the Properties page whenever property cards are rendered.

### Solution
Update both components to use `React.forwardRef()` so they can properly receive and forward refs.

---

### Files to Modify

#### 1. `src/components/ui/badge.tsx`

**Current code:**
```typescript
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

**Updated code:**
```typescript
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
  }
);
Badge.displayName = "Badge";
```

#### 2. `src/components/comparison/CompareCheckbox.tsx`

**Current code:**
```typescript
export function CompareCheckbox({ propertyId, className }: CompareCheckboxProps) {
  // ...component logic
  return (
    <button onClick={handleClick} disabled={disabled} className={...}>
      {/* button content */}
    </button>
  );
}
```

**Updated code:**
```typescript
export const CompareCheckbox = React.forwardRef<HTMLButtonElement, CompareCheckboxProps>(
  ({ propertyId, className }, ref) => {
    // ...same component logic
    return (
      <button ref={ref} onClick={handleClick} disabled={disabled} className={...}>
        {/* button content */}
      </button>
    );
  }
);
CompareCheckbox.displayName = "CompareCheckbox";
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `badge.tsx` | Wrap component in `React.forwardRef` and pass `ref` to the `<div>` |
| `CompareCheckbox.tsx` | Wrap component in `React.forwardRef` and pass `ref` to the `<button>` |

### Result
- Console warnings will be eliminated
- Components will work correctly with any parent that needs to pass refs
- No visual or functional changes to the UI


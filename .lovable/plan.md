

## Fix: Truncated "Add More" Button on Mobile Compare Page

### Change
**`src/pages/Compare.tsx`** (lines 28-32)

On mobile, show icon-only `+` button; on `md+`, show full "Add More" label:

```tsx
<Button asChild variant="outline" size="sm" className="shrink-0">
  <Link to="/properties">
    <Plus className="h-4 w-4 md:mr-1.5" />
    <span className="hidden md:inline">Add More</span>
  </Link>
</Button>
```

Single file, single change.




## Fix "Add Property" Button on Properties Page

### Problem
The "Add Property" button in the properties toolbar does nothing when clicked because it has no `onClick` handler or navigation link attached.

### Fix

**File: `src/components/properties/PropertiesToolbar.tsx`**

Wrap the "Add Property" button with a React Router `Link` to navigate to `/submit-property` (the existing property submission page).

- Import `Link` from `react-router-dom`
- Change the button to use `asChild` with a `Link` wrapper pointing to `/submit-property`

```tsx
// Before
<Button size="sm" className="h-9">
  <Plus className="mr-2 h-4 w-4" />
  Add Property
</Button>

// After
<Button size="sm" className="h-9" asChild>
  <Link to="/submit-property">
    <Plus className="mr-2 h-4 w-4" />
    Add Property
  </Link>
</Button>
```

This is a single-line change -- no new components or routes needed since `/submit-property` already exists with the `SellerForm`.

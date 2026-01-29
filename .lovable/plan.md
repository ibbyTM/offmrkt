

## Fix "Start Fresh" Functionality in Submit Property Form

Fix the bug where clicking "Start Fresh" doesn't properly clear the draft because the auto-save effects immediately re-save empty values to localStorage.

---

### Root Cause

When `clearDraft()` is called, it removes the draft from localStorage and resets the form. However, two `useEffect` hooks immediately fire:

1. **Form watch subscription** (lines 152-162) - triggers when `form.reset()` changes values
2. **Photos/step effect** (lines 165-173) - triggers when `currentStep` and `photos` change

These effects immediately re-save the empty form state to localStorage, so on the next page load, the draft appears again (with blank values).

---

### Solution

Add a `skipAutoSave` ref flag that prevents the auto-save effects from running during the clear operation.

---

### File to Update

| File | Change |
|------|--------|
| `src/components/seller/SellerForm.tsx` | Add skip flag to prevent auto-save during clear |

---

### Implementation Details

**1. Add a ref to track when auto-save should be skipped:**

```tsx
const skipAutoSaveRef = useRef(false);
```

**2. Update the form watch effect to check the flag:**

```tsx
useEffect(() => {
  const subscription = form.watch((values) => {
    if (skipAutoSaveRef.current) return; // Skip if clearing
    
    const draft: SavedDraft = {
      values: values as SellerFormValues,
      photos,
      currentStep,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  });
  return () => subscription.unsubscribe();
}, [form, photos, currentStep]);
```

**3. Update the photos/step save effect similarly:**

```tsx
useEffect(() => {
  if (skipAutoSaveRef.current) return; // Skip if clearing
  
  const values = form.getValues();
  const draft: SavedDraft = { values, photos, currentStep };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}, [photos, currentStep, form]);
```

**4. Update `clearDraft()` to use the flag:**

```tsx
const clearDraft = () => {
  skipAutoSaveRef.current = true; // Prevent auto-save
  
  localStorage.removeItem(STORAGE_KEY);
  setHasDraft(false);
  setCurrentStep(1);
  setPhotos([]);
  form.reset();
  
  toast({
    title: "Draft cleared",
    description: "Your saved progress has been removed.",
  });
  
  // Re-enable auto-save after a tick (once all effects have run)
  setTimeout(() => {
    skipAutoSaveRef.current = false;
  }, 0);
};
```

---

### Why This Works

- The ref is synchronous and doesn't trigger re-renders
- Setting `skipAutoSaveRef.current = true` before state changes prevents all auto-save effects
- The `setTimeout` with 0ms delay ensures the flag is reset after React has processed all the state updates and effects
- New user input after clearing will properly save as a new draft


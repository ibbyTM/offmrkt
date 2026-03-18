

## Fix: Logo Invisible on Dark Sidebar

The logo image has `brightness-0 invert` applied, making it solid white — invisible against the `bg-slate-900` sidebar background.

### Change
**`src/components/layout/AppSidebar.tsx`** (line 67-70)

Wrap the logo in a white pill container per branding guidelines and remove the `brightness-0 invert` filter:

```tsx
<div className="flex items-center justify-center p-2">
  <Link to="/" className="bg-white rounded-lg px-3 py-1.5">
    <img src={logo} alt="Off The Markets" className="h-6 w-auto" />
  </Link>
</div>
```

Single file, single line change.


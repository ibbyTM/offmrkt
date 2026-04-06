
Goal: remove the “Loading…” dead-end and make the app recover cleanly when auth is slow or fails.

What I found
- The spinner in your screenshot matches `src/pages/Index.tsx` exactly, not the Ad Creatives page.
- `Index.tsx` fully blocks the page while `useAuth().loading` is `true`.
- `AuthContext.tsx` relies on auth bootstrap completing cleanly; if that stalls on the custom domain, the home page can stay stuck forever.
- Admin status is fetched twice: once in `AuthContext` and again via `useIsAdmin()` in `AppSidebar`/`Admin`, which adds unnecessary auth/backend churn.

Implementation plan
1. Harden auth bootstrap in `src/contexts/AuthContext.tsx`
- Wrap initial session loading in safer error handling.
- Ensure `loading` is always cleared, even if auth/session calls fail.
- Add a small fallback timeout/escape hatch so the app never stays in a permanent loading state.
- Keep investor/admin fetches non-blocking after auth resolves.

2. Remove the full-page auth blocker from `src/pages/Index.tsx`
- Render the landing page immediately instead of showing an infinite full-screen loader.
- If a user is authenticated, redirect them to `/properties` once auth resolves.
- This means slow auth no longer traps visitors on a blank loading screen.

3. Use one source of truth for admin state
- Update `src/components/layout/AppSidebar.tsx` to use `useAuth().isAdmin` instead of `useIsAdmin()`.
- Update `src/pages/Admin.tsx` to rely on auth context admin state instead of a second role query.
- This removes duplicated checks and reduces the chance of extra loading loops.

4. Keep Ad Creatives accessible and stable
- Verify `src/pages/AdCreatives.tsx` stays independent of auth-loading spinners except for sidebar rendering.
- If needed, add a lightweight admin guard later, but that is separate from the loading bug.

5. QA to verify the fix
- Test `/` logged out on the custom domain: landing page should appear immediately.
- Test `/` logged in: should redirect to `/properties` once auth resolves.
- Test direct refresh on `/admin/ad-creatives`.
- Test clicking the logo from admin/sidebar back to home.
- Test both preview and published domain behavior.

Technical details
- Files to update:
  - `src/contexts/AuthContext.tsx`
  - `src/pages/Index.tsx`
  - `src/components/layout/AppSidebar.tsx`
  - `src/pages/Admin.tsx`
- Most likely root cause:
  - a blocking home-page loader combined with fragile auth initialization and duplicated admin-role fetching.



## Add Log Out Button to Account Page

### Current State

A logout feature exists in the main **Header** component (visible in the top navigation bar), but it's missing from:

1. **Account Settings tab** (`/dashboard?tab=settings`) - The main account management page
2. **Sidebar footer** - The "Account" link goes to settings but no logout option
3. **Mobile "More" menu** - Has Settings but no logout

This creates an inconsistent experience where users on authenticated pages must scroll up or look for the header to log out.

### Changes

Add a prominent "Log Out" button to the Account Settings page, and also add it to the sidebar footer and mobile bottom nav for easy access.

---

### 1. Account Settings Page

Add a "Log Out" card section at the bottom of the settings tab:

| Before | After |
|--------|-------|
| Profile card only | Profile card + Log Out card |

The log out section will include:
- A warning-styled card with clear "Log Out" button
- Brief description explaining what happens on logout
- Uses the existing `signOut` function from AuthContext

---

### 2. Sidebar Footer

Add a logout button below the existing Account and Help links:

| Current | New |
|---------|-----|
| Account | Account |
| Help | Help |
| | **Log Out** |

---

### 3. Mobile Bottom Nav "More" Menu

Add logout option at the bottom of the "More" sheet:

| Current | New |
|---------|-----|
| Compare (if any) | Compare (if any) |
| Admin (if admin) | Admin (if admin) |
| Settings | Settings |
| Help | Help |
| | **Log Out** |

---

### Files to Modify

| File | Change |
|------|--------|
| `src/pages/Dashboard.tsx` | Add log out card to settings tab with `signOut` functionality |
| `src/components/layout/AppSidebar.tsx` | Add logout button to sidebar footer |
| `src/components/layout/MobileBottomNav.tsx` | Add logout option to "More" menu sheet |

---

### Technical Details

**Dashboard.tsx - Settings Tab Updates:**

```tsx
// Add to imports
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Inside component
const { user, investorStatus, signOut } = useAuth();
const navigate = useNavigate();

const handleSignOut = async () => {
  await signOut();
  navigate("/");
};

// In settings case, add after Profile card:
<Card className="border-0 shadow-sm bg-card border-destructive/20">
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
        <LogOut className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <CardTitle>Sign Out</CardTitle>
        <CardDescription>Log out of your account</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground mb-4">
      You'll need to sign in again to access your dashboard and saved properties.
    </p>
    <Button variant="destructive" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Log Out
    </Button>
  </CardContent>
</Card>
```

**AppSidebar.tsx - Footer Updates:**

```tsx
// Add to imports
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Inside component
const { signOut } = useAuth();
const navigate = useNavigate();

const handleSignOut = async () => {
  await signOut();
  navigate("/");
};

// In SidebarFooter, add after Help:
<SidebarMenuItem>
  <SidebarMenuButton 
    onClick={handleSignOut}
    tooltip="Log Out"
    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
  >
    <LogOut className="h-4 w-4" />
    <span>Log Out</span>
  </SidebarMenuButton>
</SidebarMenuItem>
```

**MobileBottomNav.tsx - More Menu Updates:**

```tsx
// Add to imports
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Inside component
const { signOut } = useAuth();
const navigate = useNavigate();

const handleSignOut = async () => {
  await signOut();
  navigate("/");
  setMoreOpen(false);
};

// In the More sheet, add after Help button:
<Separator className="my-2" />
<button
  onClick={handleSignOut}
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left text-destructive"
>
  <LogOut className="h-5 w-5" />
  <span>Log Out</span>
</button>
```

---

### Visual Result

**Account Settings Page:**
```text
+------------------------------------------+
|  Profile Information                     |
|  [User icon]  Your account details       |
|  ----------------------------------------|
|  Full Name: John Doe                     |
|  Email: john@example.com                 |
|  ----------------------------------------|
|  Investor Status: Approved               |
|  ----------------------------------------|
|  [Edit Profile (Coming Soon)]            |
+------------------------------------------+

+------------------------------------------+
|  Sign Out                                |
|  [Logout icon]  Log out of your account  |
|  ----------------------------------------|
|  You'll need to sign in again to         |
|  access your dashboard and saved         |
|  properties.                             |
|                                          |
|  [Log Out]  (red button)                 |
+------------------------------------------+
```

**Sidebar Footer:**
```text
+-----------------------+
| Account               |
| Help                  |
| Log Out  (subtle red) |
+-----------------------+
```

**Mobile More Menu:**
```text
+-----------------------+
| Compare Properties    |
| Admin Panel           |
| Settings              |
| Help                  |
| ─────────────────── |
| Log Out  (red text)   |
+-----------------------+
```


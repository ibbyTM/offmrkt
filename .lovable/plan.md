

## Card-Based Mobile Views for Admin Tables

Replace horizontal scrolling tables with native card-based layouts on mobile devices for a better user experience.

---

### Summary

Transform data tables into stacked cards on mobile (< 768px) while preserving the full table layout on desktop. This provides a native mobile experience where each row becomes a self-contained card showing key information with an expandable/tap-to-view pattern.

---

### Tables to Convert

| Component | Key Data Points for Cards |
|-----------|--------------------------|
| `LeadsTable.tsx` | Name, Type badge, Date, Email (tap for details) |
| `FunnelAnalyticsTab.tsx` | Funnel name, Sessions, Conversions, Rate, Link |
| `MortgageReferralsTable.tsx` | Investor name, Date, Budget range, AIP status |

---

### Implementation Approach

#### Pattern: Conditional Rendering

Use the existing `useIsMobile` hook to conditionally render either the table (desktop) or cards (mobile):

```text
+----------------------------------+
|  if (isMobile)                   |
|    -> Render <MobileCardView />  |
|  else                            |
|    -> Render <Table />           |
+----------------------------------+
```

---

### Card Design Pattern

Each mobile card will follow this structure:

```text
+----------------------------------------+
| [Badge: Type]              [Date]      |
|----------------------------------------|
| **Primary Info** (Name/Title)          |
| Secondary info (email, phone)          |
|----------------------------------------|
| Key metrics displayed inline           |
| [View Details Button]                  |
+----------------------------------------+
```

---

### File-by-File Changes

#### 1. LeadsTable.tsx

**Mobile Card Structure:**
- Header: Interest type badge + formatted date
- Body: Full name (prominent), email, phone
- Tappable card triggers the existing detail dialog

**Implementation:**
- Import `useIsMobile` hook
- Create `LeadCard` subcomponent for individual lead cards
- Wrap cards in a vertical stack with consistent spacing
- Maintain click-to-view-details behavior

#### 2. FunnelAnalyticsTab.tsx

**Mobile Card Structure:**
- Header: Funnel name + type badge
- Body: Stats row showing Sessions | Conversions | Rate
- Action: External link button to open funnel

**Implementation:**
- Import `useIsMobile` hook
- Create `FunnelCard` subcomponent
- Display key metrics in a compact grid format
- Keep external link action visible

#### 3. MortgageReferralsTable.tsx

**Mobile Card Structure:**
- Header: Investor name + date
- Body: Budget range, Timeline badge, AIP status badge
- Action: View button triggers existing detail dialog

**Implementation:**
- Import `useIsMobile` hook
- Create `ReferralCard` subcomponent
- Use badge components for status indicators
- Maintain click-to-view behavior

---

### Technical Details

#### Shared Card Styling

Cards will use existing UI components:
- `Card` and `CardContent` from shadcn/ui
- `Badge` for status/type indicators
- Consistent padding: `p-4`
- Border and shadow for visual separation
- `hover:bg-muted/50` for tap feedback

#### Mobile Detection

```tsx
import { useIsMobile } from "@/hooks/use-mobile";

export function LeadsTable() {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      {/* Header with filters */}
      
      {isMobile ? (
        <MobileCardList leads={leads} onSelect={handleRowClick} />
      ) : (
        <DesktopTable leads={leads} onRowClick={handleRowClick} />
      )}
    </div>
  );
}
```

#### Card Component Example (LeadsTable)

```tsx
function LeadCard({ lead, onClick }: { lead: LandingLead; onClick: () => void }) {
  const badgeInfo = getInterestTypeBadge(lead.interest_type);
  
  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge className={badgeInfo.className}>{badgeInfo.label}</Badge>
          <span className="text-sm text-muted-foreground">
            {format(new Date(lead.created_at), "dd MMM")}
          </span>
        </div>
        <p className="font-semibold">{lead.full_name}</p>
        <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
        {lead.phone && (
          <p className="text-sm text-muted-foreground">{lead.phone}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### Implementation Order

1. **LeadsTable.tsx** - Simplest structure, good starting point
2. **MortgageReferralsTable.tsx** - Similar pattern to Leads
3. **FunnelAnalyticsTab.tsx** - Stats-focused cards

---

### What Stays the Same

- Desktop table layout (unchanged)
- Filter components and functionality
- Export CSV functionality
- Detail dialogs and their triggers
- Empty states
- Loading skeletons (will also be mobile-optimized)

---

### Benefits

- **No horizontal scrolling** - Content fits naturally on mobile screens
- **Thumb-friendly** - Large tap targets for each card
- **Scannable** - Key information visible at a glance
- **Consistent** - Matches the card-based pattern used in other parts of the app (e.g., ApplicationsTable, SubmissionsTable already use cards)


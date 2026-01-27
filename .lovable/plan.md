

## Add Funnel Analytics Tab to Admin Panel

Add a comprehensive analytics dashboard to the admin panel for tracking funnel performance, including conversion rates, traffic sources, drop-off metrics, and direct links to funnels.

---

### New Files

| File | Purpose |
|------|---------|
| `src/components/admin/FunnelAnalyticsTab.tsx` | Main analytics dashboard component |
| `src/hooks/useFunnelAnalytics.ts` | Hook to fetch and aggregate funnel metrics |

---

### Changes to Existing Files

| File | Change |
|------|--------|
| `src/pages/Admin.tsx` | Add "Funnels" section to sidebar and home cards, import and render FunnelAnalyticsTab |

---

### Component Design: FunnelAnalyticsTab

The dashboard will include:

#### 1. Overview Stats Cards
Four metric cards at the top showing:
- **Total Sessions** - All funnel visitors
- **Total Conversions** - Lead captures + registrations
- **Conversion Rate** - Conversions / Sessions percentage
- **Avg. Steps Completed** - Average funnel progress

#### 2. Funnel Performance Table
Table listing all active funnels with:
- Funnel name with link icon to open funnel in new tab
- Type (seller/investor/onboard)
- Variant
- Sessions count
- Conversions count
- Conversion rate
- "View Funnel" button that opens `/f/{slug}` in new tab

#### 3. Traffic Sources Chart
Bar chart showing top UTM sources:
- utm_source breakdown (Google, Facebook, Direct, etc.)
- Session count per source

#### 4. Drop-off Funnel Visualization
Horizontal bar chart showing:
- Step 1 visitors (100%)
- Step 2 visitors (% of step 1)
- Step 3 visitors (% of step 1)
- Step 4/Conversion (% of step 1)

#### 5. Device Breakdown
Pie chart or stats showing:
- Desktop vs Mobile vs Tablet traffic

#### 6. Recent Conversions List
Simple list of recent conversions with:
- Lead name/email
- Funnel source
- Timestamp
- Conversion type

---

### Data Hook: useFunnelAnalytics

```typescript
interface FunnelAnalytics {
  // Overview metrics
  totalSessions: number;
  totalConversions: number;
  conversionRate: number;
  avgStepsCompleted: number;
  
  // Per-funnel breakdown
  funnels: {
    id: string;
    slug: string;
    name: string;
    type: string;
    variant: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
  }[];
  
  // Traffic sources
  trafficSources: {
    source: string;
    sessions: number;
  }[];
  
  // Step drop-off
  stepDropoff: {
    step: number;
    visitors: number;
    percentage: number;
  }[];
  
  // Device breakdown
  devices: {
    type: string;
    sessions: number;
  }[];
  
  // Recent conversions
  recentConversions: {
    id: string;
    funnelName: string;
    conversionType: string;
    createdAt: string;
  }[];
}
```

The hook will query:
1. `funnel_definitions` - Get all funnels
2. `funnel_sessions` - Aggregate session counts, group by funnel_id, utm_source, device_type
3. `funnel_events` - Count events by step_number for drop-off analysis
4. `funnel_conversions` - Count conversions per funnel, get recent list

---

### Admin.tsx Updates

1. Add `'funnels'` to `AdminSection` type
2. Add funnel icon import: `import { Funnel } from "lucide-react"`
3. Add sidebar menu item for Funnels
4. Add home card for Funnels section
5. Add section case for rendering FunnelAnalyticsTab
6. Import and use the new components

---

### Visual Layout

```text
+--------------------------------------------------+
|  Funnel Analytics                                |
|  Track conversion rates, traffic, and drop-offs  |
+--------------------------------------------------+

+------------+  +------------+  +------------+  +------------+
|  Sessions  |  | Conversions|  | Conv. Rate |  | Avg Steps  |
|    156     |  |     23     |  |   14.7%    |  |    2.3     |
+------------+  +------------+  +------------+  +------------+

+---------------------------------------------------------------+
| FUNNEL PERFORMANCE                                    [Export]|
|---------------------------------------------------------------|
| Funnel            | Type    | Sessions | Conv | Rate | Action |
|-------------------|---------|----------|------|------|--------|
| Quick Cash Offer  | seller  |    89    |  12  | 13%  | [Link] |
| Free Valuation    | seller  |    45    |   8  | 18%  | [Link] |
| Off-Market Deals  | investor|    22    |   3  | 14%  | [Link] |
+---------------------------------------------------------------+

+---------------------------+  +---------------------------+
| TRAFFIC SOURCES           |  | DROP-OFF BY STEP          |
|---------------------------|  |---------------------------|
| ████████████ Google (45)  |  | Step 1 ██████████████ 100%|
| ████████ Facebook (32)    |  | Step 2 ████████████   75% |
| ████ Direct (18)          |  | Step 3 ██████████     60% |
| ██ LinkedIn (8)           |  | Convert████████       48% |
+---------------------------+  +---------------------------+

+---------------------------+
| DEVICE BREAKDOWN          |
|---------------------------|
|  🖥️ Desktop   62%         |
|  📱 Mobile    35%         |
|  📟 Tablet     3%         |
+---------------------------+
```

---

### Technical Details

**FunnelAnalyticsTab.tsx structure:**

```tsx
// Imports
import { useState } from 'react';
import { ExternalLink, Funnel, Users, Target, TrendingUp, Smartphone, Monitor, Tablet, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';

// Component with:
// - Loading skeleton state
// - Error state
// - Empty state (no funnels/sessions yet)
// - Stats cards row
// - Funnel performance table with external link buttons
// - Charts grid (traffic sources, drop-off, devices)
```

**useFunnelAnalytics.ts hook:**

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFunnelAnalytics() {
  return useQuery({
    queryKey: ['funnel-analytics'],
    queryFn: async () => {
      // Fetch all data in parallel
      const [funnelsResult, sessionsResult, eventsResult, conversionsResult] = await Promise.all([
        supabase.from('funnel_definitions').select('*').eq('is_active', true),
        supabase.from('funnel_sessions').select('*'),
        supabase.from('funnel_events').select('*'),
        supabase.from('funnel_conversions').select('*').order('created_at', { ascending: false }).limit(10),
      ]);
      
      // Aggregate and compute metrics
      // ... processing logic
      
      return analytics;
    },
  });
}
```

---

### Direct Funnel Links

Each funnel row will have an "Open" button that:
- Uses the preview URL + `/f/{slug}` path
- Opens in a new tab with `target="_blank" rel="noopener noreferrer"`
- Shows an ExternalLink icon

```tsx
<Button
  variant="outline"
  size="sm"
  asChild
>
  <a
    href={`/f/${funnel.slug}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <ExternalLink className="h-4 w-4 mr-2" />
    Open Funnel
  </a>
</Button>
```

---

### Empty State

When no funnel data exists yet, show an informative empty state:

```text
+------------------------------------------+
|                                          |
|       📊 No funnel data yet              |
|                                          |
|   Start driving traffic to your funnels  |
|   to see analytics here.                 |
|                                          |
|   Quick links to your funnels:           |
|   [Quick Cash] [Free Valuation] [...]    |
|                                          |
+------------------------------------------+
```

This ensures admins can still access and test funnels even before any analytics data exists.


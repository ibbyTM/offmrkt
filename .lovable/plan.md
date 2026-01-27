

## Add Leads Tab to Admin Panel

Add a dedicated "Leads" section to the admin panel for viewing all `landing_leads` submissions (from funnel forms and floating lead capture), with filtering by interest_type/source and date range, plus CSV export.

---

### New Files

| File | Purpose |
|------|---------|
| `src/hooks/useLandingLeads.ts` | Hook to fetch and filter landing_leads with export function |
| `src/components/admin/LeadsTable.tsx` | Main table component with filters, empty state, and detail view |
| `src/components/admin/LeadFilters.tsx` | Filter controls for interest type and date range |
| `src/components/admin/LeadDetailDialog.tsx` | Dialog showing full lead details |

---

### Changes to Existing Files

| File | Change |
|------|--------|
| `src/pages/Admin.tsx` | Add "Leads" to AdminSection type, sidebar, home card, and section rendering |

---

### Data Structure

The `landing_leads` table contains:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| full_name | text | Lead's name |
| email | text | Lead's email |
| phone | text | Phone (optional) |
| interest_type | text | Source/type: "quick-cash", "invest", "buy", "sell", "not_sure" |
| referrer_url | text | Page URL where form was submitted |
| created_at | timestamp | Submission time |

---

### Hook: useLandingLeads.ts

```typescript
interface LeadFilters {
  interestType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// Queries landing_leads table with filters
// Returns leads ordered by created_at descending
// Includes export function for CSV download
```

---

### Component: LeadsTable.tsx

Features:
- Header row with filter toggle and export button
- Collapsible filters panel
- Table columns: Date, Name, Email, Phone, Source/Type, Referrer
- Click row to open detail dialog
- Empty state when no leads

---

### Component: LeadFilters.tsx

Filter controls:
- **Interest Type** - Dropdown with options: All, Seller, Investor, Quick Cash, Free Valuation, etc.
- **Date From** - Date picker
- **Date To** - Date picker
- **Search** - Text input to search by name/email
- **Clear All** - Reset filters button

---

### Component: LeadDetailDialog.tsx

Shows full lead information:
- Name, email, phone
- Interest type with badge
- Full referrer URL
- Created timestamp
- Quick actions: Copy email, Open in new tab

---

### Admin.tsx Updates

1. Add `'leads'` to `AdminSection` type
2. Import `Mail` or `Inbox` icon from lucide-react
3. Add sidebar menu item between "Mortgage Leads" and "Funnels"
4. Add home card for Leads section showing lead count
5. Add section case for rendering LeadsTable
6. Import and fetch lead count for home badge

---

### Visual Layout

```text
+--------------------------------------------------+
|  Leads                                           |
|  View all form submissions from landing pages    |
+--------------------------------------------------+

+----------------------------------+  +-------------+
| [Filters ▼]                      |  | Export CSV  |
+----------------------------------+  +-------------+

Filters (collapsible):
+----------------------------------------------------------+
| Source/Type    | From Date     | To Date     | Search    |
| [All types ▼]  | [Select date] | [Select]    | [______]  |
+----------------------------------------------------------+

Table:
+---------------------------------------------------------------+
| Date        | Name          | Email           | Phone  | Type |
|-------------|---------------|-----------------|--------|------|
| 27 Jan 2026 | John Smith    | john@email.com  | 07xxx  | sell |
| 26 Jan 2026 | Sarah Jones   | sarah@test.com  | —      | invest|
+---------------------------------------------------------------+
```

---

### Empty State

```text
+------------------------------------------+
|                                          |
|        📬 No leads yet                   |
|                                          |
|   Leads will appear here when visitors   |
|   submit forms on your landing pages     |
|   and funnels.                           |
|                                          |
+------------------------------------------+
```

---

### Technical Details

**useLandingLeads.ts:**
- Uses React Query with key `['admin-landing-leads', filters]`
- Applies filters: `interest_type`, date range, search (ilike on name/email)
- Export function creates CSV with all fields

**LeadsTable.tsx:**
- Follows same pattern as `MortgageReferralsTable`
- Uses Collapsible for filter panel
- Uses Table from shadcn/ui
- Dialog for detail view

**Admin.tsx changes:**
- Add to type: `type AdminSection = 'home' | 'applications' | 'crm' | 'submissions' | 'mortgage-leads' | 'leads' | 'funnels';`
- Add hook call: `const { data: leads = [], isLoading: isLoadingLeads } = useLandingLeads();`
- Add sidebar item with Inbox icon
- Add home card showing `{leads.length} leads`

---

### Interest Type Badge Colors

| Type | Color |
|------|-------|
| sell / quick-cash / free-valuation / landlord-exit | Green |
| invest / off-market-deals / high-yield | Blue |
| buy | Purple |
| not_sure | Gray |

---

### Export CSV Columns

1. Date
2. Full Name
3. Email
4. Phone
5. Interest Type
6. Referrer URL


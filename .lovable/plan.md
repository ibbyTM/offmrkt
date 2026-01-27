

## Floating Lead Capture Widget

### Overview

Create a persistent floating widget that stays visible as visitors scroll the landing page. The widget will collect basic contact details (name, email, phone) with an optional "I'm interested in..." dropdown, then store leads in a new database table for follow-up.

### Visual Design

The widget will appear in the bottom-right corner of the screen as a floating card:

```text
+----------------------------------+
|  Get Exclusive Access            |
+----------------------------------+
|  [Full Name                   ]  |
|  [Email Address               ]  |
|  [Phone Number                ]  |
|  [I'm interested in...     v  ]  |
|                                  |
|  [     Get Started    →      ]   |
|                                  |
|  ✓ No spam, ever                 |
+----------------------------------+
```

**Behavior:**
- Fixed position bottom-right with `z-50`
- Minimized state: shows just a floating CTA button
- Expanded state: shows full form
- Uses localStorage to track if user has already submitted (hides after submission)
- Smooth slide-in animation on page load (with 2-second delay)

### Database Schema

Create a new `landing_leads` table to store submissions:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| full_name | text | Required |
| email | text | Required |
| phone | text | Optional |
| interest_type | text | 'investor', 'seller', 'both', 'not_sure' |
| referrer_url | text | Page where form was submitted |
| created_at | timestamptz | Submission time |

**RLS Policies:**
- Public INSERT (no auth required - this is a lead capture form)
- Admin SELECT (only admins can view leads)

### Component Structure

```text
src/components/landing/FloatingLeadCapture.tsx
├── Minimized button (floating CTA)
├── Expanded form card
│   ├── Name input
│   ├── Email input (validated)
│   ├── Phone input (optional)
│   ├── Interest dropdown (optional)
│   └── Submit button
└── Success state (thank you message)
```

### User Flow

1. Visitor lands on page → widget appears after 2s delay (minimized)
2. Click floating button → form expands
3. Fill in details → click "Get Started"
4. Form validates → saves to database
5. Shows success message → collapses after 3s
6. Sets `localStorage.lead_submitted = true` → widget hidden on future visits

### Implementation Steps

| Step | File | Description |
|------|------|-------------|
| 1 | Database migration | Create `landing_leads` table with RLS policies |
| 2 | `src/components/landing/FloatingLeadCapture.tsx` | New floating widget component |
| 3 | `src/pages/Index.tsx` | Add FloatingLeadCapture to landing page |

### Technical Details

**New Component: `FloatingLeadCapture.tsx`**

```tsx
// State management
const [isExpanded, setIsExpanded] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
const [isLoading, setIsLoading] = useState(false);

// Form validation with zod
const leadSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  interest_type: z.enum(["investor", "seller", "both", "not_sure"]).optional()
});

// Check localStorage on mount
useEffect(() => {
  if (localStorage.getItem("lead_submitted")) {
    setIsSubmitted(true);
  }
}, []);

// Submit to Supabase
const handleSubmit = async (data) => {
  await supabase.from("landing_leads").insert({
    ...data,
    referrer_url: window.location.href
  });
  localStorage.setItem("lead_submitted", "true");
  setIsSubmitted(true);
};
```

**Database Migration:**

```sql
CREATE TABLE public.landing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest_type text DEFAULT 'not_sure',
  referrer_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (no auth required)
CREATE POLICY "Anyone can submit leads"
  ON public.landing_leads FOR INSERT
  WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads"
  ON public.landing_leads FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
```

**Integration with Index.tsx:**

```tsx
import { FloatingLeadCapture } from "@/components/landing/FloatingLeadCapture";

// Inside the Layout return, add after Footer:
<FloatingLeadCapture />
```

### Styling

The widget will follow the existing minimal aesthetic:
- White background with subtle border
- Royal blue primary button
- Smooth Framer Motion animations
- Mobile-responsive (full-width on mobile, fixed-width on desktop)
- Safe-area padding for mobile devices

### Future Enhancements (Not in Scope)

- Integration with GoHighLevel webhook for lead notifications
- Admin dashboard section to view/export leads
- A/B testing different form placements


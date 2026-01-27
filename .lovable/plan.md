
## Comprehensive Funnel System Implementation

### Overview

Build a scalable funnel system with reusable components, A/B testing support, subdomain detection, database tracking, and admin analytics. The system will support 10+ funnel variations across seller, investor, and onboarding paths.

---

### Architecture

```text
src/
├── pages/
│   └── funnels/
│       ├── FunnelRouter.tsx           # Subdomain/path detection & routing
│       ├── sell/
│       │   ├── SellFunnelV1.tsx        # "Quick Cash Offer" variant
│       │   ├── SellFunnelV2.tsx        # "Free Valuation" variant
│       │   └── SellFunnelV3.tsx        # "Landlord Exit" variant
│       ├── invest/
│       │   ├── InvestFunnelV1.tsx      # "Off-Market Deals" variant
│       │   └── InvestFunnelV2.tsx      # "High-Yield" variant
│       └── onboard/
│           └── OnboardFunnelV1.tsx     # Streamlined questionnaire
│
├── components/funnels/
│   ├── FunnelLayout.tsx               # Minimal layout (no nav)
│   ├── FunnelHero.tsx                 # Customizable hero section
│   ├── FunnelSteps.tsx                # Multi-step progress indicator
│   ├── FunnelLeadForm.tsx             # Configurable lead capture form
│   ├── FunnelTestimonials.tsx         # Social proof section
│   ├── FunnelBenefits.tsx             # Feature/benefit list
│   ├── FunnelCTA.tsx                  # Call-to-action button
│   ├── FunnelCountdown.tsx            # Urgency timer (optional)
│   └── FunnelExitIntent.tsx           # Exit-intent popup
│
├── hooks/
│   ├── useFunnelTracking.ts           # UTM/source tracking & analytics
│   ├── useFunnelVariant.ts            # A/B variant selection
│   └── useFunnelConversion.ts         # Conversion event logging
│
└── contexts/
    └── FunnelContext.tsx              # Funnel state management
```

---

### Database Schema

#### New Tables

**1. `funnel_definitions` - Stores funnel configurations**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL slug (e.g., "quick-cash") |
| name | text | Admin-friendly name |
| type | enum | "seller", "investor", "onboard" |
| variant | text | A/B variant identifier (e.g., "v1", "v2") |
| is_active | boolean | Whether funnel is live |
| config | jsonb | Hero text, CTA labels, colors, etc. |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

**2. `funnel_sessions` - Tracks visitor sessions**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| funnel_id | uuid | FK to funnel_definitions |
| session_id | text | Anonymous session identifier |
| variant | text | A/B variant shown |
| utm_source | text | Traffic source |
| utm_medium | text | Traffic medium |
| utm_campaign | text | Campaign name |
| utm_content | text | Ad/content identifier |
| referrer_url | text | Original referrer |
| device_type | text | "desktop", "mobile", "tablet" |
| country | text | Geo location (optional) |
| entered_at | timestamp | Session start |
| last_activity_at | timestamp | Last interaction |

**3. `funnel_events` - Tracks user interactions**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | FK to funnel_sessions |
| event_type | text | "page_view", "step_complete", "form_submit", "exit" |
| step_number | integer | Which step (for multi-step funnels) |
| metadata | jsonb | Additional event data |
| created_at | timestamp | Event timestamp |

**4. `funnel_conversions` - Tracks successful conversions**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | FK to funnel_sessions |
| funnel_id | uuid | FK to funnel_definitions |
| conversion_type | text | "lead", "submission", "registration" |
| lead_id | uuid | FK to landing_leads (nullable) |
| submission_id | uuid | FK to seller_submissions (nullable) |
| user_id | uuid | FK to auth.users (nullable) |
| value | integer | Estimated value (optional) |
| created_at | timestamp | Conversion timestamp |

---

### Subdomain Detection Strategy

Since Lovable uses path-based routing, we'll implement a hybrid approach:

**Option A: Path-based with DNS redirects (Recommended)**

```text
sell.offmrkt.com  →  DNS redirect  →  offmrkt.com/f/sell
buy.offmrkt.com   →  DNS redirect  →  offmrkt.com/f/invest
```

**Option B: Hostname detection in App.tsx**

```tsx
// In App.tsx - detect subdomain and render appropriate layout
const hostname = window.location.hostname;
const subdomain = hostname.split('.')[0];

if (subdomain === 'sell') {
  return <FunnelRouter funnelType="seller" />;
}
if (subdomain === 'buy' || subdomain === 'invest') {
  return <FunnelRouter funnelType="investor" />;
}
```

**Implementation: We'll use path-based routing (`/f/:funnelSlug`) with optional subdomain detection.**

---

### Routing Structure

Add to `App.tsx`:

```tsx
// Funnel routes - no auth required, minimal layout
<Route path="/f/:funnelSlug" element={<FunnelRouter />} />
<Route path="/f/:funnelSlug/:step" element={<FunnelRouter />} />
```

The `FunnelRouter` component will:
1. Parse the funnel slug from URL
2. Check subdomain for overrides
3. Load funnel config from database or local config
4. Determine A/B variant
5. Render appropriate funnel page

---

### Component Specifications

#### 1. FunnelLayout.tsx

A minimal, conversion-focused layout with no navigation distractions.

```tsx
interface FunnelLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  backgroundColor?: string;
}
```

Features:
- No header navigation (just logo)
- No footer (or minimal footer)
- Optional progress bar
- Exit-intent detection
- Floating back button (if multi-step)

#### 2. FunnelHero.tsx

Customizable hero section for funnel landing pages.

```tsx
interface FunnelHeroProps {
  headline: string;
  subheadline: string;
  heroImage?: string;
  ctaText: string;
  ctaAction: () => void;
  trustBadges?: string[];
  videoUrl?: string;
}
```

Features:
- A/B testable headline/subheadline
- Optional hero image or video
- Prominent CTA button
- Trust badges row
- Mobile-optimized layout

#### 3. FunnelLeadForm.tsx

Configurable lead capture form that adapts to funnel type.

```tsx
interface FunnelLeadFormProps {
  funnelId: string;
  variant: string;
  fields: FieldConfig[];
  onSuccess: (leadId: string) => void;
  submitLabel?: string;
  showPrivacyNote?: boolean;
}

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "select" | "hidden";
  required: boolean;
  options?: { value: string; label: string }[];
};
```

Features:
- Dynamic field configuration
- Client-side validation with Zod
- UTM parameter capture (hidden fields)
- Progressive profiling support
- Success animation

#### 4. FunnelSteps.tsx

Multi-step funnel progress indicator.

```tsx
interface FunnelStepsProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
  variant?: "horizontal" | "vertical";
}
```

---

### Tracking & Analytics

#### useFunnelTracking Hook

```tsx
interface FunnelTrackingReturn {
  sessionId: string;
  trackEvent: (eventType: string, metadata?: object) => void;
  trackConversion: (conversionType: string, entityId?: string) => void;
  utmParams: UTMParams;
}

// Captures and persists:
// - UTM parameters from URL
// - Session ID (stored in sessionStorage)
// - Device type
// - Referrer URL
// - Timestamp of entry
```

#### useFunnelVariant Hook

```tsx
interface FunnelVariantReturn {
  variant: string;
  isLoading: boolean;
}

// A/B variant selection logic:
// 1. Check URL param (?variant=v2) for forced variant
// 2. Check sessionStorage for existing variant assignment
// 3. If new session, randomly assign based on weights
// 4. Persist assignment to sessionStorage
```

---

### Admin Analytics Dashboard

Add new admin section: "Funnel Analytics"

**Metrics to display:**

| Metric | Description |
|--------|-------------|
| Total Sessions | Unique funnel visitors |
| Conversion Rate | Conversions / Sessions |
| Drop-off by Step | Where users abandon |
| Top Traffic Sources | UTM source breakdown |
| Device Breakdown | Desktop vs Mobile |
| Variant Performance | A/B test results |
| Average Time to Convert | Session duration |

**Visualizations:**
- Funnel visualization (step-by-step drop-off)
- Line chart of conversions over time
- Bar chart of traffic sources
- Variant comparison table

---

### Implementation Phases

#### Phase 1: Foundation (Database + Core Components)

| Task | Files |
|------|-------|
| Create database tables | Migration SQL |
| Create FunnelContext | `src/contexts/FunnelContext.tsx` |
| Create useFunnelTracking | `src/hooks/useFunnelTracking.ts` |
| Create FunnelLayout | `src/components/funnels/FunnelLayout.tsx` |
| Create FunnelHero | `src/components/funnels/FunnelHero.tsx` |
| Create FunnelLeadForm | `src/components/funnels/FunnelLeadForm.tsx` |
| Create FunnelSteps | `src/components/funnels/FunnelSteps.tsx` |
| Create FunnelRouter | `src/pages/funnels/FunnelRouter.tsx` |
| Update App.tsx routes | `src/App.tsx` |

#### Phase 2: Seller Funnels

| Task | Files |
|------|-------|
| Create SellFunnelV1 (Quick Cash) | `src/pages/funnels/sell/SellFunnelV1.tsx` |
| Create SellFunnelV2 (Free Valuation) | `src/pages/funnels/sell/SellFunnelV2.tsx` |
| Create FunnelBenefits component | `src/components/funnels/FunnelBenefits.tsx` |
| Create FunnelTestimonials component | `src/components/funnels/FunnelTestimonials.tsx` |

#### Phase 3: Investor Funnels

| Task | Files |
|------|-------|
| Create InvestFunnelV1 (Off-Market) | `src/pages/funnels/invest/InvestFunnelV1.tsx` |
| Create streamlined registration flow | Integrate with existing auth |
| Create FunnelCTA component | `src/components/funnels/FunnelCTA.tsx` |

#### Phase 4: A/B Testing & Analytics

| Task | Files |
|------|-------|
| Create useFunnelVariant hook | `src/hooks/useFunnelVariant.ts` |
| Create useFunnelConversion hook | `src/hooks/useFunnelConversion.ts` |
| Create FunnelAnalyticsTab (Admin) | `src/components/admin/FunnelAnalyticsTab.tsx` |
| Create conversion charts | Use recharts library |
| Add funnel section to Admin page | `src/pages/Admin.tsx` |

#### Phase 5: Advanced Features

| Task | Files |
|------|-------|
| Create FunnelExitIntent popup | `src/components/funnels/FunnelExitIntent.tsx` |
| Create FunnelCountdown (urgency) | `src/components/funnels/FunnelCountdown.tsx` |
| Add subdomain detection | `src/App.tsx` |
| Create funnel definition CRUD (Admin) | `src/components/admin/FunnelManager.tsx` |

---

### Example Funnel Flow: Seller V1 "Quick Cash Offer"

```text
URL: offmrkt.com/f/quick-cash OR sell.offmrkt.com

Step 1: Landing
+-------------------------------------------------+
|                    [Logo]                       |
|                                                 |
|        Get a Cash Offer in 24 Hours             |
|   No fees. No chains. Complete in 7 days.       |
|                                                 |
|   [Property Type Selector: House/Flat/etc]      |
|                                                 |
|   [Postcode Input: e.g., M1 4AH]               |
|                                                 |
|         [ Get My Free Cash Offer → ]            |
|                                                 |
|   ★★★★★ "Sold in 5 days!" - Sarah, Manchester  |
+-------------------------------------------------+

Step 2: Property Details
+-------------------------------------------------+
|   Step 2 of 4   [======----]                    |
|                                                 |
|   Tell us about your property                   |
|                                                 |
|   Bedrooms: [Dropdown]                          |
|   Condition: [Needs work / Move-in ready]       |
|   Timeline: [ASAP / 1 month / 3 months]         |
|                                                 |
|         [Continue →]        [← Back]            |
+-------------------------------------------------+

Step 3: Your Details
+-------------------------------------------------+
|   Step 3 of 4   [========--]                    |
|                                                 |
|   Where should we send your offer?              |
|                                                 |
|   Full Name: [________________]                 |
|   Email: [________________]                     |
|   Phone: [________________]                     |
|                                                 |
|   [x] I agree to the terms                      |
|                                                 |
|         [Get My Offer →]                        |
+-------------------------------------------------+

Step 4: Confirmation
+-------------------------------------------------+
|                                                 |
|      ✓ Request Received!                        |
|                                                 |
|   We'll call you within 24 hours with           |
|   a cash offer for your property.               |
|                                                 |
|   Ref: #OFF-12345                               |
|                                                 |
|   [View Our Recent Purchases]                   |
+-------------------------------------------------+
```

---

### RLS Policies

**funnel_definitions** (Admin only)
- SELECT: `has_role(auth.uid(), 'admin')`
- INSERT/UPDATE/DELETE: `has_role(auth.uid(), 'admin')`

**funnel_sessions** (Public insert, admin read)
- INSERT: `true` (public)
- SELECT: `has_role(auth.uid(), 'admin')`

**funnel_events** (Public insert, admin read)
- INSERT: `true` (public)
- SELECT: `has_role(auth.uid(), 'admin')`

**funnel_conversions** (Public insert, admin read)
- INSERT: `true` (public)
- SELECT: `has_role(auth.uid(), 'admin')`

---

### Summary

This funnel system provides:

1. **Reusable Components** - Build funnels quickly with pre-built, conversion-optimized components
2. **A/B Testing** - Test variants with automatic traffic splitting and performance tracking
3. **Subdomain Support** - Use `sell.offmrkt.com` or path-based URLs
4. **Full Analytics** - Track sessions, events, conversions, and drop-offs
5. **Admin Dashboard** - View performance metrics and manage funnel configurations
6. **Scalability** - Easily create 10+ funnel variations without code duplication

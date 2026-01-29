

## Rebrand from "OffMrkt" to "Off The Markets"

Update all branding references throughout the application from "OffMrkt" to "Off The Markets".

---

### Summary of Changes

| Area | Current | New |
|------|---------|-----|
| Brand Name | OffMrkt | Off The Markets |
| Email Domains | @offmrkt.co.uk | @offthemarkets.co.uk |
| Company Name | OffMrkt Ltd | Off The Markets Ltd |
| URL in mockups | offmrkt.com | offthemarkets.com |
| Twitter Handle | @OffMrkt | @OffTheMarkets |

---

### Files to Update

#### 1. Core Meta & HTML

**`index.html`**
- Title: "OffMrkt - Property Investment Marketplace" → "Off The Markets - Property Investment Marketplace"
- Meta author: "OffMrkt" → "Off The Markets"
- Twitter site handle: "@OffMrkt" → "@OffTheMarkets"
- OG/Twitter titles

---

#### 2. Layout Components

**`src/components/layout/Header.tsx`**
- Logo alt text: "OffMrkt" → "Off The Markets"

**`src/components/layout/Footer.tsx`**
- Logo alt text: "OffMrkt" → "Off The Markets"
- Copyright: "© {year} OffMrkt" → "© {year} Off The Markets"

**`src/components/layout/AppSidebar.tsx`**
- Logo alt text: "OffMrkt" → "Off The Markets"

---

#### 3. Funnel Components

**`src/components/funnels/FunnelLayout.tsx`**
- Logo alt text: "OffMrkt" → "Off The Markets"
- Footer copyright: "© {year} OffMrkt" → "© {year} Off The Markets"

**`src/components/funnels/FunnelTestimonials.tsx`**
- Testimonial quote: "OffMrkt gave me a fair cash offer" → "Off The Markets gave me a fair cash offer"

---

#### 4. Landing Page Components

**`src/components/landing/HeroSection.tsx`**
- Browser URL mockup: "offmrkt.com/dashboard" → "offthemarkets.com/dashboard"

**`src/components/landing/TestimonialsSection.tsx`**
- 6 testimonial quotes mentioning "OffMrkt" → "Off The Markets"
- Section description: "through OffMrkt" → "through Off The Markets"

---

#### 5. Legal Pages

**`src/pages/Terms.tsx`**
- Multiple references to "OffMrkt platform", "OffMrkt Ltd"
- Contact email: "legal@offmrkt.co.uk" → "legal@offthemarkets.co.uk"
- Address: "OffMrkt Ltd, London" → "Off The Markets Ltd, London"

**`src/pages/Privacy.tsx`**
- Introduction: "Welcome to OffMrkt" → "Welcome to Off The Markets"
- Email: "privacy@offmrkt.co.uk" → "privacy@offthemarkets.co.uk"
- Address: "OffMrkt Ltd, London" → "Off The Markets Ltd, London"

**`src/pages/Cookies.tsx`**
- Contact email: "privacy@offmrkt.co.uk" → "privacy@offthemarkets.co.uk"

**`src/pages/GDPR.tsx`**
- Multiple references to "OffMrkt", "OffMrkt Ltd"
- Emails: "privacy@offmrkt.co.uk", "dpo@offmrkt.co.uk" → "privacy@offthemarkets.co.uk", "dpo@offthemarkets.co.uk"

---

#### 6. Backend Function

**`supabase/functions/mortgage-enquiry/index.ts`**
- Source identifier: "offmrkt_mortgage_page" → "offthemarkets_mortgage_page"

---

#### 7. Logo Asset

**`src/assets/offmrkt-logo.png`**
- Rename to: `offthemarkets-logo.png`
- Update all imports in:
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/layout/AppSidebar.tsx`
  - `src/components/funnels/FunnelLayout.tsx`

Note: You will need to provide a new logo image file, or I can keep the existing logo file and just rename the references. Let me know if you have a new logo to upload.

---

### Detailed Changes by File

#### index.html
```html
<!-- Before -->
<title>OffMrkt - Property Investment Marketplace</title>
<meta name="author" content="OffMrkt" />
<meta name="twitter:site" content="@OffMrkt" />
<meta property="og:title" content="OffMrkt - Property Investment Marketplace">

<!-- After -->
<title>Off The Markets - Property Investment Marketplace</title>
<meta name="author" content="Off The Markets" />
<meta name="twitter:site" content="@OffTheMarkets" />
<meta property="og:title" content="Off The Markets - Property Investment Marketplace">
```

#### Footer.tsx
```tsx
// Before
<img src={logo} alt="OffMrkt" ... />
<p>© {currentYear} OffMrkt. All rights reserved.</p>

// After
<img src={logo} alt="Off The Markets" ... />
<p>© {currentYear} Off The Markets. All rights reserved.</p>
```

#### TestimonialsSection.tsx
```tsx
// Before
quote: "OffMrkt completely changed how I approach property investment..."

// After
quote: "Off The Markets completely changed how I approach property investment..."
```

---

### Implementation Order

1. Update `index.html` meta tags
2. Update layout components (Header, Footer, AppSidebar)
3. Update funnel components
4. Update landing page testimonials and mockups
5. Update legal pages (Terms, Privacy, Cookies, GDPR)
6. Update edge function source identifier
7. Rename/update logo asset imports (if new logo provided)


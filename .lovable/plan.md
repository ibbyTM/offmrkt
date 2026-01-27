

## Prominent "I Want to Buy" / "I Want to Sell" CTAs

### Overview

Add big, prominent dual-path CTAs throughout the landing page that clearly segment visitors into buyers/investors and sellers/vendors. The "I Want to Sell" path will be visually prioritized to push more sellers.

### Integration Strategy

Rather than creating a separate component, we'll integrate the buy/sell CTAs into three key touchpoints:

1. **Hero Section** - Replace generic CTAs with clear buy/sell paths
2. **New Dual-Path Section** - A dedicated section after the hero with visual cards
3. **Bottom CTA Section** - Update to emphasize sell path

This creates a cohesive journey where visitors are constantly reminded of both options, with selling visually emphasized.

---

### 1. Hero Section Updates

Replace the current generic "Get Started for Free" / "Browse Properties" buttons with clear intent-based CTAs:

```text
Current:
[Get Started for Free →]  [Browse Properties]

New:
[I Want to Sell →]  [I Want to Buy]
     (primary)          (outline)
```

**Visual emphasis on "Sell":**
- Primary gradient button for "Sell" 
- Outline/secondary button for "Buy"
- "Sell" button slightly larger or with a badge like "Get Cash Offers"

---

### 2. New Dual-Path Section (after Hero)

Create a new `DualPathSection` component that appears right after the hero, featuring two large clickable cards:

```text
+------------------------------------------+
|                                          |
|   Which describes you best?              |
|                                          |
|  +----------------+  +----------------+  |
|  |                |  |                |  |
|  |  I WANT TO     |  |  I WANT TO     |  |
|  |    SELL        |  |    BUY         |  |
|  |                |  |                |  |
|  |  [Home Icon]   |  |  [Search Icon] |  |
|  |                |  |                |  |
|  |  Get instant   |  |  Access        |  |
|  |  cash offers   |  |  exclusive     |  |
|  |  for your      |  |  off-market    |  |
|  |  property      |  |  deals         |  |
|  |                |  |                |  |
|  |  [Submit →]    |  |  [Browse →]    |  |
|  |  ★ FEATURED    |  |                |  |
|  +----------------+  +----------------+  |
|                                          |
+------------------------------------------+
```

**Sell card visual priority:**
- Larger size (60/40 split on desktop)
- Primary border/accent color
- "Featured" or "Quick Cash" badge
- Appears first on mobile

---

### 3. Update Bottom CTA Section

Transform the existing CTASection to have a two-column layout:

```text
+--------------------------------------------------+
|                                                  |
|  Ready to get started?                           |
|                                                  |
|  +---------------------+  +-------------------+  |
|  | SELL YOUR PROPERTY  |  | INVEST IN DEALS  |  |
|  |                     |  |                   |  |
|  | Get cash offers in  |  | Browse exclusive  |  |
|  | 24 hours from our   |  | off-market deals  |  |
|  | verified investors  |  | across the UK     |  |
|  |                     |  |                   |  |
|  | [Submit Property →] |  | [Browse Now]      |  |
|  +---------------------+  +-------------------+  |
|                                                  |
+--------------------------------------------------+
```

---

### 4. Floating Widget Update

Enhance the existing FloatingLeadCapture to default to "seller" interest:

- Pre-select "Selling a Property" in the interest dropdown
- Update the button text to "Sell Your Property" when minimized

---

### Implementation Files

| File | Change |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Update CTA buttons to "I Want to Sell" (primary) and "I Want to Buy" (outline) |
| `src/components/landing/DualPathSection.tsx` | New component with two large clickable cards |
| `src/pages/Index.tsx` | Add DualPathSection after HeroSection |
| `src/components/landing/CTASection.tsx` | Transform to dual-column layout with sell emphasis |
| `src/components/landing/FloatingLeadCapture.tsx` | Default to seller interest, update minimized button text |

---

### Technical Details

**New Component: `DualPathSection.tsx`**

```tsx
// Two-card layout with Framer Motion animations
// Sell card: 55% width on desktop, primary accent, "Featured" badge
// Buy card: 45% width on desktop, subtle styling
// Mobile: Sell card stacks first, full width

<section className="py-16 bg-muted/30">
  <div className="container">
    <h2 className="text-center text-2xl font-bold mb-8">
      Which describes you best?
    </h2>
    
    <div className="grid md:grid-cols-[1.2fr_1fr] gap-6">
      {/* Sell Card - Emphasized */}
      <Card className="p-8 border-primary/30 bg-primary/5 relative">
        <Badge className="absolute top-4 right-4">Quick Cash</Badge>
        <Home className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-2xl font-bold mb-2">I Want to Sell</h3>
        <p className="text-muted-foreground mb-6">
          Get instant cash offers from our network of verified investors...
        </p>
        <Button asChild variant="gradient" size="lg">
          <Link to="/submit-property">Submit Your Property →</Link>
        </Button>
      </Card>
      
      {/* Buy Card - Secondary */}
      <Card className="p-8 border-border">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">I Want to Buy</h3>
        <p className="text-muted-foreground mb-6">
          Access exclusive off-market deals before anyone else...
        </p>
        <Button asChild variant="outline" size="lg">
          <Link to="/register">Browse Deals</Link>
        </Button>
      </Card>
    </div>
  </div>
</section>
```

**HeroSection Updates:**

```tsx
// Replace current CTA buttons (lines 228-240)
<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
  <Button asChild size="lg" variant="gradient" className="font-semibold text-base px-8 group">
    <Link to="/submit-property">
      I Want to Sell
      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </Button>
  <Button asChild size="lg" variant="outline" className="font-semibold text-base px-8">
    <Link to="/register">
      I Want to Buy
    </Link>
  </Button>
</div>
```

**FloatingLeadCapture Updates:**

```tsx
// Update default value
defaultValues: {
  interest_type: "seller", // Changed from "not_sure"
}

// Update minimized button text
<Button onClick={() => setIsExpanded(true)} ...>
  <Building2 className="h-5 w-5" />
  <span className="hidden sm:inline">Sell Your Property</span>
  <span className="sm:hidden">Sell Now</span>
</Button>
```

---

### Visual Hierarchy Summary

| Element | Sell Emphasis | Buy Emphasis |
|---------|---------------|--------------|
| Hero CTAs | Primary/Gradient button | Outline button |
| Dual-Path Cards | 55% width, accent border, badge | 45% width, neutral |
| Bottom CTA | Left column, primary styling | Right column, secondary |
| Floating Widget | Default selection, primary CTA text | - |

This creates a consistent visual language that subtly pushes visitors toward the seller path while still providing a clear buying option.


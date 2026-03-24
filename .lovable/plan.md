

## Remove Testimonials & Update CTA on High-Yield Funnel

Two surgical changes in `src/pages/funnels/invest/InvestFunnelV1.tsx`:

**1. Delete line 166** — remove the `<FunnelTestimonials>` component call entirely.

**2. Update line 169** — change the CTA subheadline:
- From: `"Join hundreds of investors already receiving exclusive deal alerts."`
- To: `"Join verified investors already accessing exclusive UK off-market deals."`

Also remove the unused `FunnelTestimonials` and `defaultTestimonials` import on line 27.

Single file changed. No other modifications.


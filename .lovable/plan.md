

## Update Domain References to off-the-markets.com

Update all public-facing domain references to use your registered domain `off-the-markets.com` (with hyphens).

---

### Summary of Changes

| Current | New |
|---------|-----|
| offthemarkets.com | off-the-markets.com |
| @offthemarkets.co.uk (emails) | @off-the-markets.co.uk |

**Note:** The Twitter handle `@OffTheMarkets` and internal asset filenames will remain unchanged.

---

### Files to Update

| File | Change |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Browser mockup URL: `offthemarkets.com/dashboard` → `off-the-markets.com/dashboard` |
| `src/pages/Terms.tsx` | Email: `legal@offthemarkets.co.uk` → `legal@off-the-markets.co.uk` |
| `src/pages/Privacy.tsx` | Email: `privacy@offthemarkets.co.uk` → `privacy@off-the-markets.co.uk` |
| `src/pages/Cookies.tsx` | Email: `privacy@offthemarkets.co.uk` → `privacy@off-the-markets.co.uk` |
| `src/pages/GDPR.tsx` | Multiple emails: `privacy@offthemarkets.co.uk`, `dpo@offthemarkets.co.uk` → `privacy@off-the-markets.co.uk`, `dpo@off-the-markets.co.uk` |

---

### What Stays the Same

- **Twitter handle:** `@OffTheMarkets` (social handles don't use hyphens)
- **Logo filename:** `offthemarkets-logo.png` (internal asset reference)
- **Backend source ID:** `offthemarkets_mortgage_page` (internal identifier)

---

### Detailed Changes

**HeroSection.tsx (line 58):**
```
offthemarkets.com/dashboard → off-the-markets.com/dashboard
```

**Terms.tsx (line 302-303):**
```
legal@offthemarkets.co.uk → legal@off-the-markets.co.uk
```

**Privacy.tsx (line 213-214):**
```
privacy@offthemarkets.co.uk → privacy@off-the-markets.co.uk
```

**Cookies.tsx (line 277-278):**
```
privacy@offthemarkets.co.uk → privacy@off-the-markets.co.uk
```

**GDPR.tsx (lines 100, 112, 271, 423, 447, 448):**
```
privacy@offthemarkets.co.uk → privacy@off-the-markets.co.uk
dpo@offthemarkets.co.uk → dpo@off-the-markets.co.uk
```


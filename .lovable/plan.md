

## Hero Redesign — Centered Text + 3D Crystal House

Replace the current dark-photo hero with a Runway-inspired clean layout: centered headline, subtitle, dual CTAs, trust logos — and a floating 3D glass/crystal house object rendered with Three.js below the text.

### Layout

```text
┌─────────────────────────────────────────┐
│          [small pill badge]             │
│                                         │
│     Off-market deals,                   │
│     before anyone else.                 │
│                                         │
│   subtitle text centered                │
│                                         │
│   [I Want to Sell →]  [I Want to Buy]   │
│                                         │
│   Trusted by leading professionals      │
│   [RICS]  [ARLA]  [PropertyMark] ...    │
│                                         │
│         ┌─────────────┐                 │
│         │  3D Crystal  │                │
│         │    House     │                │
│         └─────────────┘                 │
│                                         │
│   ──── stats bar (3 items) ────         │
└─────────────────────────────────────────┘
```

### Visual Details
- **Background**: Light/white with a subtle gradient wash (soft pink-to-blue like Runway, or keep white-to-slate-50)
- **Headline**: Centered, `text-5xl lg:text-7xl`, dark text (`text-foreground`), accent word in `text-primary`
- **Pill badge**: Above headline — "New: AI Property Analysis" or similar, small rounded-full border pill
- **CTAs**: Centered row, primary gradient + outline secondary
- **Trust logos**: Inline partner names below CTAs (merge PartnerLogos into hero)
- **3D Object**: A glass/crystal house shape using `@react-three/fiber` + `@react-three/drei`. Slowly auto-rotates, catches light with a glass material (`MeshTransmissionMaterial` or `MeshPhysicalMaterial` with transmission). Sits below the text block, roughly 300-400px tall.
- **Stats bar**: Below the 3D object — 3 stats in a row ("500+ Properties", "8.5% Avg Yield", "7 Days to Completion"), simple text, no cards

### Technical Approach

**New file: `src/components/landing/CrystalHouse.tsx`**
- React Three Fiber canvas with a simple house geometry (box base + pyramid roof, or extruded shape)
- `MeshPhysicalMaterial` with `transmission: 0.9`, `roughness: 0.05`, `ior: 1.5` for glass look
- `Float` from drei for gentle bobbing animation
- `OrbitControls` disabled (auto-rotate only via `useFrame`)
- Environment map from drei (`<Environment preset="city" />`) for reflections
- Responsive: smaller on mobile (`h-[250px]` vs `h-[400px]`)

**Modified: `src/components/landing/HeroSection.tsx`**
- Remove background image, dark overlay, and 2-column grid
- Center everything, add pill badge, integrate trust logos
- Lazy-load `CrystalHouse` with Suspense fallback
- Stats as a simple flex row below

**Dependencies**: `@react-three/fiber@^8.18`, `three@^0.170`, `@react-three/drei@^9.122.0`

### Files Changed
- `src/components/landing/CrystalHouse.tsx` — new 3D component
- `src/components/landing/HeroSection.tsx` — centered layout with 3D object
- `package.json` — add three.js dependencies


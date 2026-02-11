# Specification

## Summary
**Goal:** Replace `AppV1.jsx` with the user-provided V45 “NEXUS ELITE POLISH” implementation and ensure the frontend builds and runs with the intended premium/mobile-polished UI intact.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the exact V45 code provided by the user (complete file replacement, preserving all included components, seed data like `INITIAL_SALONS`/`PRESETS`, Tailwind classes, strings, imports, and interaction logic).
- Apply only minimal mechanical fixes required for this repository so the project compiles and runs (e.g., missing/incorrect imports, unresolved identifiers, invalid JSX, duplicate exports) without altering V45’s intended layout, styling, copy, or behaviors.
- Verify the key V45 visual outcomes are preserved: the Salon/Domicile selector uses a 2-column grid with no mobile overflow; premium gradient + glassmorphism styling is present on cards/surfaces; and the Pro landing revamp shows a large background image with larger sales-oriented typography and an airier layout.

**User-visible outcome:** The app loads without build/runtime errors and displays the V45 “NEXUS ELITE POLISH” experience, including the mobile-perfect Salon/Domicile selector, premium glass/gradient styling, and the revamped Pro landing screen.

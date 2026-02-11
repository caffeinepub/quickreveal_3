# Specification

## Summary
**Goal:** Overwrite `frontend/src/AppV1.jsx` with the user-provided V53 “NEXUS OLYMPUS” cinematic intro experience and ensure it compiles and runs without changing intended UI/UX.

**Planned changes:**
- Fully replace `frontend/src/AppV1.jsx` with the exact V53 code provided by the user, preserving all included components, local seed datasets (`SWISS_DB`, `SHOWREEL`, `INITIAL_SALONS`, `PROFESSIONS`, `RICH_PRESETS`), Tailwind classes, UI strings, and interaction logic.
- Apply only minimal mechanical fixes required for this repo to build (e.g., missing/incorrect imports, unresolved identifiers, invalid JSX, export issues) without altering V53 layout, styling, copy, or behavior.
- Keep app entry wiring unchanged (`frontend/src/App.tsx` remains a thin wrapper rendering `AppV1`) and maintain local-only state/data (no backend calls).

**User-visible outcome:** On launch, users see a full-screen Olympus Intro showreel and can enter the app; they can share via native `navigator.share` (with a safe fallback), get Swiss smart location suggestions from local data, and confirm a booking that opens a prefilled WhatsApp `wa.me` message including salon/services/date-time/location context and total price in a dark cinematic UI with trust badges.

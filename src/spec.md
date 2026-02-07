# Specification

## Summary
**Goal:** Replace the current AppV1 UI with the provided V24 “OMEGA SINGULARITY” single-file UI while keeping the app entry wiring unchanged and ensuring the project still compiles.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the user-provided V24 “OMEGA SINGULARITY” code, preserving its components, local `DATA`, Tailwind styling, imports, and interaction logic (Framer Motion `layoutId` morphing cards, orbital CoreNav, category slider filtering, Vantablack aesthetic).
- Apply only minimal mechanical fixes required for this repository to compile/run (e.g., missing/incorrect imports, unresolved symbols, invalid JSX, duplicate exports) without changing intended UI/animations/copy/flows.
- Keep `frontend/src/App.tsx` as the thin wrapper rendering `AppV1` and avoid any changes to immutable entry/hooks/ui paths.

**User-visible outcome:** The app boots into the V24 OMEGA SINGULARITY UI where users can filter via the top category slider, open a salon card into a full-screen morphing view (shared `layoutId`), and navigate primarily via the expandable/collapsible bottom orbital CoreNav (Home/Agenda/Favorites) in a predominantly pure-black, high-contrast style.

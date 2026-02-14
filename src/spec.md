# Specification

## Summary
**Goal:** Replace the current `AppV1` UI with the user-provided V10000 “NEXUS OMNIVERSE” implementation and ensure it compiles and runs locally with persisted state.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the exact V10000 “NEXUS OMNIVERSE” code provided by the user, preserving all UI/logic, mock data/constants, imports, Tailwind classes, copy, and interactions as given.
- Ensure local-only “brain” persistence uses the exact storage key `nexus_omniverse_v10000` (load on init, save on state changes) as defined by the V10000 code.
- Apply only minimal mechanical fixes required for this repo to compile/run (e.g., missing/incorrect imports, undefined identifiers, invalid JSX, missing referenced functions/components), without changing intended layout/styling/text/behavior.
- Preserve existing app entry wiring by leaving `frontend/src/App.tsx` unchanged (continues to render `AppV1`) and keeping the current Vite/React mount flow.

**User-visible outcome:** The app boots through the existing entrypoints and displays the V10000 “NEXUS OMNIVERSE” experience (Landing → Client Explorer → Pro Studio/Cockpit) with local persisted state and no backend calls.

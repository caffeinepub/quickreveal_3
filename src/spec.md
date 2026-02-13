# Specification

## Summary
**Goal:** Replace the current `AppV1` implementation with the user-provided V7000 “NEXUS INFINITY” app (Landing → Client Explorer → Pro App stub) while keeping existing repo entry wiring intact.

**Planned changes:**
- Fully replace the contents of `frontend/src/AppV1.jsx` with the provided V7000 code verbatim, including in-file datasets (`CATEGORIES`, `PRO_DB`), discovery engine (category rail, distance sort toggle, list↔map dual view), client bottom dock, booking modal overlay, and localStorage persistence using the key `nexus_v7000`.
- Apply only minimal mechanical fixes necessary for this repository to compile/run (e.g., missing/incorrect imports, undefined identifiers, JSX syntax issues), without altering intended UI layout, styling (Tailwind classes), copy, datasets, or interaction behavior.
- Preserve existing entry wiring by making no changes to `frontend/src/App.tsx`, `frontend/src/main.tsx`, or other immutable entry files; the app continues to mount via the current Vite/React entry and render `AppV1`.

**User-visible outcome:** The app loads the V7000 “NEXUS INFINITY” interface (Landing and discovery experience with list/map and booking modal), and user state persists in `localStorage` (`nexus_v7000`) so a full reload restores the last view and saved data.

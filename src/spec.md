# Specification

## Summary
**Goal:** Overwrite `frontend/src/AppV1.jsx` with the provided V38 “GENESIS ARCHITECT” single-file UI (Landing → Client → Pro Studio), ensuring it compiles/runs in this repo with only minimal build-fixing adjustments and improved deploy-state robustness.

**Planned changes:**
- Fully replace the contents of `frontend/src/AppV1.jsx` with the exact V38 code provided (including imports, components, local data like `INITIAL_SALONS` and `PRESETS`, Tailwind classes, and interaction logic).
- Apply minimal mechanical fixes needed for the V38 code to compile and run in this codebase without changing intended UI/UX (e.g., missing imports, unresolved identifiers, JSX/export issues).
- Update the Pro “deploy/publish” flow to use a functional React state update (`setSalons(prev => [newSalon, ...prev])`) to avoid stale-closure issues while keeping the same visible behavior (new salon added to top and switch to Client view).

**User-visible outcome:** The app launches into the V38 landing screen and can navigate to Client and Pro Studio using local state only; the Pro Studio includes Smart Presets, a detailed service editor (image/technical description/duration/price) reflected in the client menu, a desktop split-view live preview, and deploying a new salon reliably adds it to the top of the client list and switches to Client.

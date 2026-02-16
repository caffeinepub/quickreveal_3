# Specification

## Summary
**Goal:** Replace the current `AppV1` with the user-provided “Nexus Singularity” frontend-only app (Landing + Pro Onboarding/Cockpit + Client Explorer) while keeping existing app entry wiring unchanged.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the user-provided “Nexus Singularity (Landing Page + SaaS)” code as a verbatim replacement.
- Apply only minimal mechanical fixes (e.g., missing imports, unresolved identifiers, invalid JSX, duplicate exports) required for the repository to compile/run.
- Ensure the app remains frontend-only with local state + localStorage persistence (key: `nexus_v12_clean`), with no backend/Internet Identity usage.
- Preserve existing mounting/wiring by leaving `frontend/src/App.tsx` and `frontend/src/main.tsx` unchanged.

**User-visible outcome:** Users can navigate and use the provided flows as coded: Landing → Client Explorer, and Landing → Pro Onboarding → Pro Cockpit, with state persisting via localStorage.

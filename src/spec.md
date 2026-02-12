# Specification

## Summary
**Goal:** Replace the entire `frontend/src/AppV1.jsx` with the user-provided V60 “NEXUS DIVINE” implementation and ensure the app still compiles and runs with minimal mechanical fixes only.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the exact user-provided V60 “NEXUS DIVINE” code (verbatim), including its imports, hardcoded datasets, styling, and interactions.
- Apply only minimal build/compile mechanical fixes required by the repository wiring (e.g., missing imports/identifiers, invalid JSX) without changing V60 UI/UX, copy, data, or behaviors.
- Keep `frontend/src/App.tsx` as the unchanged thin wrapper that renders `<AppV1 />`, continuing to mount via the existing `frontend/src/main.tsx` setup.

**User-visible outcome:** The app boots into the V60 Intro screen and flows through the V60 UI as coded (Intro → feed → morphing salon detail overlay → gold service selection effect → Champagne Gold CTA when services are selected), running locally with no backend integration.

# Specification

## Summary
**Goal:** Replace the existing `AppV1.jsx` with the provided V51 “NEXUS VIRAL (Growth & Conversion)” implementation while keeping the app compiling and running.

**Planned changes:**
- Completely overwrite `frontend/src/AppV1.jsx` with the user-provided V51 code block (verbatim).
- Apply only minimal mechanical fixes (e.g., imports/identifiers/JSX validity) necessary for successful build and initial runtime, without changing UI, styling (Tailwind classes), copy, or interaction behavior.
- Keep `frontend/src/App.tsx` unchanged and continuing to render `AppV1`.

**User-visible outcome:** The app loads the V51 “NEXUS VIRAL” experience with native share, WhatsApp deep-link booking, Swiss ZIP↔city suggestion search, and the cinematic dark luxury UI; navigation between Landing/Client/Pro views works without crashes.

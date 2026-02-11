# Specification

## Summary
**Goal:** Overwrite `frontend/src/AppV1.jsx` with the user-provided V47 “NEXUS PRO TOOLS” baseline and ensure the app compiles/runs, while preserving V47 UI/behavior and completing the Pro tools features (Social Hub website link, robust deploy, precise booking, Service Studio V2).

**Planned changes:**
- Fully replace `frontend/src/AppV1.jsx` with the provided V47 “NEXUS PRO TOOLS” code (full-file overwrite), keeping `frontend/src/App.tsx` as a thin wrapper that renders `AppV1`.
- Apply only minimal mechanical fixes needed for this repo to compile/run (imports, identifiers, JSX validity) without altering intended V47 layout/copy/interactions.
- Fix stale state closure in the Pro deploy/finish flow by using a functional `setSalons(prev => [newS, ...prev])` update while preserving the same visible behavior and immediate switch back to the client view.
- Implement/verify V47 Social Hub: allow Pro to add Instagram, WhatsApp, and Website; show website action in the client salon detail when present and open it in a new tab, matching existing Social Hub button styling.
- Preserve/verify V47 “Precise booking”: require exact date + time selection before sending; disable send until both are selected; show a pending confirmation screen stating the 2-hour validation window and allowing return to the home feed.
- Preserve/verify V47 “Service Studio V2”: Pro can create/edit services with name, price, duration, long description, and optional dedicated photo; client salon detail renders these services and displays service images when provided.

**User-visible outcome:** The app boots into the V47 landing (Explorer / Espace Pro). Pros can create and deploy salons with detailed services and social links (including a website), and clients can browse salons, see social actions, and place a booking request only after selecting an exact date and time, then view a pending confirmation screen indicating a 2-hour validation window.

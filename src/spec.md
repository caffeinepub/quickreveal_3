# Specification

## Summary
**Goal:** Reset the V14 “DIVINE OS” local demo by fully overwriting `frontend/src/AppV1.jsx` with the user-provided code verbatim, ensuring it runs as a 100% local React-state-driven demo.

**Planned changes:**
- Fully replace the contents of `frontend/src/AppV1.jsx` with the provided V14 “DIVINE OS” code block exactly as given (full overwrite; no merges).
- Keep `frontend/src/App.tsx` as a thin wrapper rendering `AppV1` (no entry wiring changes) and ensure the frontend compiles/runs with the injected UI and behavior.
- Ensure all demo behaviors remain local-only (no backend calls), including Landing → Client (“Explorer”) / Pro (“Créer”) flow switching, Client favorites, card removal, service-to-agenda booking navigation, and Pro wizard “DÉPLOYER” injecting a new salon into the Client feed and Stories during the same session.

**User-visible outcome:** The app launches into the Landing screen and users can navigate between Client and Pro demo flows; in Client they can favorite salons, remove salons from the feed, add bookings by selecting services (which navigates to Agenda), and in Pro they can complete the wizard and deploy a new salon that immediately appears in the Client feed and Stories—all without any backend dependency.

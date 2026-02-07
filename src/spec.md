# Specification

## Summary
**Goal:** Overwrite the existing AppV1 UI with the user-provided V25 “AETHER GENESIS” implementation and ensure it compiles and runs, including Helix filtering, Living Matter card interactions, and an upgraded Creator Cockpit workflow.

**Planned changes:**
- Fully replace `frontend/src/AppV1.jsx` with the provided V25 code (Landing → Client → Creator flow) while keeping `frontend/src/App.tsx` rendering `AppV1`.
- Apply minimal mechanical compile/runtime fixes required by the V25 paste (e.g., resolve missing identifiers like `INITIAL_SALONS` based on V25 seed `DATA`, ensure imports exist, remove/adjust unused imports only if they break the build).
- Ensure Helix top navigation filters the salon feed instantly by category, including “Tout” to show all salons, and show a safe empty state when no results match.
- Implement V25 “Living Matter” behaviors in salon cards/expanded view: swipe/drag gallery for multi-image salons, fused editorial-style bio+contact presentation, and pulsing heartbeat-dot availability indicators driven by local slot data.
- Upgrade the Creator Cockpit to include live preview (split panel on large screens, modal/sheet on mobile) and a local “AI Assist” action that generates an ‘Aura’ marketing description without external services.
- Make deploy/publish robust by inserting newly created salons via functional state updates so new entries reliably appear at the top after repeated deploys.

**User-visible outcome:** The app boots into the V25 landing screen, users can browse salons with instant Helix category filtering and richer interactive “Living Matter” cards, and creators can live-preview and deploy new salons (with optional locally-generated “Aura” copy) that appear immediately at the top of the client feed.

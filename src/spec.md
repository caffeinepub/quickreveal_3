# Specification

## Summary
**Goal:** Fully replace the current `AppV1` UI with the user-provided V26 “QUANTUM REALITY” experience, ensuring it compiles and runs as a local-state demo.

**Planned changes:**
- Overwrite `frontend/src/AppV1.jsx` entirely with the user-provided V26 code as the full UI implementation (not merged with prior versions).
- Apply only minimal mechanical fixes needed for this repository so the V26 code compiles/runs (e.g., imports, undefined identifiers, JSX validity) without altering intended UI/layout/styling/copy/behavior.
- Implement/verify the V26 “Singularity Entry” flow: black screen with pulsing orb, sustained press to charge entry, release resets, and an aspiration-style transition on completion.
- Implement/verify the V26 “Hyper-Reality Feed”: full-screen salon windows, spring-like transitions between salons, and subtle image zoom tied to scroll progression.
- Implement/verify the V26 HUD overlays: frosted-glass floating panels (bio/price/contact) with hover reaction on desktop while remaining readable/usable on touch devices.
- Implement/verify V26 Architect (Creator) Mode: cyber-futuristic creator UI with real-time revenue simulation, a Dimension switch for instant Setup ↔ Preview toggling, and local-only publishing that injects the new salon into the in-memory list.

**User-visible outcome:** The app boots through the existing `App.tsx` wrapper into the V26 QUANTUM REALITY UI, featuring a long-press singularity entry, a spring-scrolling full-screen salon feed with scroll-zoom, HUD glass overlays, and an Architect creator mode that previews instantly and updates the feed locally when publishing.

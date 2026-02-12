# Specification

## Summary
**Goal:** Fully overwrite `frontend/src/AppV1.jsx` with the user-provided V54 “NEXUS MANIFESTO” implementation while preserving the Manifesto Intro flow, luxury UI styling, native share, and WhatsApp bridge, and ensuring the app still builds and runs.

**Planned changes:**
- Replace the entire contents of `frontend/src/AppV1.jsx` verbatim with the provided V54 code block (full-file overwrite).
- Apply only minimal mechanical fixes needed for this repository so the frontend compiles/runs (e.g., missing imports, unresolved identifiers, invalid JSX), without changing intended V54 UI/UX, styling, or copy.
- Preserve the Manifesto Intro behavior: rotating manifesto text sequence, profession icon row on intro, and “Enter” CTA transitioning from intro to landing.
- Preserve V54 high-tech luxury styling characteristics (backdrop blur, tight typography, high contrast) as implemented in the provided code.
- Keep viral features working: `navigator.share` with fallback, and WhatsApp `wa.me` deep-link with prefilled booking details (services, date/time, location including domicile address when applicable, total price).
- Make the Pro “deploy/publish” insertion into the in-memory `salons` list robust against stale state closures so the new salon reliably appears at the top and the view switches to Client immediately after deploy.

**User-visible outcome:** On launch, users see the manifesto intro sequence with profession icons and can enter the app, navigate landing → client feed, access the Pro studio, publish a new salon that appears instantly at the top of the client list, and share/book via native share and WhatsApp without crashes.

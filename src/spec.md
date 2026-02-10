# Specification

## Summary
**Goal:** Replace the current `AppV1.jsx` UI with the provided V34 “ETHEREAL FLOW” experience while keeping the app compiling/running and preserving the existing mount/wrapper setup.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the user-provided V34 “ETHEREAL FLOW” code, preserving its layout, Tailwind styling, local `DATA`, and Landing → Client feed → Pro studio interactions.
- Apply only minimal mechanical fixes required for this repo so the frontend builds and runs without altering V34’s intended UI/copy/behavior.
- Fix the Pro “Deploy” flow to prevent stale state by updating salons with a functional state update so newly deployed salons reliably appear at the top and the view switches to Client.
- Keep `frontend/src/App.tsx` unchanged as the thin wrapper that renders `AppV1`, and avoid editing immutable frontend paths.

**User-visible outcome:** The app launches into the V34 landing screen and allows navigating to the Client feed (capsule filters + floating island nav, expandable salon detail overlay) and the Pro studio (split editor/preview), with “Deploy” reliably adding the new salon to the top of the Client list.

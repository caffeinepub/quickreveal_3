# Specification

## Summary
**Goal:** Replace the current AppV1 UI with the user-provided V43 “NEXUS SECURE CONNECT” experience, ensuring it compiles in the repo and includes the required domicile logistics gating, post-request pending screen, secure in-app chat, and privacy reassurance messaging.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the exact user-provided V43 “NEXUS SECURE CONNECT” code (entire file replaced verbatim).
- Apply only minimal mechanical fixes needed for the V43 code to compile and run in this repository (e.g., imports, undefined identifiers, JSX issues) without changing intended layout/styling/copy/behavior.
- Ensure the booking request flow enforces a required logistics form for “Domicile” services (address + access instructions required before sending).
- After sending a request, show an awaiting-confirmation/pending screen with a “Chat with the Pro” action that opens a local-state in-app secure chat UI, plus visible privacy reassurance messaging about data sharing occurring only after confirmation.

**User-visible outcome:** The app boots into the V43 Landing → Client → Pro UI, requires address/access details for domicile bookings before sending a request, then shows a pending confirmation state with an in-app secure chat to coordinate details and clear privacy reassurance messaging.

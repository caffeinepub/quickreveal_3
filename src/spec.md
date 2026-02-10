# Specification

## Summary
**Goal:** Overwrite the app UI by fully replacing `frontend/src/AppV1.jsx` with the user-provided V37 “NEXUS PRO MAX” implementation, ensuring it compiles and runs in this repo with minimal mechanical fixes while preserving the provided UI, copy, and interaction behavior.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the exact V37 code block provided by the user (no partial merges), keeping its components, local seed data (`INITIAL_SALONS`), Tailwind classes, strings, and interaction logic intact.
- Apply only minimal mechanical adjustments needed for this repository to compile and run (e.g., missing/incorrect imports, unresolved symbols, invalid JSX, duplicate exports) without changing V37 design/copy/behavior.
- Make Pro “Publish” salon injection robust by switching to a functional state update (`setSalons(prev => [newSalon, ...prev])`) while preserving identical visible behavior.

**User-visible outcome:** The app boots into the V37 Landing screen and supports the full V37 flow: clients can browse salons, select multiple services with a sticky cart updating totals in real time, and pros can manage a studio (Identity/Services/Availability), publish a salon into the client list (appearing at the top), with availability selections displayed as badges on salon cards.

# Specification

## Summary
**Goal:** Replace `frontend/src/AppV1.jsx` with the provided V35 “NEXUS PRIME” UI code and ensure it compiles/runs while preserving the intended UX and interactions.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the user-provided V35 code block (preserving layout, Tailwind classes, seed data, imports, and interaction logic as provided).
- Apply only minimal mechanical fixes required for the repository to compile and run (e.g., missing/incorrect imports, unresolved identifiers, invalid JSX), without changing V35 UI/copy/behavior.
- Preserve and verify the V35 behaviors: real-time client search filtering (name/location/service), conversion-first salon cards (entry price + next slot + verified/distance), and the gamified Pro Studio with profile-quality gauge and desktop preview.
- If present in the provided code, adjust the Pro “Deploy/Mettre en Ligne” salon insertion to use a functional state update to avoid stale React closure issues while keeping the same visible behavior (new salon appears at top; navigate back to Client).

**User-visible outcome:** The app boots into the V35 flow (Landing → Client search/feed → Pro studio); users can search/filter salons instantly, see optimized cards with price/next slot/verified info, and pros can edit a studio profile with a live completion gauge and deploy a new salon reliably to the top of the client list.

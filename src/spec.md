# Specification

## Summary
**Goal:** Replace `frontend/src/AppV1.jsx` with the user-provided V61 UI (client feed, salon modal, and full Pro Studio) while keeping the V60 “Divine” black-and-gold styling and ensuring the app compiles/runs with local-only in-memory data.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the provided V61 code (verbatim as the source of UI/logic), keeping all data local/in-file and making no backend calls.
- Apply only minimal mechanical build fixes (e.g., missing imports, undefined identifiers, invalid JSX/exports) required for successful compile/run without changing intended layout, styling, copy, datasets, or behaviors.
- Verify/restore Pro Studio flows within the Divine visual system: identity editing (name/category/city/type/bio/socials), local cover image preview, and service builder (presets/custom/add/delete).
- Update the Pro Studio publish/deploy handler to use a functional `setSalons` state update so newly created salons reliably appear at the top and the app returns to the client feed.

**User-visible outcome:** Users can navigate from the intro to the client feed, open salon details in a modal, and enter a working Pro Studio to configure a salon (including cover image preview and services) and publish it so it instantly appears at the top of the local client feed.

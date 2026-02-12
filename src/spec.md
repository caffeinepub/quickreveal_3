# Specification

## Summary
**Goal:** Replace `frontend/src/AppV1.jsx` with the user-provided V65 “NEXUS PROFESSIONAL” implementation and ensure the app compiles and runs while preserving the intended sequential booking flow (including Date/Time and Client Identity steps).

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the provided V65 code block verbatim (no partial merge).
- Apply only minimal mechanical fixes needed for this repository so the project builds and runs (without changing V65 UI, copy, styling, datasets, or behavior).
- Preserve and verify the local-only step flow: Service selection → Date/Time picker → Identity form → Request submission → Pending (~3s) → Booked ticket → Mirror Protocol, with Mirror Protocol inaccessible before the Booked step.
- Ensure the booked ticket displays the user-selected date/time and entered client identity as captured in earlier steps.

**User-visible outcome:** Users can select services, pick a date and time slot, enter their name and phone, submit a booking request, see a short pending state, then view a booked ticket showing their chosen date/time and identity; “Pay & Reveal” / Mirror Protocol becomes available only after the booking is confirmed.

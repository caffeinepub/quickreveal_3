# Specification

## Summary
**Goal:** Perform a hard reset of the project by fully replacing the existing backend and frontend with the user-provided V1.0 `backend/main.mo` and `src/App.jsx` baselines.

**Planned changes:**
- Delete the existing Motoko backend implementation and replace it entirely with the user-provided `backend/main.mo` as the official V1.0 backend.
- Remove the existing frontend app code and mount the user-provided `src/App.jsx` as the new V1.0 root UI, using only editable entry points (no changes to immutable paths).
- Remove/disable all previously implemented advanced features and code paths unless they exist in the two user-provided V1.0 files, ensuring the repo builds and runs end-to-end after the reset.

**User-visible outcome:** The app runs using only the new V1.0 backend and the new V1.0 single-root UI behavior defined by the user-provided files, with prior features no longer present unless included in those V1.0 sources.

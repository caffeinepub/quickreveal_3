# Specification

## Summary
**Goal:** Replace the current AppV1 with the user-provided V66 “NEXUS FREEDOM” local-only UI, preserving the sequential freelance booking tunnel, Creator Studio deployment flow, and post-booking Mirror Protocol terminal.

**Planned changes:**
- Fully overwrite `frontend/src/AppV1.jsx` with the exact user-provided V66 code as the complete frontend UI/logic, using only in-file demo data (no backend calls).
- Apply only minimal mechanical fixes required for this repo to compile/run (imports, JSX issues, undefined identifiers), without altering V66 UI/UX, copy, datasets, or behavior.
- Preserve and verify the sequential booking flow: Services → Location (required; options gated by `acceptsMobile`/`acceptsStudio`) → Date/Time → Identity (address required only for “at client”) → Pending (~3s) → Final ticket.
- Preserve and verify Creator Studio: enter from Intro, configure Mobile/Home Studio modes, add/delete services (including presets), deploy a new artist into the in-memory feed immediately.
- Make deploy injection robust by updating `setArtists` via a functional state update to prevent stale-closure drops on rapid deploys.
- Preserve and verify Mirror Protocol terminal access control: only available from the Final ticket; “Pay (Mirror)” opens the terminal showing the correct total and finishes via the existing V66 onFinish behavior.

**User-visible outcome:** Users can browse the client feed, complete a required multi-step booking (including Location logic), receive a final ticket, and then pay via the Mirror Protocol terminal; pros can use Creator Studio to deploy a new freelancer that appears immediately in the feed.

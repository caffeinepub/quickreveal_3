# Specification

## Summary
**Goal:** Overwrite `frontend/src/AppV1.jsx` with the provided V70 “NEXUS OMNIPRESENCE” implementation (multi-city geo-priority feed + smart header) and ensure it compiles/runs with only minimal mechanical fixes.

**Planned changes:**
- Fully replace the contents of `frontend/src/AppV1.jsx` with the exact V70 code provided by the user (verbatim overwrite).
- Apply only minimal compile/runtime fixes needed for this repo (imports/identifiers/JSX/export correctness) while preserving V70 UI, styling, copy, and interactions.
- Preserve and verify V70 behaviors: sticky smart header city selector, dynamic two-section feed reordering based on selected city, dynamic distance badge updates via `getDistance`, and travel-mode UI cues for far artists.
- Make the “Pro deploy” insertion robust by using a functional state update when prepending the new artist to the `artists` list, without changing visible behavior.

**User-visible outcome:** The app shows a sticky header with a city selector; changing the city immediately updates displayed distances and reorders the artist feed into “Autour de vous” and “Ailleurs en Suisse,” while Creator Studio deploy reliably adds a new artist to the top of the feed and returns to the main feed view.

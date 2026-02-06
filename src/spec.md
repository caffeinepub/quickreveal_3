# Specification

## Summary
**Goal:** Restore a fully French/Swiss Client experience by fixing Swiss-only seeded data, reinstating category filters, and removing remaining Paris/English UI regressions.

**Planned changes:**
- Update backend salon seeding so it only creates salons in Lausanne, Genève, and Montreux, with services/categories strictly limited to: "Coiffure", "Barbier", "Spa", "Onglerie" (no Paris, no English).
- Restore the Client salon list category filter bar and filtering logic with buttons in this order: "Tout", "Coiffure", "Barbier", "Spa", "Onglerie".
- Replace specific Client UI strings: "PARIS 11e" → "Suisse Romande", "Recommended for you" → "Les meilleures adresses", and ensure the welcome header shows "Bienvenue".
- Remove remaining obvious English strings in the Client salon list and salon details flows (notably empty/error states and primary actions) so the overall Client journey is consistently French.

**User-visible outcome:** Client users see Swiss (Lausanne/Genève/Montreux) salons and French-only categories, can filter salons by "Coiffure/Barbier/Spa/Onglerie" via a restored top filter bar, and no longer encounter Paris/English labels across key Client screens.

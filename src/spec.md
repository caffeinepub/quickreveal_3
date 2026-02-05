# Specification

## Summary
**Goal:** Ensure the app always has premium salons to browse, upgrade Pro salon creation to a 3-step wizard, and add a persistent client loyalty XP system with premium badging.

**Planned changes:**
- Backend: Auto-seed 5 premium/luxury salons when the salon store is empty (on init/upgrade or first read), each with real photo URLs, neighborhood, description, services, and bookable availability for today and tomorrow.
- Backend: Extend salon and booking models to include neighborhood, description, photoUrl, isPremium, services (label, durationMinutes, price), and date-specific availability; update booking to reserve a specific date+time slot and mark only that slot unavailable.
- Frontend (Pro): Replace the single-input “Create salon” UI with a 3-step wizard (Info → Services → Planning) and submit the full configuration to create a salon with generated availability for today and tomorrow (English UI strings).
- Frontend (Client): Update salon list cards to use backend-driven photoUrl, description, neighborhood, and premium status; avoid showing an empty state under normal conditions due to seeding (English UI strings; neutral recovery message only for unexpected empty/error states).
- Loyalty (Both): Add persistent XP to the backend user profile (default 0), increment XP on successful booking confirmation, and show a Profile “Member Card” with tier label and VIP progress bar populated from backend data (English UI strings).
- Frontend: Add a data-driven “Premium” badge in salon list and salon details when salon.isPremium is true.

**User-visible outcome:** Clients always see premium salons with real photos and can book specific date/time slots; Pros can create a salon via a guided 3-step setup; clients earn XP for confirmed bookings and see their tier/progress on their profile, and premium salons are clearly labeled.

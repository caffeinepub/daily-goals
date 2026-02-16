# Specification

## Summary
**Goal:** Build a Daily Goals Tracker where authenticated users can create/manage goals, check them off per day, and review history, with a cohesive non-blue/purple visual theme.

**Planned changes:**
- Add Internet Identity sign-in and restrict all goal data to the authenticated user’s principal.
- Implement a single Motoko actor backend with stable persistence for goals (create/list/update/archive) scoped per principal.
- Implement backend daily completion tracking per (goalId, date) with APIs to toggle completion and fetch a day view.
- Build frontend screens: Today (checklist with date selection), Goals management (create/edit/archive + archived section), and History (select past date and view statuses).
- Wire frontend to backend using React Query for queries/mutations with loading, error, and empty states.
- Apply a consistent creative UI theme (warm/neutrals/greens/oranges; not blue/purple-dominant) across all screens.
- Add and display generated static assets from `frontend/public/assets/generated` (logo in header/login area; empty-state illustration when no goals).

**User-visible outcome:** Users can sign in with Internet Identity, create and edit daily goals, check/uncheck completion for specific dates, archive/unarchive goals, and review past days’ completion history with clear loading/error/empty states and a cohesive visual design.

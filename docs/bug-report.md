# Web Frontend Bug Report (Next.js / React)

## Overview
This document tracks all audited bugs, defects, and discrepancies identified in the web frontend (`helpdesk-frontend`), along with their resolution details and verification status.

---

### Bug FE-01: Profile Screen 403 Forbidden for Non-Admin Users
- **File**: [`ProfileView.tsx`](file:///D:/Course Wing/Final/fix/helpdesk-frontend/src/components/Profile/ProfileView.tsx), [`userApi.ts`](file:///D:/Course Wing/Final/fix/helpdesk-frontend/src/redux/feature/user/userApi.ts)
- **Problem**: When a user or technician navigated to `/profile`, `ProfileView.tsx` called `useGetUserByIdQuery(currentUser.id)`, which maps to `GET /api/v1/users/{id}`. This endpoint is restricted by Spring Security to `ROLE_ADMIN`, causing a 403 Forbidden failure for standard employees and technicians.
- **Fix**: Added `getCurrentUser` (`GET /api/v1/users/me`) query endpoint to `userApi.ts` and updated `ProfileView.tsx` to call `useGetCurrentUserQuery()`. The `/users/me` endpoint is open to all authenticated roles.
- **Status**: 🟢 FIXED & VERIFIED.

---

### Bug FE-02: Ticket Edit Route Creating Duplicate Tickets Instead of Updating
- **File**: [`/tickets/[id]/edit/page.tsx`](file:///D:/Course Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/tickets/[id]/edit/page.tsx), [`EditTicketView.tsx`](file:///D:/Course Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/ticket/EditTicketView.tsx), [`ticketApi.ts`](file:///D:/Course Wing/Final/fix/helpdesk-frontend/src/redux/feature/ticket/ticketApi.ts)
- **Problem**: Visiting `/tickets/[id]/edit` rendered `TicketDetailView` with `id` interpreted as an incident template ID. Submitting the form dispatched `createTicket` (`POST /api/v1/tickets`), creating a duplicate ticket instead of updating the existing one.
- **Fix**: Added `updateTicket` mutation (`PUT /api/v1/tickets/{id}`) to `ticketApi.ts`. Created `EditTicketView.tsx` with pre-filled title, priority, description, category selector, and existing attachment removal. Updated `/tickets/[id]/edit/page.tsx` to mount `EditTicketView`.
- **Status**: 🟢 FIXED & VERIFIED.

---

### Bug FE-03: Commented-out Production URLs in Environment Config
- **File**: [`helpdesk-frontend/.env.development`](file:///D:/Course Wing/Final/fix/helpdesk-frontend/.env.development)
- **Problem**: Leftover Railway production URLs (`https://helpdesk-backend-production-2244.up.railway.app`) were present as commented-out code in `.env.development`.
- **Fix**: Removed dead production domains, standardized on local backend `http://localhost:8080/api/v1/`, and provided clean `.env.example`.
- **Status**: 🟢 FIXED & VERIFIED.

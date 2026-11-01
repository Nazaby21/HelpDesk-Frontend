# 08. Mobile Migration Roadmap & MVP Scope

## 1. MVP Scope Definition

To deliver immediate business value without getting blocked by administrative desktop features, the mobile application should be developed in two phases: **Phase 1: Core Operations MVP** and **Phase 2: Full System Parity**.

### In-Scope for Mobile MVP (Phase 1)
- **Authentication**: Email/Password login, automatic token refresh, secure token storage (`flutter_secure_storage`), role-based routing.
- **Incident Catalog & Reporting**: Browse categories and sub-issues, submit ticket with title, description, priority selector (`LOW`, `MEDIUM`, `HIGH`).
- **Camera & Photo Attachments**: Native image capture from camera or photo gallery, multi-image upload progress, and thumbnail preview gallery.
- **User Ticket Tracking (`USER` Role)**: List personal reported tickets, pull-to-refresh, status badges, formatted created date.
- **Technician Operations (`TECHNICIAN` Role)**: View organization ticket queue, filter by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), search by ticket title/ID.
- **Status Transitions**: "Accept" pending tickets (sets to `IN_PROGRESS`), "Close" active tickets (sets to `COMPLETED`).
- **Real-Time Ticket Chat**: Full STOMP/WebSocket bidirectional chat inside the ticket detail screen with auto-scroll and send indicator.
- **User Profile**: View user information, department, and ticket metrics.

### Deferred to Post-MVP (Phase 2)
- **Monthly Analytics Area Chart**: ApexCharts area trend chart (can be viewed on web portal).
- **User Management (Admin)**: Creating, editing, and deleting system users, assigning departments (desktop-oriented).
- **Category & Department CRUD**: Creating and deleting categories/departments (infrequent administrative operations).
- **Static Calendar**: Deprecate completely (leftover web template asset).

---

## 2. Implementation Milestones & Sprints

```mermaid
gantt
    title Flutter Mobile Migration Roadmap
    dateFormat  YYYY-MM-DD
    section Foundation
    Sprint 1: Architecture, Networking & Auth       :s1, 2026-11-01, 14d
    section Core MVP
    Sprint 2: Catalog & Ticket Submission (Camera) :s2, after s1, 14d
    Sprint 3: Ticket Feeds & Status Lifecycle      :s3, after s2, 14d
    Sprint 4: Real-time STOMP Chat Integration     :s4, after s3, 14d
    section MVP Polish & Testing
    Sprint 5: Push Notifications & QA Hardening    :s5, after s4, 14d
    section Post-MVP
    Sprint 6: Admin Management & Advanced Features :s6, after s5, 14d
```

### Sprint 1: Foundation, Design System & Authentication (Weeks 1-2)
- Initialize Flutter project with feature-first architecture.
- Implement Theme tokens, Satoshi fonts, light/dark mode support.
- Set up `Dio` client, `FlutterSecureStorage`, and `AuthInterceptor` (JWT injection + automated 401 refresh token queue).
- Build reusable UI primitives (`AppButton`, `AppTextField`, `AppBadge`, `AppBottomSheet`).
- Develop `LoginScreen` and configure `GoRouter` declarative route protection based on auth state.

### Sprint 2: Incident Catalog & Ticket Submission with Camera (Weeks 3-4)
- Implement `CategoryRepository` and `GET categories` consumer.
- Build Category Grid and Incident Template List views.
- Build Ticket Submission Screen:
  - Form validation for description and priority dropdown.
  - Native image picker integration (`image_picker`) supporting multi-image selection from camera or gallery.
  - Concurrent upload handler for `POST images/upload`.
  - Final ticket payload dispatch to `POST tickets`.

### Sprint 3: Ticket Feeds & Status Lifecycle (Weeks 5-6)
- Develop `TicketListScreen` with custom card layouts replacing desktop tables.
- Implement pull-to-refresh (`RefreshIndicator`) and client-side status filtering pills.
- Implement role-specific feeds (`GET tickets/my` for Users, `GET tickets` for Technicians).
- Build `TicketDetailScreen` showing requester metadata, description, and multi-image attachment gallery.
- Add status update triggers ("Accept Ticket" and "Close Ticket") via `PATCH tickets/{id}/status`.

### Sprint 4: Real-Time Ticket Chat over WebSocket (Weeks 7-8)
- Integrate `stomp_dart_client` pointing to `${backendUrl}/ws-chat`.
- Implement REST history fetcher (`GET tickets/{id}/messages`).
- Implement STOMP topic subscription (`/topic/ticket/{ticketId}`) with reactive state updates.
- Build sticky mobile chat bar with keyboard-aware padding (`MediaQuery.viewInsetsOf(context)`).
- Handle connection dropout and automatic reconnection retry logic.

### Sprint 5: Push Notifications, Polish & MVP Release (Weeks 9-10)
- Integrate Firebase Cloud Messaging (FCM) for background push notifications.
- Conduct cross-platform verification (iOS & Android devices, tablet form factors).
- App Store & Google Play internal testing release (TestFlight / Internal App Sharing).

### Sprint 6 (Post-MVP): Admin Features & Full Parity (Weeks 11-12)
- Implement User Management screens (`UserListScreen`, `AddUserScreen`, `EditUserScreen`).
- Implement Category Management screens (Main category & Sub-issue CRUD).
- Add Biometric Authentication (Face ID / Fingerprint via `local_auth`).

---

## 3. Technical & Delivery Risks

| Risk Factor | Likelihood | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **STOMP / SockJS Compatibility** | Medium | High | `stomp_dart_client` connects over raw WebSockets (`ws://`). If Spring Boot backend requires SockJS transport emulation, verify fallback or ensure the Spring WebSocket registry has `.setAllowedOriginPatterns("*")` and enables raw WebSocket transport (`/ws-chat/websocket`). |
| **Backend CORS & Proxy Dependency** | High | Critical | The web app relied on Next.js server proxying. Ensure backend developers verify that direct mobile requests to `http://<host>:8080/api/v1` are allowed and not blocked by Spring Security. |
| **Client-Side Slicing Overhead** | High | Medium | Without backend server-side pagination, fetching 1,000+ tickets on mobile startup will cause memory spikes and slow load times. Coordinate with backend team to implement `?page=0&size=15` query parameters early. |
| **Image Upload File Size** | Medium | Medium | Direct camera photos from modern smartphones can exceed 10MB. Use `flutter_image_compress` before dispatching files to `POST images/upload` to stay well within server file upload limits (typically 5MB). |
| **Token Expiry Race Conditions** | Medium | High | When multiple concurrent requests fail with 401, multiple refresh requests could be triggered. Use a queued Dio interceptor (`QueuedInterceptor`) to execute a single refresh while pausing pending requests. |

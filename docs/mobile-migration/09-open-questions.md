# 09. Open Questions & Architectural Decisions

This document details all ambiguities, inconsistencies, and architectural decisions identified during the deep analysis of the `helpdesk-frontend` codebase that must be decided before beginning Flutter mobile development.

---

## 1. Top 10 Critical Decisions for Mobile Development

### 1. Ticket Editing Behavior & Missing `PUT tickets/{id}` Endpoint
- **Code Reference**: [src/app/(Dashboard)/tickets/[id]/edit/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/tickets/[id]/edit/page.tsx) & [src/app/(Dashboard)/user/tickets/page.tsx#L79-L81](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/user/tickets/page.tsx#L79-L81)
- **Finding**: In `UserTicketsPage`, clicking the "Edit" action menu item on a pending ticket navigates the user to `/incident-catalog` instead of an edit screen. Furthermore, `/tickets/[id]/edit/page.tsx` renders `<TicketDetailView id={id} />`, which interprets `[id]` as a subcategory ID and executes `POST tickets` (creating a duplicate ticket) rather than updating the existing ticket. No `PUT tickets/{id}` or `PATCH tickets/{id}` endpoint exists in `ticketApi.ts`.
- **Decision Required**: Does the Spring Boot backend support editing an existing ticket description or replacing attachments before it is accepted by a technician? If yes, what is the endpoint signature? If no, should the "Edit" option be completely removed from the mobile app?

---

### 2. Direct Spring Boot Backend Access & CORS Configuration
- **Code Reference**: [src/app/api/v1/[...path]/route.ts](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/api/v1/[...path]/route.ts) & [src/redux/api.ts#L8-L10](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/redux/api.ts#L8-L10)
- **Finding**: The web client never communicates directly with Spring Boot; all REST traffic routes through the Next.js API proxy (`/api/v1/[...path]`), which deletes the `host` header to prevent CORS issues.
- **Decision Required**: The Flutter app will call the Spring Boot API directly (e.g. `http://api.company.com/api/v1/` or `https://helpdesk-backend-production-2244.up.railway.app/api/v1`). Is the Spring Boot backend configured to accept direct mobile requests without restrictive CORS origin policies?

---

### 3. Server-Side Pagination vs Client-Side In-Memory Slicing
- **Code Reference**: [src/app/(Dashboard)/tickets/page.tsx#L88-L92](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/tickets/page.tsx#L88-L92) & [src/redux/feature/ticket/ticketApi.ts#L58](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/redux/feature/ticket/ticketApi.ts#L58)
- **Finding**: While the backend responds with a Spring Data page structure (`{ content: TicketResponse[] }`), `ticketApi.ts` extracts all items, and the UI performs in-memory slicing (7 items per page). For mobile devices, loading an unbounded array of tickets will degrade performance and waste cellular data.
- **Decision Required**: Does the backend support query parameters such as `?page=0&size=15&sort=createdAt,desc` on `GET tickets`, `GET tickets/my`, and `GET tickets/history`? If so, should mobile implement infinite scrolling instead of pagination buttons?

---

### 4. Server-Side Filtering & Search Support
- **Code Reference**: [src/app/(Dashboard)/tickets/page.tsx#L70-L84](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/tickets/page.tsx#L70-L84)
- **Finding**: Search queries and status filters (`PENDING`, `IN_PROGRESS`, `COMPLETED`) are evaluated entirely on the client using JavaScript `.filter()`. If the backend only returns the first page of results, client-side filtering will fail to find matching records on subsequent pages.
- **Decision Required**: Does the backend support filtering via query parameters (e.g., `GET tickets?status=PENDING&search=monitor`)?

---

### 5. WebSocket Authentication & Connection Protocol
- **Code Reference**: [src/components/Tickets/TicketChat.tsx#L36-L59](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Tickets/TicketChat.tsx#L36-L59)
- **Finding**: In web, `TicketChat.tsx` connects to `/ws-chat` using `SockJS` without passing an `Authorization: Bearer <token>` in the STOMP connect headers. Flutter does not run a browser JS engine; it uses native Dart WebSockets (`ws://.../ws-chat` or `ws://.../ws-chat/websocket`).
- **Decision Required**: Does the Spring Boot backend support native WebSockets without SockJS emulation? Does it require JWT tokens passed in the STOMP `connectHeaders: {'Authorization': 'Bearer <token>'}`?

---

### 6. Notification Center & Activity Feed Integration
- **Code Reference**: [src/components/Layouts/header/index.tsx#L69](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Layouts/header/index.tsx#L69) & [src/components/Layouts/header/notification/index.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Layouts/header/notification/index.tsx)
- **Finding**: The notification bell is commented out in the web header (`{/* <Notification /> */}`), yet a complete, functional component exists that queries `GET tickets/activity` and tracks unread count in `localStorage`.
- **Decision Required**: Should the mobile app include an in-app Notification Center backed by `GET tickets/activity`? Furthermore, is there a plan to integrate Firebase Cloud Messaging (FCM) for background push notifications?

---

### 7. Profile Photo Upload Persistence
- **Code Reference**: [src/components/Settings/upload-photo.tsx#L40-L82](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Settings/upload-photo.tsx#L40-L82) & [src/components/Profile/ProfileView.tsx#L23-L44](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Profile/ProfileView.tsx#L23-L44)
- **Finding**: In both Settings and Profile screens, selecting a profile photo creates a temporary browser blob URL (`URL.createObjectURL(file)`) without making any API request to persist it. However, `UserResponse` contains an `imageUrl: string | null` field, and `POST images/upload` exists.
- **Decision Required**: Should mobile allow users to update their avatar by uploading the image via `POST images/upload` and updating the user profile via `PUT users/{id}`?

---

### 8. Self-Service Profile Editing vs Admin-Only
- **Code Reference**: [src/components/Settings/personal-info.tsx#L29-L53](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Settings/personal-info.tsx#L29-L53)
- **Finding**: In the Settings screen, all user personal information inputs (First Name, Last Name, Email) are hardcoded with `disabled={true}`. Only Admins can edit users via `/users/[id]/edit`.
- **Decision Required**: Can regular users and technicians update their own profile details (phone number, name) on mobile, or is user information strictly admin-managed?

---

### 9. Forgot Password & Account Recovery Flow
- **Code Reference**: [src/app/(Auth)/auth/sign-in/page.tsx#L115-L121](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Auth)/auth/sign-in/page.tsx#L115-L121)
- **Finding**: On the sign-in screen, the "Forgot password?" button has no click handler (`type="button"`, no `onClick`), and "Contact IT Support" links to `#`.
- **Decision Required**: Is there an existing backend API for password recovery/reset (e.g. `POST auth/forgot-password`), or should the mobile app launch a mailto / phone link to the IT support desk?

---

### 10. Timezone Standardization
- **Code Reference**: [src/utils/date.ts#L12-L28](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/utils/date.ts#L12-L28)
- **Finding**: Both `formatDate` and `formatDateTime` hardcode the timezone to `"Asia/Phnom_Penh"` (UTC+7, Cambodia).
- **Decision Required**: Should the mobile app continue forcing all timestamps to `Asia/Phnom_Penh`, or should it format dates according to the device's local timezone?

---

## 2. Additional Secondary Observations

1. **Static Calendar Component**:
   [src/app/(Dashboard)/calendar/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/calendar/page.tsx) is not linked anywhere in the navigation sidebar or header. It contains a static calendar table with hardcoded events ("Redesign Website", "App Design"). **Recommendation: Exclude from Flutter app.**
2. **Dynamic Fields in Incident Templates**:
   In [src/components/Helpdesk/IncidentCatalogView.tsx#L47](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/IncidentCatalogView.tsx#L47), `dynamicIncidents` defines `fields: [] // dynamic custom fields empty for now`. Is there an upcoming requirement to support custom dynamic form fields per category (e.g., asset tag, software version)?
3. **Monthly Chart Data Mapping**:
   [payments-overview/index.tsx#L12](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Charts/payments-overview/index.tsx#L12) hardcodes 12 month labels (`Jan` through `Dec`), and maps `monthlyStats.received` to "Completed" tickets and `monthlyStats.due` to "Pending" tickets. Clarify with backend team whether `received` truly represents completed tickets or incoming created tickets.

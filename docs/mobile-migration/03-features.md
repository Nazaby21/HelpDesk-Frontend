# 03. Feature Inventory & Mobile Prioritization

## 1. Feature Inventory by Functional Module

---

### Module 1: Authentication & Session Management

#### Feature 1.1: User Login
- **User Story**: *As an authenticated employee (User, Technician, or Admin), I want to sign in using my email and password so that I can access my designated helpdesk portal.*
- **Screens Involved**: `/auth/sign-in` ([src/app/(Auth)/auth/sign-in/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Auth)/auth/sign-in/page.tsx)).
- **Business Rules & Validations**:
  - Both email and password fields are required.
  - Email format validated against regex: `/\S+@\S+\.\S+/`.
  - Backend returns `accessToken`, `refreshToken`, and `user` object (or flat user properties).
  - Both tokens and user profile must be persisted to local storage for session rehydration.
  - Automatically redirects users according to role (`USER` -> `/user/tickets`, `TECHNICIAN`/`ADMIN` -> `/`).
- **API Endpoints**: `POST auth/login` ([authApi.ts](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/redux/feature/auth/authApi.ts)).
- **Mobile MVP Priority**: **Must**
- **Complexity**: Low

#### Feature 1.2: Token Refresh & Session Continuity
- **User Story**: *As a logged-in user, I want my session to remain active seamlessly without being unexpectedly logged out when my short-lived access token expires.*
- **Screens Involved**: Cross-cutting / Global HTTP Interceptor.
- **Business Rules & Validations**:
  - When an authenticated API call fails with HTTP 401, the interceptor must pause subsequent requests, trigger `POST auth/refresh` using the stored `refreshToken`, update the stored `accessToken`, and retry the original failed request.
  - If the refresh token has expired or is invalid, wipe the stored session and force the user back to `/auth/sign-in`.
- **API Endpoints**: `POST auth/refresh`.
- **Mobile MVP Priority**: **Must**
- **Complexity**: Medium

#### Feature 1.3: User Logout
- **User Story**: *As a user, I want to securely log out of the application so that unauthorized individuals cannot access my account on this device.*
- **Screens Involved**: Header User Menu ([user-info/index.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Layouts/header/user-info/index.tsx)).
- **Business Rules & Validations**:
  - Triggers backend revocation via `POST auth/logout`.
  - Clears in-memory auth state, access token, and persistent secure storage.
  - Redirects user immediately to the login view.
- **API Endpoints**: `POST auth/logout`.
- **Mobile MVP Priority**: **Must**
- **Complexity**: Low

---

### Module 2: Dashboard & Analytics

#### Feature 2.1: Key Performance Indicators (KPI Cards)
- **User Story**: *As a Technician or Administrator, I want to view high-level ticket counters (Total, Pending, Completed, and Total Users) on launch so that I can immediately gauge team workload.*
- **Screens Involved**: `/` ([src/app/(Dashboard)/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/page.tsx), [overview-cards/index.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Dashboard/overview-cards/index.tsx)).
- **Business Rules & Validations**:
  - Only visible to `TECHNICIAN` and `ADMIN` roles.
  - The "Total Users" card is restricted to `ADMIN` only; Technicians see a 3-card layout.
  - Numbers formatted using compact notation (e.g. 1.2k) via `compactFormat`.
- **API Endpoints**: `GET tickets/stats`.
- **Mobile MVP Priority**: **Should** (Can show simplified metrics on mobile dashboard).
- **Complexity**: Low

#### Feature 2.2: Monthly Ticket Trends Chart
- **User Story**: *As a Technician or Administrator, I want to see a monthly visual comparison between completed and pending tickets so that I can evaluate resolution efficiency over time.*
- **Screens Involved**: `/` ([payments-overview/index.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Charts/payments-overview/index.tsx), [chart.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Charts/payments-overview/chart.tsx)).
- **Business Rules & Validations**:
  - Queries stats for the current calendar year (`new Date().getFullYear()`).
  - Displays two series: "Completed" (from `received` array) and "Pending" (from `due` array) across 12 monthly intervals.
- **API Endpoints**: `GET tickets/stats/monthly?year={year}`.
- **Mobile MVP Priority**: **Could** (Nice to have for mobile; KPI cards suffice for MVP).
- **Complexity**: Medium

---

### Module 3: Incident Catalog & Ticket Submission

#### Feature 3.1: Category & Template Exploration
- **User Story**: *As an employee, I want to browse IT issue categories and select specific incident templates so that my problem is routed to the correct department.*
- **Screens Involved**: `/incident-catalog` ([IncidentCatalogView.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/IncidentCatalogView.tsx), [CategoryGrid.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/CategoryGrid.tsx), [IncidentList.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/IncidentList.tsx)).
- **Business Rules & Validations**:
  - Displays top-level categories in a searchable grid.
  - Selecting a category reveals its list of sub-issue templates.
  - Selecting an incident template navigates to the ticket submission form with the corresponding SubCategory ID.
- **API Endpoints**: `GET categories`.
- **Mobile MVP Priority**: **Must**
- **Complexity**: Low

#### Feature 3.2: Ticket Creation with Multi-Image Attachments
- **User Story**: *As an employee, I want to describe my technical issue, set an urgency level, and attach photos or screenshots so that technicians have full context to resolve it.*
- **Screens Involved**: `/incident-catalog/[id]` ([TicketDetailView.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/ticket/TicketDetailView.tsx), [FileUploadBox.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Helpdesk/ticket/FileUploadBox.tsx)).
- **Business Rules & Validations**:
  - Description is mandatory; empty descriptions prevent submission and trigger a Toast alert.
  - Priority defaults to `MEDIUM` (`LOW`, `MEDIUM`, `HIGH`).
  - Images selected by the user are uploaded concurrently via `POST images/upload` using `multipart/form-data`.
  - Returned image URLs are compiled into an `imageUrls` string array and sent in the ticket creation payload.
  - Initial ticket status is always initialized to `PENDING`.
  - On submission success, displays a toast and navigates to the newly created ticket detail view after 1.5s.
- **API Endpoints**:
  - `POST images/upload`
  - `POST tickets`
- **Mobile MVP Priority**: **Must**
- **Complexity**: High (Camera/Gallery native integration + multi-file upload progress).

---

### Module 4: Ticket Management & Resolution Workflow

#### Feature 4.1: Organization Ticket Queue (Technician & Admin)
- **User Story**: *As a Technician or Admin, I want to view a paginated list of all organization tickets with status filters and search so that I can identify unassigned or critical incidents.*
- **Screens Involved**: `/tickets` ([tickets/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/tickets/page.tsx), [TicketTable.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Tickets/TicketTable.tsx)).
- **Business Rules & Validations**:
  - Filterable by status: `ALL`, `PENDING`, `IN_PROGRESS`, `COMPLETED`.
  - Searchable by ticket ID, title, or department.
  - High priority tickets in `PENDING` state highlighted with red visual indicator.
  - 7 items per page pagination.
- **API Endpoints**: `GET tickets`.
- **Mobile MVP Priority**: **Must**
- **Complexity**: Medium

#### Feature 4.2: My Tickets Queue (Regular User)
- **User Story**: *As an employee, I want to track the status of tickets I personally submitted so that I know when a technician has begun working on them.*
- **Screens Involved**: `/user/tickets` ([user/tickets/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/user/tickets/page.tsx)).
- **Business Rules & Validations**:
  - Only fetches tickets authored by the current authenticated user.
  - Hides the "Assigned To" column.
  - Provides quick action to view ticket details.
- **API Endpoints**: `GET tickets/my`.
- **Mobile MVP Priority**: **Must**
- **Complexity**: Low

#### Feature 4.3: Ticket Status Lifecycle Management
- **User Story**: *As a Technician, I want to accept a pending ticket to mark it in-progress, and close it when resolved, so that ticket statuses accurately reflect real-world progress.*
- **Screens Involved**: `/tickets`, `/tickets/[id]` ([TicketDetail.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Tickets/TicketDetail.tsx)).
- **Business Rules & Validations**:
  - **Accept Action**: Available only when ticket is in `PENDING` status. Sends PATCH request updating status to `IN_PROGRESS` with remark "Accepted by technician".
  - **Close Action**: Available when ticket is in `IN_PROGRESS` status (or from table for non-users). Sends PATCH request updating status to `COMPLETED` with remark "Closed by technician".
  - Automatic cache invalidation of `Ticket` tag in RTK Query updates all open lists and counter metrics immediately.
- **API Endpoints**: `PATCH tickets/{id}/status`.
- **Mobile MVP Priority**: **Must**
- **Complexity**: Medium

#### Feature 4.4: Ticket History
- **User Story**: *As a user or technician, I want to review past completed tickets and their completion dates so that I have a record of past incident resolutions.*
- **Screens Involved**: `/user/history` ([user/history/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/user/history/page.tsx)).
- **Business Rules & Validations**:
  - Displays resolved tickets with `completedAt` timestamp formatted in `Asia/Phnom_Penh` timezone.
- **API Endpoints**: `GET tickets/history`.
- **Mobile MVP Priority**: **Should**
- **Complexity**: Low

---

### Module 5: Real-time Ticket Communication (Chat)

#### Feature 5.1: Real-time Incident Chat
- **User Story**: *As a requester or assigned technician, I want to communicate in real-time within the ticket page so that we can ask clarifying questions and coordinate troubleshooting.*
- **Screens Involved**: `/tickets/[id]` ([TicketChat.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Tickets/TicketChat.tsx)).
- **Business Rules & Validations**:
  - Historical messages retrieved on screen mount via `GET tickets/{id}/messages`.
  - Connects to Spring Boot STOMP broker over SockJS at `/ws-chat`.
  - Subscribes to topic destination: `/topic/ticket/{ticketId}`.
  - Dispatches messages to STOMP destination: `/app/chat` with body:
    `{ ticketId, senderId, sender, content }`.
  - Chat bubbles aligned right for current user, left for other participants.
  - Message deduplication by message ID.
  - Auto-scroll to bottom on receipt of new messages.
- **API Endpoints**:
  - REST: `GET tickets/{id}/messages`
  - WebSocket: `/ws-chat`, Subscribe `/topic/ticket/{ticketId}`, Send `/app/chat`
- **Mobile MVP Priority**: **Must**
- **Complexity**: High

---

### Module 6: Category Management (Admin & Technician)

#### Feature 6.1: Main Category & Sub-Issue Administration
- **User Story**: *As an Admin or Technician, I want to create, inspect, and delete categories and sub-issues so that the incident catalog stays aligned with organizational IT services.*
- **Screens Involved**: `/categories` ([CategoryManager.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Categories/CategoryManager.tsx), [CreateCategoryModal.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Categories/CreateCategoryModal.tsx)).
- **Business Rules & Validations**:
  - Creating a main category sends `parentId: null`.
  - Creating a sub-issue sends `parentId: number`.
  - Category deletion warns that all sub-issues will also be cascade deleted.
  - Deleting either entity calls `DELETE categories/{id}` and invalidates the `Category` cache tag.
- **API Endpoints**:
  - `GET categories`
  - `POST categories`
  - `DELETE categories/{id}`
- **Mobile MVP Priority**: **Should** (Can be deferred to post-MVP web-only if mobile MVP is focused on core user/tech ticket workflows).
- **Complexity**: Medium

---

### Module 7: User & Department Administration (Admin Only)

#### Feature 7.1: User Directory & Search
- **User Story**: *As an Administrator, I want to see a searchable, paginated directory of all registered system users with their roles, departments, and last active status.*
- **Screens Involved**: `/users` ([users/page.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/app/(Dashboard)/users/page.tsx), [UserTable.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Users/UserTable.tsx)).
- **Business Rules & Validations**:
  - Searchable by name, email, or role string.
  - Displays relative last active time with hover tooltip showing absolute timestamp.
  - 10 users per page pagination.
- **API Endpoints**: `GET users`.
- **Mobile MVP Priority**: **Could** (Admin features are typically secondary on mobile).
- **Complexity**: Low

#### Feature 7.2: User Provisioning & Editing
- **User Story**: *As an Administrator, I want to provision new user accounts, assign roles and departments, or update existing user credentials.*
- **Screens Involved**: `/users/add` ([AddUserForm.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Users/AddUserForm.tsx)), `/users/[id]/edit` ([EditUserForm.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Users/EditUserForm.tsx)).
- **Business Rules & Validations**:
  - First name, last name, email, password (on create), and role (`ADMIN`, `TECHNICIAN`, `USER`) are required.
  - Password on edit can be left blank to preserve current password.
- **API Endpoints**:
  - `POST users`
  - `GET users/{id}`
  - `PUT users/{id}`
- **Mobile MVP Priority**: **Could**
- **Complexity**: Medium

#### Feature 7.3: Inline Department Creation
- **User Story**: *As an Administrator creating a user, I want to add a missing department inline so that I don't lose my current form progress.*
- **Screens Involved**: Modal launcher within `/users/add` and `/users/[id]/edit` ([CreateDepartmentModal.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Users/CreateDepartmentModal.tsx)).
- **Business Rules & Validations**:
  - Requires non-empty department name.
  - Automatically selects the newly created department in the dropdown upon creation.
- **API Endpoints**:
  - `GET departments`
  - `POST departments`
- **Mobile MVP Priority**: **Could**
- **Complexity**: Low

#### Feature 7.4: User Deletion
- **User Story**: *As an Administrator, I want to delete user accounts with a confirmation prompt.*
- **Screens Involved**: Modal on `/users`.
- **Business Rules & Validations**:
  - Confirmation modal required before executing deletion.
- **API Endpoints**: `DELETE users/{id}`.
- **Mobile MVP Priority**: **Could**
- **Complexity**: Low

---

### Module 8: Profile & Account Settings

#### Feature 8.1: Profile View & Metric Counters
- **User Story**: *As any logged-in user, I want to view my profile details, department, and ticket metrics (Created, Assigned, Resolved, Open) so that I have visibility into my account activity.*
- **Screens Involved**: `/profile` ([ProfileView.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Profile/ProfileView.tsx)).
- **Business Rules & Validations**:
  - Fetches full profile by current user ID.
  - Displays formatted Joined date in `Asia/Phnom_Penh` timezone.
  - Local image file picker previews avatar and cover without backend persistence.
- **API Endpoints**: `GET users/{id}`.
- **Mobile MVP Priority**: **Should**
- **Complexity**: Low

#### Feature 8.2: Account Settings (Personal Info)
- **User Story**: *As a user, I want to view my account contact details in the settings tab.*
- **Screens Involved**: `/pages/settings` ([personal-info.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Settings/personal-info.tsx), [upload-photo.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Settings/upload-photo.tsx)).
- **Business Rules & Validations**:
  - Read-only display of First Name, Last Name, and Email (all inputs disabled).
  - Photo upload widget is purely visual in current web version.
- **API Endpoints**: None.
- **Mobile MVP Priority**: **Could** (Consolidate into Profile tab in Flutter).
- **Complexity**: Low

---

## 2. Cross-Cutting Technical Features

| Feature Concern | Web Implementation | Mobile / Flutter Strategy |
| :--- | :--- | :--- |
| **Authentication & Tokens** | Short-lived JWT + DB stored Refresh Token. Persisted in `localStorage`. | Store JWT & Refresh Token in `flutter_secure_storage`. Intercept 401 with Dio interceptor to auto-refresh token. |
| **Role-Based Routing** | Checked client-side via `AuthGuard.tsx` and `useRole()`. | Declarative route redirection in `GoRouter` based on `authState.role`. |
| **Search & Filtering** | Executed in-memory on client arrays (`apiTickets.filter(...)`). | For MVP, maintain client-side filtering. Post-MVP: implement backend query params (`?search=&status=`). |
| **Pagination** | Client-side array slicing (`tickets.slice(start, end)`), 7 or 10 items/page. | Replace table page buttons with mobile infinite scrolling or pull-to-refresh paginated `ListView`. |
| **File & Image Upload** | Browser `<input type="file" multiple>` sending `FormData` to `POST images/upload`. | Use `image_picker` to capture from Camera or Photos, upload via `dio` `FormData`. |
| **Notifications & Activity Feed** | Component exists in [notification/index.tsx](file:///D:/Course%20Wing/Final/fix/helpdesk-frontend/src/components/Layouts/header/notification/index.tsx) querying `tickets/activity` (currently commented out in header). | Mobile can restore this via an in-app Activity notification screen, or integrate native FCM push notifications. |
| **Dark Mode** | `next-themes` toggling CSS classes on `<html>`. | Flutter `ThemeMode.system / light / dark` utilizing custom `ThemeData` tokens. |
| **Timezone & Localization** | Hardcoded `Asia/Phnom_Penh` timezone using JS `Intl.DateTimeFormat`. | Hardcode Cambodian timezone or read device locale via `intl` package. |
| **Web-Only (Drop for Mobile)** | NextTopLoader bar, SSR proxy handlers, next/image remote patterns, desktop hover tooltips. | Completely omit. Use native progress indicators and cached network image widgets. |

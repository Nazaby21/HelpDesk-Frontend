# Helpdesk Support System - Frontend Dashboard (Local Setup)

This is the Next.js frontend web application for the Helpdesk Support System. It provides a responsive administration dashboard for Users, Technicians, and Admins to manage tickets, categories, departments, users, and notifications locally.

## Tech Stack
* **Framework**: Next.js 16 (App Router + Turbopack)
* **Language**: TypeScript
* **State Management**: Redux Toolkit & RTK Query
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **WebSocket Client**: SockJS + StompJS (plus REST chat persistence)

## Running Locally

### 1. Prerequisites
* Node.js 18+ (Node 20+ recommended)
* npm

### 2. Environment Configuration
Create or inspect `.env.development` (or `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/
COOKIE_REFRESH_TOKEN_NAME=final-refresh-token
```

### 3. Installation & Run
```powershell
cd helpdesk-frontend
npm.cmd install
npm.cmd run dev
```

The application runs at [http://localhost:3000](http://localhost:3000).

### 4. Code Quality & Build Checks
```powershell
npm.cmd run lint
npm.cmd run build
```

## Implemented Routes & Features
| Route | Role Access | Description |
|---|---|---|
| `/auth/sign-in` | Public | Email & password sign-in with automatic token refresh |
| `/dashboard` | `admin`, `technician` | KPI metrics & monthly resolution chart (`GET /dashboard`) |
| `/tickets` | `admin`, `technician` | Organization ticket queue with Status & Priority filters, Edit & Delete actions |
| `/tickets/[id]` | All authenticated | Full ticket detail, Accept/Close with remark modal, Live Chat (STOMP + REST), Status Lifecycle Logs, Audit History, Edit & Delete |
| `/tickets/[id]/edit` | All authenticated | Edit ticket title, description, priority, status, sub-issue, assignee, and attachments (`PUT /tickets/{id}`) |
| `/categories` | `admin`, `technician` | Category & Sub-Issue CRUD (`POST`, `PUT`, `DELETE /categories/{id}`) |
| `/departments` | `admin` | Department CRUD (`GET`, `POST`, `PUT`, `DELETE /departments/{id}`) |
| `/users` | `admin` | User Directory search, role filter, pagination, Edit & Delete (`GET /users`) |
| `/users/add` | `admin` | Create user with department & inline department modal (`POST /users`) |
| `/users/[id]/edit` | `admin` | Edit user details, role, department, and password (`PUT /users/{id}`) |
| `/user/incident-catalog` | All authenticated | Incident category browser |
| `/user/tickets/create` | All authenticated | Create ticket with category, sub-issue, priority, and attachments (`POST /tickets`) |
| `/user/tickets` | All authenticated | Personal tickets queue with Status & Priority filters (`GET /tickets/my-tickets`) |
| `/user/history` | All authenticated | Completed tickets archive with Priority filter |
| `/profile` | All authenticated | User profile & personal ticket statistics (`GET /users/me`) |
| `/pages/settings` | All authenticated | Self-service profile & photo update (`PUT /users/me`, `POST /images/upload`) |

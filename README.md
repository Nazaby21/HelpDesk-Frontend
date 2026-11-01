# Helpdesk Support System - Frontend Dashboard (Local Setup)

This is the Next.js frontend web application for the Helpdesk Support System. It provides a responsive administration dashboard for Users, Technicians, and Admins to manage tickets locally.

## Tech Stack
* **Framework**: Next.js 16 (App Router + Turbopack)
* **Language**: TypeScript
* **State Management**: Redux Toolkit & RTK Query
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **WebSocket Client**: SockJS + StompJS

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

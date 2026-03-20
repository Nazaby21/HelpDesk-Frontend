# Helpdesk Support System - Frontend Dashboard

This is the Next.js frontend application for the Helpdesk Support System. It provides a sleek, responsive, and dynamic administration dashboard for Users, Technicians, and Admins to manage support tickets effectively.

## Tech Stack
* **Framework**: Next.js 14+ (App Router)
* **Language**: TypeScript
* **State Management**: Redux Toolkit
* **API Fetching**: RTK Query
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Authentication**: Custom JWT Auth Context

## Features
* **Role-Based Interfaces**: Unique dashboard layouts and permission restrictions for Users (creating tickets), Technicians (resolving tickets), and Admins (managing sub-categories and metrics).
* **Advanced Helpdesk Operations**: 
  - Dynamic interactive forms for incident cataloging.
  - Interactive multi-image attachment uploader with live thumbnail visual previews.
  - Real-time ticket status tracking and responsive tables.
* **Integrated WebSocket Chat**: Integrated chat UI for technicians and users to communicate dynamically about specific tickets.
* **RTK Query Optimizations**: Secure JWT interception, automated token refreshing on 401s, and automated cache invalidation to keep the dashboard stats and ticket lists instantly synchronized.

## Getting Started

### Prerequisites
* Node.js 18+
* npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables. Ensure the backend API URL is pointing to your active Spring Boot instance. Create a `.env.development` file in the root if necessary.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
This project is Next.js deployment ready. It can be easily deployed to Vercel, Railway, or fully containerized via Docker. Make sure to map your `NEXT_PUBLIC_API_URL` to your production backend server endpoint.

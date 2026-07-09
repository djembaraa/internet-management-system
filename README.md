# DJ Internet Management System (DJ-IMS)

> Web-based internet network management dashboard for Internet Service Providers (ISP).  
> Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS 4**.

---

## 📋 Table of Contents

- [About the Application](#about-the-application)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [Demo Accounts](#demo-accounts)
- [Folder Structure](#folder-structure)
- [Features](#features)
- [Scripts](#scripts)
- [Development Notes](#development-notes)

---

## About the Application

DJ Internet Management System is a robust network management dashboard providing:

- **Admin Dashboard** — Statistical overview of clients, connections, and revenue.
- **Client Dashboard** — Connection status, device information, and traffic monitoring.
- **Monitoring** — ONU/OLT monitoring and PPPoE client traffic.
- **Router, PPPoE, Hotspot Management** — CRUD operations for profiles and client data.
- **Billing & Invoice** — Invoice management and payment tracking.
- **Accounting** — Financial reports, income/expense tracking.
- **Ticket Support** — Client support ticketing system.
- **Notifications** — Telegram and WhatsApp gateway integrations.

The application has **2 primary roles**: **Admin** and **Client**, each with distinct navigation and dashboard views.

---

## Tech Stack

| Category        | Technology                          |
| --------------- | ----------------------------------- |
| Framework       | React 19                            |
| Language        | TypeScript 5.9                      |
| Build Tool      | Vite 7                              |
| Styling         | Tailwind CSS 4                      |
| State Management| Zustand 5                           |
| Routing         | React Router DOM 7                  |
| Charts          | Recharts 3                          |
| Icons           | Lucide React                        |
| Form            | React Hook Form + Zod               |
| HTTP Client     | Axios                               |

---

## System Requirements

- **Node.js** >= 18.x (v20+ recommended)
- **npm** >= 9.x or **yarn** >= 1.22
- **Git**

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/djembaraa/internet-management-system.git
cd internet-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be running at:

```
http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
```

The build output will be available in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

---

## Demo Accounts

The application currently utilizes **dummy data** (mock data). Use the following credentials to log in:

### 🔑 Admin

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

> **Admin** has full access to all features: Dashboard, Monitoring, Router, PPPoE, Hotspot, Billing, Telegram, Accounting, WhatsApp, Log, and Tickets.

### 🔑 Client

| Field    | Value       |
| -------- | ----------- |
| Username | `client`    |
| Password | `client123` |

> **Client** only views: Dashboard (connection status), Invoices, Network Management, and Tickets.

---

## Folder Structure

```
src/
├── App.tsx                         # Root routing (role-based dashboard)
├── main.tsx                        # Entry point
├── index.css                       # Global styles & design tokens
│
├── components/                     # Shared/reusable components
│   ├── Layout.tsx                  # Main layout + navigation (admin/client)
│   ├── Modal.tsx                   # Reusable modal dialog
│   ├── EmptyState.tsx              # Empty data placeholder
│   └── ProtectedRoute.tsx          # Auth guard
│
├── store/
│   └── themeStore.ts               # Dark/light mode state (Zustand)
│
├── services/
│   └── api.ts                      # Axios instance / API config
│
└── features/
    ├── auth/                       # Authentication
    ├── dashboard/                  # Admin dashboard
    ├── client/                     # Client-specific pages
    ├── monitoring/                 # ONU/OLT & Traffic Monitoring
    ├── router/                     # Router management + data layer
    ├── pppoe/                      # PPPoE management
    ├── hotspot/                    # Hotspot management
    ├── invoice/                    # Billing / Invoice
    ├── accounting/                 # Accounting / Financial reports
    ├── telegram/                   # Telegram integration
    ├── whatsapp/                   # WhatsApp gateway
    ├── log/                        # Activity log
    ├── ticket/                     # Ticket support (admin view)
    └── account/                    # My account / profile
```

---

## Features

### Admin Panel

| Menu         | Description |
| ------------ | ----------- |
| Dashboard    | Statistical overview: total clients, online status, revenue, traffic charts. |
| Monitoring   | ONU and OLT tables, PPPoE Client Traffic. |
| Router       | List of routers including connection status and uptime. |
| PPPoE        | PPPoE Profile and Client management. |
| Hotspot      | Hotspot Profiles, Voucher list, and Voucher editor. |
| Billing      | Invoice list and payment statuses. |
| Telegram     | Telegram bot configuration for notifications. |
| Accounting   | Financial reports: vouchers sold, invoices, income/expenses, margin. |
| WhatsApp     | WhatsApp gateway configurations. |
| Log          | System activity logs. |
| Ticket       | Support tickets submitted by clients. |

### Client Panel

| Menu            | Description |
| --------------- | ----------- |
| Dashboard       | Connection status, device information, traffic charts. |
| Invoice         | Billing history and payment status. |
| Network Info    | Network device information. |
| Ticket          | Create and track support tickets (limit 3/day). |

---

## Scripts

| Command            | Function |
| ------------------ | -------- |
| `npm run dev`      | Start development server (HMR) |
| `npm run build`    | Build for production |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint |

---

## Development Notes

### Dummy Data

All current data uses **mock data** stored in:

```
src/features/router/constants.ts
```

This file contains all dummy constants for: routers, PPPoE, hotspot, invoices, logs, tickets, ONU, OLT, traffic, accounting, and client data.

To switch to real API data, replace the imported data from `constants.ts` with fetches from `services/api.ts` or Supabase.

### Type Definitions

All TypeScript interfaces are defined in:

```
src/features/router/types.ts
```

### Dark Mode

The application fully supports **dark mode**. A toggle is available in the header. State is persisted in `localStorage` via Zustand (`themeStore.ts`).

### Role-Based Navigation

The layout automatically displays distinct menus based on the user's role:
- **Admin/Root** → 11 navigation menus
- **Client** → 4 navigation menus (Dashboard, Invoice, Network Info, Ticket)

---

## 📄 Documentation

For further architectural and technical details, please refer to our [Single Source of Truth (SOT)](docs/SOT.md).

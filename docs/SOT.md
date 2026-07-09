# DJ Internet Management System (DJ-IMS) - Single Source of Truth (SOT)

## 1. Project Overview
**DJ Internet Management System** is a comprehensive, web-based network management dashboard tailored for Internet Service Providers (ISPs). It handles client management, network monitoring (ONU/OLT, PPPoE, Hotspot), billing & invoicing, and ticket support. 

## 2. Tech Stack
- **Framework:** React 19
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand 5
- **Routing:** React Router DOM 7
- **Data Fetching:** Axios
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts 3
- **Icons:** Lucide React

## 3. Architecture & File Structure
```
src/
├── App.tsx                         # Root routing with Role-based Access Control (RBAC)
├── main.tsx                        # Application entry point
├── index.css                       # Global styles and Tailwind directives
├── components/                     # Reusable UI components (Modals, Buttons, Layouts, etc.)
├── store/                          # Global Zustand stores (e.g., Theme, Auth, Invoice Templates)
├── services/                       # API integration, Supabase client initialization
└── features/                       # Modular feature-based directory
    ├── auth/                       # Login and Authentication handling
    ├── dashboard/                  # Admin and Root Dashboard views
    ├── client/                     # Client-side views (Network, Invoice, Tickets, Dashboard)
    ├── monitoring/                 # Traffic and ONU/OLT Monitoring pages
    ├── router/                     # Router configurations and Mock Data (Constants)
    ├── pppoe/                      # PPPoE Profile and Client management
    ├── hotspot/                    # Hotspot and Voucher management
    ├── invoice/                    # Billing, Manual Invoices, PPPoE Invoices
    ├── accounting/                 # Financial reporting
    ├── settings/                   # Configurations for Gateways and Templates
    ├── telegram/ & whatsapp/       # Notification integrations
    ├── log/ & ticket/              # System logs and client support tickets
    └── account/                    # User account settings
```

## 4. Workflows & State Management
### 4.1 Role-Based Access Control (RBAC)
The application defines three primary roles:
1. **Root**: Superadmin with access to all features, including system user management (`RootDashboard`).
2. **Admin**: Managerial access to monitoring, routers, PPPoE, Hotspots, billing, and system configurations.
3. **Client**: End-user access. Restricted to viewing connection status (`ClientDashboard`), personal invoices, network info, and submitting support tickets.

*Routing logic resides in `src/App.tsx` and `src/components/ProtectedRoute.tsx`.*

### 4.2 State Management (Zustand)
- **`useAuthStore`** (`src/features/auth/store/authStore.ts`): Manages the currently logged-in user, session tokens, and role. Uses persistence (localStorage).
- **`useThemeStore`** (`src/store/themeStore.ts`): Handles light/dark mode toggling.
- **`useInvoiceTemplateStore`** (`src/store/invoiceTemplateStore.ts`): Stores customizable invoice configurations (header, footer, notes).

### 4.3 Data Flow & API
Currently, the application relies heavily on Mock Data stored in `src/features/router/constants.ts` to simulate API calls. 
- **Future Backend (Supabase):** The Supabase client is initialized in `src/services/supabase.ts`. Future development will replace mock data with Supabase queries (e.g., fetching users from `auth.users`, fetching profiles from `public.pppoe_profiles`, etc.).
- **HTTP Client:** Existing REST structures use `src/services/api.ts` via Axios.

## 5. UI/UX & Design Guidelines
- **Consistency:** The system utilizes Tailwind CSS 4. Always use semantic Tailwind classes.
- **Theme:** Full Dark/Light mode support is required for all new components. Use the `dark:` variant in Tailwind.
- **Responsiveness:** Components must be built mobile-first.
- **Icons:** Use `lucide-react` for all system icons.
- **Empty States:** Use `src/components/EmptyState.tsx` whenever a table or list returns no data.
- **Modals:** Use `src/components/Modal.tsx` for forms, confirmations, and detailed views to maintain uniform overlay styling.

## 6. Coding Standards
- **TypeScript:** Enforce strict typing. Define interfaces in `types.ts` within the respective feature folder.
- **Component Structure:** Prefer functional components. Group related components, logic, and constants inside the `features/` directory rather than scattering them across global folders.
- **Forms:** Always use `react-hook-form` paired with `zod` for validation to ensure robust input handling.

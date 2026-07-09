# AiS — AltaFocus Integrator System

> Sistem manajemen jaringan internet berbasis web untuk ISP (Internet Service Provider).  
> Dibangun menggunakan **React 19**, **TypeScript**, **Vite**, dan **Tailwind CSS 4**.

---

## 📋 Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Tech Stack](#tech-stack)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Akun Demo](#akun-demo)
- [Struktur Folder](#struktur-folder)
- [Fitur Aplikasi](#fitur-aplikasi)
- [Scripts](#scripts)
- [Catatan Pengembangan](#catatan-pengembangan)

---

## Tentang Aplikasi

AiS (AltaFocus Integrator System) adalah dashboard manajemen jaringan internet yang menyediakan:

- **Dashboard Admin** — Ringkasan statistik pelanggan, koneksi, dan revenue
- **Dashboard Client** — Status koneksi, info perangkat, dan traffic monitoring
- **Monitoring** — ONU/OLT monitoring dan traffic PPPoE client
- **Manajemen Router, PPPoE, Hotspot** — CRUD profil dan data pelanggan
- **Billing & Invoice** — Pengelolaan tagihan dan pembayaran
- **Accounting** — Laporan keuangan, pemasukan/pengeluaran
- **Ticket Support** — Sistem tiket untuk client
- **Notifikasi** — Integrasi Telegram dan WhatsApp gateway

Aplikasi memiliki **2 role**: **Admin** dan **Client**, masing-masing dengan navigasi dan dashboard yang berbeda.

---

## Tech Stack

| Kategori        | Teknologi                           |
| --------------- | ----------------------------------- |
| Framework       | React 19                            |
| Bahasa          | TypeScript 5.9                      |
| Build Tool      | Vite 7                              |
| Styling         | Tailwind CSS 4                      |
| State Management| Zustand 5                           |
| Routing         | React Router DOM 7                  |
| Charts          | Recharts 3                          |
| Icons           | Lucide React                        |
| Form            | React Hook Form + Zod              |
| HTTP Client     | Axios                               |

---

## Persyaratan Sistem

- **Node.js** >= 18.x (disarankan v20+)
- **npm** >= 9.x atau **yarn** >= 1.22
- **Git**

---

## Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/djembaraa/ais-internet-management-system.git
cd ais-internet-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di:

```
http://localhost:5173
```

### 4. Build untuk Production

```bash
npm run build
```

Hasil build akan berada di folder `dist/`.

### 5. Preview Production Build

```bash
npm run preview
```

---

## Akun Demo

Aplikasi saat ini menggunakan **data dummy** (mock data). Gunakan kredensial berikut untuk login:

### 🔑 Admin

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

> **Admin** memiliki akses penuh ke semua fitur: Dashboard, Monitoring, Router, PPPoE, Hotspot, Billing, Telegram, Accounting, WhatsApp, Log, dan Ticket.

### 🔑 Client

| Field    | Value       |
| -------- | ----------- |
| Username | `client`    |
| Password | `client123` |

> **Client** hanya melihat: Dashboard (status koneksi), Invoice, Kelola Jaringan, dan Ticket.

---

## Struktur Folder

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
    ├── auth/                       # Autentikasi
    │   ├── components/Login.tsx    # Halaman login (Admin & Client)
    │   └── store/authStore.ts      # Auth state (Zustand + persist)
    │
    ├── dashboard/                  # Admin dashboard
    │   └── Dashboard.tsx
    │
    ├── client/                     # Client-specific pages
    │   └── components/
    │       ├── ClientDashboard.tsx  # Status koneksi + info perangkat + chart
    │       ├── ClientInvoice.tsx    # Daftar invoice client
    │       ├── ClientNetwork.tsx    # Kelola jaringan
    │       └── ClientTicket.tsx     # Ticket support client
    │
    ├── monitoring/                 # Monitoring ONU/OLT & Traffic
    │   └── components/
    │       ├── MonitoringPage.tsx   # Tab ONU + OLT
    │       └── TrafficPppoeClientPage.tsx
    │
    ├── router/                     # Router management + data layer
    │   ├── components/RouterList.tsx
    │   ├── types.ts                # Semua TypeScript interfaces
    │   └── constants.ts            # Semua mock/dummy data
    │
    ├── pppoe/                      # PPPoE management
    │   └── components/
    │       ├── PppoeProfileList.tsx
    │       └── PppoeClientList.tsx
    │
    ├── hotspot/                    # Hotspot management
    │   └── components/
    │       ├── HotspotProfileList.tsx
    │       ├── HotspotVoucherList.tsx
    │       └── HotspotVoucherEditor.tsx
    │
    ├── invoice/                    # Billing / Invoice
    │   └── components/InvoiceList.tsx
    │
    ├── accounting/                 # Accounting / Laporan keuangan
    │   └── components/AccountingPage.tsx
    │
    ├── telegram/                   # Telegram integration
    │   └── components/TelegramSettings.tsx
    │
    ├── whatsapp/                   # WhatsApp gateway
    │   └── components/WhatsappGateway.tsx
    │
    ├── log/                        # Activity log
    │   └── components/LogList.tsx
    │
    ├── ticket/                     # Ticket support (admin view)
    │   └── components/TicketList.tsx
    │
    └── account/                    # My account / profile
        └── components/MyAccount.tsx
```

---

## Fitur Aplikasi

### Admin Panel

| Menu         | Deskripsi |
| ------------ | --------- |
| Dashboard    | Overview statistik: total client, online, revenue, chart traffic |
| Monitoring   | ONU table + OLT table (tab), Traffic PPPoE Client |
| Router       | Daftar router dengan status dan uptime |
| PPPoE        | PPPoE Profile & PPPoE Client management |
| Hotspot      | Hotspot Profile, Voucher list, Voucher editor |
| Billing      | Daftar invoice dengan status pembayaran |
| Telegram     | Konfigurasi bot Telegram untuk notifikasi |
| Accounting   | Laporan keuangan: voucher terjual, invoice, pemasukan/pengeluaran, margin |
| WhatsApp     | WhatsApp gateway configuration |
| Log          | Activity log sistem |
| Ticket       | Daftar ticket support dari client |

### Client Panel

| Menu            | Deskripsi |
| --------------- | --------- |
| Dashboard       | Status koneksi (AiS ↔ Bras Server), info perangkat, traffic chart |
| Invoice         | Riwayat tagihan dengan status pembayaran |
| Kelola Jaringan | Informasi perangkat jaringan |
| Ticket          | Buat dan pantau ticket support (limit 3/hari) |

---

## Scripts

| Perintah           | Fungsi |
| ------------------ | ------ |
| `npm run dev`      | Jalankan development server (HMR) |
| `npm run build`    | Build untuk production |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Jalankan ESLint |

---

## Catatan Pengembangan

### Data Dummy

Seluruh data saat ini menggunakan **mock data** yang tersimpan di:

```
src/features/router/constants.ts
```

File ini berisi semua konstanta dummy untuk: router, PPPoE, hotspot, invoice, log, ticket, ONU, OLT, traffic, accounting, dan data client.

Untuk mengganti ke data real dari API, cukup replace import data dari `constants.ts` dengan fetch dari `services/api.ts`.

### Type Definitions

Semua TypeScript interfaces terdefinisi di:

```
src/features/router/types.ts
```

### Dark Mode

Aplikasi mendukung **dark mode** secara penuh. Toggle tersedia di header. State disimpan di `localStorage` via Zustand persist (`themeStore.ts`).

### Navigasi Role-Based

Layout secara otomatis menampilkan menu berbeda berdasarkan role user:
- **Admin** → 11 menu navigasi
- **Client** → 4 menu navigasi (Dashboard, Invoice, Kelola Jaringan, Ticket)

---

## 📄 Lisensi

Private — AltaFocus Team.

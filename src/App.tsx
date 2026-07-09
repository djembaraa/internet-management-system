import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Construction } from "lucide-react";

import Login from "./features/auth/components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./features/auth/store/authStore";

import Layout from "./components/Layout";
import Dashboard from "./features/dashboard/Dashboard";
import RootDashboard from "./features/root/components/RootDashboard";
import UserPackageList from "./features/root/components/UserPackageList";
import UserList from "./features/root/components/UserList";

import MonitoringPage from "./features/monitoring/components/MonitoringPage";
import TrafficPppoeClientPage from "./features/monitoring/components/TrafficPppoeClientPage";
import RouterList from "./features/router/components/RouterList";
import PppoeProfileList from "./features/pppoe/components/PppoeProfileList";
import PppoeClientList from "./features/pppoe/components/PppoeClientList";
import HotspotProfileList from "./features/hotspot/components/HotspotProfileList";
import HotspotVoucherList from "./features/hotspot/components/HotspotVoucherList";
import HotspotVoucherEditor from "./features/hotspot/components/HotspotVoucherEditor";
import InvoicePppoe from "./features/invoice/components/InvoicePppoe";
import InvoiceManual from "./features/invoice/components/InvoiceManual";
import BillingPage from "./features/billing/components/BillingPage";

import TelegramSettings from "./features/telegram/components/TelegramSettings";
import WhatsappGateway from "./features/whatsapp/components/WhatsappGateway";
import PaymentGatewaySettings from "./features/settings/components/PaymentGatewaySettings";
import TemplateInvoiceSettings from "./features/settings/components/TemplateInvoiceSettings";

import LogList from "./features/log/components/LogList";
import TicketList from "./features/ticket/components/TicketList";
import MyAccount from "./features/account/components/MyAccount";
import AccountingPage from "./features/accounting/components/AccountingPage";

import BroadcastAll from "./features/broadcast/components/BroadcastAll";
import BroadcastPersonal from "./features/broadcast/components/BroadcastPersonal";

import ClientDashboard from "./features/client/components/ClientDashboard";
import ClientInvoice from "./features/client/components/ClientInvoice";
import ClientNetwork from "./features/client/components/ClientNetwork";
import ClientTicket from "./features/client/components/ClientTicket";

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Construction
          size={32}
          className="text-slate-400 dark:text-slate-100"
        />
      </div>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-100 mb-1">
        {title}
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-100 max-w-xs text-center">
        Menu ini akan segera tersedia di update berikutnya.
      </p>
    </div>
  );
}

function RoleDashboard() {
  const { role } = useAuthStore();
  if (role === "client") return <ClientDashboard />;
  if (role === "root") return <RootDashboard />;
  return <Dashboard />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { role } = useAuthStore();
  if (role === "client") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<RoleDashboard />} />

          {/* ADMIN ONLY ROUTES */}
          <Route element={<AdminRoute><Outlet /></AdminRoute>}>
            {/* Monitoring */}
            <Route path="monitoring" element={<MonitoringPage />} />
            <Route path="monitoring/traffic" element={<TrafficPppoeClientPage />} />

            {/* Router */}
            <Route path="router" element={<RouterList />} />

            {/* Root: Users */}
            <Route path="users" element={<UserList />} />
            <Route path="users/packages" element={<UserPackageList />} />

            {/* PPPoE */}
            <Route path="pppoe" element={<PppoeProfileList />} />
            <Route path="pppoe/users" element={<PppoeClientList />} />

            {/* Hotspot */}
            <Route path="hotspot" element={<HotspotProfileList />} />
            <Route path="hotspot/voucher" element={<HotspotVoucherList />} />
            <Route path="hotspot/editor" element={<HotspotVoucherEditor />} />

            {/* Invoice */}
            <Route path="invoice" element={<InvoicePppoe />} />
            <Route path="invoice/manual" element={<InvoiceManual />} />

            {/* Billing */}
            <Route path="billing" element={<BillingPage />} />

            {/* Settings */}
            <Route path="settings/billing" element={<BillingPage />} />
            <Route path="settings/telegram" element={<TelegramSettings />} />
            <Route path="settings/whatsapp" element={<WhatsappGateway />} />
            <Route path="settings/template-invoice" element={<TemplateInvoiceSettings />} />
            <Route path="settings/payment-gateway" element={<PaymentGatewaySettings />} />

            {/* Accounting */}
            <Route path="accounting" element={<AccountingPage />} />

            {/* Broadcast */}
            <Route path="broadcast/all" element={<BroadcastAll />} />
            <Route path="broadcast/personal" element={<BroadcastPersonal />} />

            <Route path="log" element={<LogList />} />
            <Route path="ticket" element={<TicketList />} />
          </Route>

          <Route path="account" element={<MyAccount />} />

          {/* Client-specific routes */}
          <Route path="client/invoice" element={<ClientInvoice />} />
          <Route path="client/network" element={<ClientNetwork />} />
          <Route path="client/ticket" element={<ClientTicket />} />

          {/* Fallback */}
          <Route
            path="*"
            element={<ComingSoon title="Halaman Sedang Dibuat" />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import {
  Users,
  Activity,
  AlertTriangle,
  ShieldAlert,
  Wifi,
  Ticket,
  FileText,
  type LucideIcon,
} from "lucide-react";

/* ─── Types ─── */
interface StatCardProps {
  title: string;
  count: number;
  suffix: string;
  icon: LucideIcon;
  bgIconClass: string;
  titleColorClass: string;
}

/* ─── StatCard ───
 * Gestalt: proximity (icon + text grouped), similarity (uniform dimensions),
 * common region (consistent border/radius/shadow container).
 * Fixed height ensures every card looks identical regardless of text length.
 */
function StatCard({
  title,
  count,
  suffix,
  icon: Icon,
  bgIconClass,
  titleColorClass,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/10 transition-all duration-200 flex items-center gap-4 px-4 py-3.5 h-[88px] group">
      {/* Icon — fixed 48×48 square for alignment consistency */}
      <div
        className={`w-12 h-12 rounded-xl ${bgIconClass} text-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
      >
        <Icon size={22} strokeWidth={1.8} />
      </div>
      {/* Text — title + value, vertically centered */}
      <div className="min-w-0 flex-1">
        <h4
          className={`text-[13px] font-semibold ${titleColorClass} leading-tight truncate`}
        >
          {title}
        </h4>
        <p className="text-slate-500 dark:text-slate-100 text-sm mt-0.5">
          {count} {suffix}
        </p>
      </div>
    </div>
  );
}

/* ─── Card data ─── */
interface CardData {
  title: string;
  count: number;
  suffix: string;
  icon: LucideIcon;
  variant: "green" | "amber" | "red";
}

const VARIANT_STYLE = {
  green: { bgIconClass: "bg-emerald-500", titleColorClass: "text-emerald-700 dark:text-emerald-400" },
  amber: { bgIconClass: "bg-amber-500", titleColorClass: "text-amber-700 dark:text-amber-400" },
  red: { bgIconClass: "bg-red-500", titleColorClass: "text-red-700 dark:text-red-400" },
};

const ALL_CARDS: CardData[] = [
  // Row 1 — PPPoE Users
  { title: "PPPoE Users Connected", count: 0, suffix: "Users", icon: Users, variant: "green" },
  { title: "PPPoE Users Expired", count: 0, suffix: "Users", icon: Users, variant: "amber" },
  { title: "PPPoE Users Disconnected", count: 0, suffix: "Users", icon: Users, variant: "red" },
  // Row 2 — Optical Power
  { title: "Good Optical Power", count: 0, suffix: "Devices", icon: Activity, variant: "green" },
  { title: "Warning Optical Power", count: 0, suffix: "Devices", icon: AlertTriangle, variant: "amber" },
  { title: "Danger Optical Power", count: 0, suffix: "Devices", icon: ShieldAlert, variant: "red" },
  // Row 3 — Hotspot
  { title: "Hotspot Voucher", count: 200, suffix: "Vouchers", icon: Wifi, variant: "green" },
  { title: "Hotspot Used", count: 0, suffix: "Vouchers", icon: Wifi, variant: "amber" },
  { title: "Hotspot Expired", count: 0, suffix: "Vouchers", icon: Wifi, variant: "red" },
  // Row 4 — Tickets
  { title: "Opened Ticket", count: 0, suffix: "Tickets", icon: Ticket, variant: "green" },
  { title: "On Hold Ticket", count: 0, suffix: "Tickets", icon: Ticket, variant: "amber" },
  { title: "Closed Ticket", count: 0, suffix: "Tickets", icon: Ticket, variant: "red" },
  // Row 5 — Invoice PPPoE
  { title: "Invoice PPPoE Paid", count: 0, suffix: "Invoices", icon: FileText, variant: "green" },
  { title: "Invoice PPPoE Unpaid", count: 0, suffix: "Invoices", icon: FileText, variant: "amber" },
  { title: "Invoice PPPoE Outstanding", count: 0, suffix: "Invoices", icon: FileText, variant: "red" },
  // Row 6 — Invoice Manual
  { title: "Invoice Manual Paid", count: 1, suffix: "Invoices", icon: FileText, variant: "green" },
  { title: "Invoice Manual Unpaid", count: 0, suffix: "Invoices", icon: FileText, variant: "amber" },
  { title: "Invoice Manual Outstanding", count: 0, suffix: "Invoices", icon: FileText, variant: "red" },
];

/* ─── Dashboard ─── */
export default function Dashboard() {
  const [cards, setCards] = useState<CardData[]>(ALL_CARDS);

  useEffect(() => {
    async function fetchStats() {
      // Fetch PPPoE Clients
      const { data: clients } = await supabase.from('pppoe_clients').select('status');
      const pppoeConnected = clients?.filter(c => c.status === 'Connected').length || 0;
      const pppoeExpired = clients?.filter(c => c.status === 'Expired').length || 0;
      const pppoeDisconnected = clients?.filter(c => c.status === 'Disconnected').length || 0;

      // Fetch Tickets
      const { data: tickets } = await supabase.from('tickets').select('status');
      const ticketOpened = tickets?.filter(t => t.status === 'Opened').length || 0;
      const ticketHold = tickets?.filter(t => t.status === 'On Hold').length || 0;
      const ticketClosed = tickets?.filter(t => t.status === 'Closed').length || 0;

      // Fetch Invoices
      const { data: invoices } = await supabase.from('invoices').select('status, type');
      const pppoeInvPaid = invoices?.filter(i => i.status === 'Paid' && i.type === 'PPPoE').length || 0;
      const pppoeInvUnpaid = invoices?.filter(i => i.status === 'Unpaid' && i.type === 'PPPoE').length || 0;
      const pppoeInvOuts = invoices?.filter(i => i.status === 'Outstanding' && i.type === 'PPPoE').length || 0;
      
      const manInvPaid = invoices?.filter(i => i.status === 'Paid' && i.type === 'Manual').length || 0;
      const manInvUnpaid = invoices?.filter(i => i.status === 'Unpaid' && i.type === 'Manual').length || 0;
      const manInvOuts = invoices?.filter(i => i.status === 'Outstanding' && i.type === 'Manual').length || 0;

      setCards([
        // Row 1 — PPPoE Users
        { title: "PPPoE Users Connected", count: pppoeConnected, suffix: "Users", icon: Users, variant: "green" },
        { title: "PPPoE Users Expired", count: pppoeExpired, suffix: "Users", icon: Users, variant: "amber" },
        { title: "PPPoE Users Disconnected", count: pppoeDisconnected, suffix: "Users", icon: Users, variant: "red" },
        // Row 2 — Optical Power (Mocked)
        { title: "Good Optical Power", count: 0, suffix: "Devices", icon: Activity, variant: "green" },
        { title: "Warning Optical Power", count: 0, suffix: "Devices", icon: AlertTriangle, variant: "amber" },
        { title: "Danger Optical Power", count: 0, suffix: "Devices", icon: ShieldAlert, variant: "red" },
        // Row 3 — Hotspot (Mocked)
        { title: "Hotspot Voucher", count: 200, suffix: "Vouchers", icon: Wifi, variant: "green" },
        { title: "Hotspot Used", count: 0, suffix: "Vouchers", icon: Wifi, variant: "amber" },
        { title: "Hotspot Expired", count: 0, suffix: "Vouchers", icon: Wifi, variant: "red" },
        // Row 4 — Tickets
        { title: "Opened Ticket", count: ticketOpened, suffix: "Tickets", icon: Ticket, variant: "green" },
        { title: "On Hold Ticket", count: ticketHold, suffix: "Tickets", icon: Ticket, variant: "amber" },
        { title: "Closed Ticket", count: ticketClosed, suffix: "Tickets", icon: Ticket, variant: "red" },
        // Row 5 — Invoice PPPoE
        { title: "Invoice PPPoE Paid", count: pppoeInvPaid, suffix: "Invoices", icon: FileText, variant: "green" },
        { title: "Invoice PPPoE Unpaid", count: pppoeInvUnpaid, suffix: "Invoices", icon: FileText, variant: "amber" },
        { title: "Invoice PPPoE Outstanding", count: pppoeInvOuts, suffix: "Invoices", icon: FileText, variant: "red" },
        // Row 6 — Invoice Manual
        { title: "Invoice Manual Paid", count: manInvPaid, suffix: "Invoices", icon: FileText, variant: "green" },
        { title: "Invoice Manual Unpaid", count: manInvUnpaid, suffix: "Invoices", icon: FileText, variant: "amber" },
        { title: "Invoice Manual Outstanding", count: manInvOuts, suffix: "Invoices", icon: FileText, variant: "red" },
      ]);
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-2">
      {/*
       * Single flat grid — cards stretch to fill columns evenly (Gestalt: similarity).
       * 3 cards per logical group naturally form visual rows (Gestalt: proximity).
       * max-w-6xl prevents excessive horizontal spread on wide screens.
       */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card) => {
          const s = VARIANT_STYLE[card.variant];
          return (
            <StatCard
              key={card.title}
              title={card.title}
              count={card.count}
              suffix={card.suffix}
              icon={card.icon}
              bgIconClass={s.bgIconClass}
              titleColorClass={s.titleColorClass}
            />
          );
        })}
      </div>
    </div>
  );
}

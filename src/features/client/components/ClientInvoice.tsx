import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "../../../services/supabase";
import { useAuthStore } from "../../auth/store/authStore";

export default function ClientInvoice() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatRp = (n: number) => "Rp. " + Number(n).toLocaleString("id-ID");
  const formatDate = (d: string) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  useEffect(() => {
    async function fetchInvoices() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (err) {
        console.error("Failed to fetch invoices", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Belum ada tagihan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-b border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-2 py-1.5 w-8 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-slate-600"
                />
              </th>
              <th className="px-5 py-1.5 w-12">NO</th>
              <th className="px-5 py-1.5">JENIS LAYANAN / ITEM</th>
              <th className="px-5 py-1.5">NO INVOICE</th>
              <th className="px-5 py-1.5">TANGGAL TERBIT</th>
              <th className="px-5 py-1.5">JATUH TEMPO</th>
              <th className="px-5 py-1.5">TOTAL</th>
              <th className="px-5 py-1.5 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.map((inv, i) => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-2 py-3.5 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                  {i + 1}
                </td>
                <td className="px-5 py-3.5 text-slate-700 dark:text-slate-100 font-medium max-w-md truncate">
                  {inv.fullname || inv.type}
                </td>
                <td className="px-5 py-3.5 text-[#155b96] dark:text-blue-400 font-semibold">
                  {inv.serial}
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 text-[12px] tabular-nums">
                  {formatDate(inv.created_at)}
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 text-[12px] tabular-nums">
                  {formatDate(inv.due_date)}
                </td>
                <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-100 tabular-nums">
                  {formatRp(inv.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        inv.status === "Paid"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === "Paid"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {inv.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {invoices.map((inv) => {
          const isOpen = expandedId === inv.id;
          return (
            <div key={inv.id}>
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : inv.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#155b96] dark:text-blue-400 font-semibold truncate">
                    {inv.serial}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-100 tabular-nums">
                      {formatRp(inv.amount)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        inv.status === "Paid"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${inv.status === "Paid" ? "bg-emerald-500" : "bg-red-500"}`}
                      ></span>
                      {inv.status}
                    </span>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp
                    size={16}
                    className="text-slate-400 shrink-0 ml-2"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="text-slate-400 shrink-0 ml-2"
                  />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 space-y-2 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                  <div className="pt-2.5">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                      Jenis Layanan / Item
                    </p>
                    <p className="text-[13px] text-slate-700 dark:text-slate-100 font-medium mt-0.5">
                      {inv.fullname || inv.type}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                        Tanggal Terbit
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-300 tabular-nums mt-0.5">
                        {formatDate(inv.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                        Jatuh Tempo
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-300 tabular-nums mt-0.5">
                        {formatDate(inv.due_date)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

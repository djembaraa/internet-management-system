import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import { supabase } from "../../../services/supabase";
import EmptyState from "../../../components/EmptyState";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";

const MONTHS = [
  "Januari 2026",
  "Februari 2026",
  "Maret 2026",
  "April 2026",
  "Mei 2026",
  "Juni 2026",
];

export default function AccountingPage() {
  const [selectedMonth, setSelectedMonth] = useState("Februari 2026");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);

  // Add Expense form state
  const [addDate, setAddDate] = useState("");
  const [addType, setAddType] = useState("Pengeluaran");
  const [addAmount, setAddAmount] = useState("");
  const [addDesc, setAddDesc] = useState("");

  const [invoices, setInvoices] = useState<any[]>([]);
  const [voucherReports, setVoucherReports] = useState<any[]>([]);

  const voucherTerjual = voucherReports.reduce(
    (sum, r) => sum + r.jumlah,
    0,
  );
  const voucherNominal = voucherReports.reduce(
    (sum, r) => sum + r.nominal,
    0,
  );

  useEffect(() => {
    async function fetchData() {
      const { data: invData, error: invError } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
      if (!invError && invData) {
        setInvoices(invData);
      }
      
      const { data: expData, error: expError } = await supabase.from('expenses').select('*').order('tanggal', { ascending: false });
      if (!expError && expData) {
        setExpenses(expData.map(e => ({
          ...e,
          tanggal_str: new Date(e.tanggal).toLocaleDateString(),
          nominal: Number(e.nominal),
          deskripsi: e.deskripsi
        })));
      }

      const { data: voucherData } = await supabase.from('hotspot_vouchers').select('*, hotspot_profiles(price, name)').eq('status', 'Used');
      if (voucherData) {
        // Group by date and profile
        const reports: Record<string, any> = {};
        voucherData.forEach(v => {
          const date = new Date(v.created_at).toISOString().split('T')[0];
          const profileName = v.hotspot_profiles?.name || 'Unknown';
          const price = Number(v.hotspot_profiles?.price || 0);
          const key = `${date}_${profileName}`;
          if (!reports[key]) {
            reports[key] = {
              id: key,
              profile: profileName,
              tanggal: date,
              jumlah: 0,
              nominal: 0
            };
          }
          reports[key].jumlah += 1;
          reports[key].nominal += price;
        });
        setVoucherReports(Object.values(reports).sort((a: any, b: any) => b.tanggal.localeCompare(a.tanggal)));
      }
    }
    fetchData();
  }, []);

  const invoicePppoe = invoices.filter(
    (r) => r.type === "PPPoE" && r.status === 'Paid',
  ).reduce((sum, r) => sum + Number(r.amount), 0);
  const invoiceManual = invoices.filter(
    (r) => r.type === "Manual" && r.status === 'Paid',
  ).reduce((sum, r) => sum + Number(r.amount), 0);
  const invoicePppoeCount = invoices.filter(
    (r) => r.type === "PPPoE" && r.status === 'Paid',
  ).length;
  const invoiceManualCount = invoices.filter(
    (r) => r.type === "Manual" && r.status === 'Paid',
  ).length;

  const totalPemasukan = invoicePppoe + invoiceManual + expenses.filter(e => e.type === "Pemasukan").reduce((sum, e) => sum + e.nominal, 0);
  const totalPengeluaran = expenses.filter(
    (e) => e.type === "Pengeluaran",
  ).reduce((sum, e) => sum + e.nominal, 0);
  const totalMargin = totalPemasukan - totalPengeluaran;

  const formatRp = (n: number) => "Rp. " + n.toLocaleString("id-ID");

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";
  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";

  return (
    <div className="space-y-4">
      {/* Header & Filter Bulan */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Accounting & Reports
          </h2>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
            Ringkasan keuangan dan laporan mutasi sistem
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar size={15} />
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full pl-10 pr-4 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-100 appearance-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                Laporan: {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards Row 1 — Mutasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-center">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
            Total Pemasukan
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
            {formatRp(totalPemasukan)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-center">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
            Total Pengeluaran
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums tracking-tight">
            {formatRp(totalPengeluaran)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 relative overflow-hidden flex flex-col justify-center">
          <div
            className={`absolute top-0 left-0 w-1.5 h-full ${totalMargin >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
          ></div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5 pl-1.5">
            Total Margin
          </p>
          <p
            className={`text-2xl font-bold tabular-nums pl-1.5 tracking-tight ${totalMargin >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {formatRp(totalMargin)}
          </p>
        </div>
      </div>

      {/* Summary Cards Row 2 — Rincian Invoice & Voucher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
            Voucher Terjual
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">
            {formatRp(voucherNominal)}
          </p>
          <p className="text-[11px] text-[#155b96] dark:text-blue-400 font-medium mt-1">
            {voucherTerjual} Voucher
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
            Invoice PPPoE Paid
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">
            {formatRp(invoicePppoe)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {invoicePppoeCount} Transaksi
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
            Invoice Manual Paid
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">
            {formatRp(invoiceManual)}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            {invoiceManualCount} Transaksi
          </p>
        </div>
      </div>

      {/* Laporan Pengeluaran & Pemasukan */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
              Pengeluaran & Pemasukan Tambahan
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
          >
            <Plus size={16} /> Add Transaksi
          </button>
        </div>

        <div className="overflow-x-auto">
          {expenses.length === 0 ? (
            <EmptyState
              title="Data Kosong"
              message="Belum ada transaksi tambahan."
            />
          ) : (
            <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-1.5 w-8 text-center">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                    />
                  </th>
                  <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                  <th className="px-5 py-1.5">TANGGAL</th>
                  <th className="px-5 py-1.5">TYPE</th>
                  <th className="px-5 py-1.5">NOMINAL</th>
                  <th className="px-5 py-1.5">DESKRIPSI / CATATAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((e, i) => {
                  const isPemasukan = e.type === "Pemasukan";
                  const badgeClass = isPemasukan
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                    : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50";
                  const dotClass = isPemasukan
                    ? "bg-emerald-500"
                    : "bg-red-500";

                  return (
                    <tr
                      key={e.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                    >
                      <td className="px-5 py-3 text-center">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                        />
                      </td>
                      <td className="pl-2 pr-5 py-4 text-slate-500 dark:text-slate-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 tabular-nums text-[12px] font-medium">
                        {e.tanggal_str}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${dotClass}`}
                          ></span>
                          {e.type}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-4 font-bold tabular-nums ${isPemasukan ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {isPemasukan ? "+" : "-"} {formatRp(e.nominal)}
                      </td>
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-medium truncate max-w-xs">
                        {e.deskripsi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
          <div>
            Showing 1 to {expenses.length} of {expenses.length}{" "}
            entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
              &laquo;
            </button>
            <button className="px-3 py-1 border border-[#155b96] bg-[#155b96] text-white rounded-lg text-[12px] font-medium shadow-sm">
              1
            </button>
            <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* Hotspot Report + Invoice Report — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hotspot Report */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
              Riwayat Hotspot
            </h3>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-100">
              <select className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100 font-medium">
                <option>10</option>
                <option>25</option>
              </select>
              <span>entries per page</span>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            {voucherReports.length === 0 ? (
              <EmptyState />
            ) : (
              <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-b border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-1.5 w-8 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                      />
                    </th>
                    <th className="px-4 py-1.5 w-10">NO</th>
                    <th className="px-4 py-1.5">PROFILE</th>
                    <th className="px-4 py-1.5">TANGGAL</th>
                    <th className="px-4 py-1.5">JUMLAH</th>
                    <th className="px-4 py-1.5">NOMINAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {voucherReports.map((r, i) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                        {r.profile}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 tabular-nums text-[11px] font-medium">
                        {r.tanggal}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 tabular-nums font-bold">
                        {r.jumlah}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          Pcs
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#155b96] dark:text-blue-400 tabular-nums">
                        {formatRp(r.nominal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-medium">
            Showing 1 to {voucherReports.length} of{" "}
            {voucherReports.length} entries
          </div>
        </div>

        {/* Invoice Report */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
              Riwayat Pembayaran Invoice
            </h3>
          </div>
          <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-100">
              <select className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100 font-medium">
                <option>10</option>
                <option>25</option>
              </select>
              <span>entries per page</span>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            {invoices.length === 0 ? (
              <EmptyState />
            ) : (
              <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-b border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-1.5 w-8 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                      />
                    </th>
                    <th className="px-4 py-1.5 w-10">NO</th>
                    <th className="px-4 py-1.5">TANGGAL</th>
                    <th className="px-4 py-1.5">NO INVOICE</th>
                    <th className="px-4 py-1.5">TYPE</th>
                    <th className="px-4 py-1.5">NOMINAL</th>
                    <th className="px-4 py-1.5">VIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((r, i) => {
                    const typeClass =
                      r.type === "PPPoE"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50"
                        : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50";
                    const viaClass =
                      r.status === "Paid"
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                        : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                      >
                        <td className="px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 tabular-nums text-[11px] font-medium">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-[#155b96] dark:text-blue-400 font-bold">
                          {r.serial}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${typeClass}`}
                          >
                            {r.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                          {formatRp(Number(r.amount))}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${viaClass}`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-medium">
            Showing 1 to {invoices.length} of{" "}
            {invoices.length} entries
          </div>
        </div>
      </div>

      {/* Modal: Add Pengeluaran/Pemasukan */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pengeluaran / Pemasukan"
        maxWidth="lg"
      >
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('expenses').insert({
              tanggal: addDate,
              type: addType,
              nominal: Number(addAmount),
              deskripsi: addDesc
            });
            if (!error) {
              setIsModalOpen(false);
              setAddDate("");
              setAddType("Pengeluaran");
              setAddAmount("");
              setAddDesc("");
              // Re-fetch expenses
              const { data } = await supabase.from('expenses').select('*').order('tanggal', { ascending: false });
              if (data) {
                setExpenses(data.map(exp => ({
                  ...exp,
                  tanggal_str: new Date(exp.tanggal).toLocaleDateString(),
                  nominal: Number(exp.nominal),
                  deskripsi: exp.deskripsi
                })));
              }
            } else {
              alert("Failed to save expense: " + error.message);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormLabel
                label="Tanggal"
                required
                tooltip="Tanggal transaksi pemasukan atau pengeluaran."
              />
              <input type="date" required value={addDate} onChange={e => setAddDate(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <FormLabel
                label="Type Transaksi"
                required
                tooltip="Pilih jenis transaksi: Pemasukan atau Pengeluaran."
              />
              <select value={addType} onChange={e => setAddType(e.target.value)} className={selectClasses}>
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
          </div>
          <div>
            <FormLabel
              label="Nominal (Rp)"
              required
              tooltip="Jumlah nominal transaksi dalam Rupiah."
            />
            <input
              type="number"
              required
              placeholder="Contoh: 150000"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel
              label="Deskripsi / Catatan"
              tooltip="Catatan tambahan tentang transaksi ini (opsional)."
            />
            <textarea
              rows={3}
              placeholder="Tulis catatan transaksi..."
              value={addDesc}
              onChange={e => setAddDesc(e.target.value)}
              className={`${inputClasses} resize-none`}
            ></textarea>
          </div>
          <div className="pt-5 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors active:scale-[0.98]"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

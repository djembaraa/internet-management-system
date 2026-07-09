import { useRef } from "react";
import { Download, Printer, X } from "lucide-react";

/* ─── Types ─── */
export interface InvoiceReceiptData {
  /* Company */
  companyName: string;
  companyTagline?: string;
  companyOffice: string;
  companyPhone: string;
  companyWebsite: string;
  companyEmail: string;
  /* Customer */
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  /* Invoice meta */
  serial: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  /* Items */
  items: {
    name: string;
    price: number;
    quantity: number;
    discount: number;
  }[];
  /* Totals */
  discountTotal: number;
  taxLabel?: string;
  taxPercent?: number;
  kodeUnik?: number;
  /* Status */
  status: "Paid" | "Unpaid" | "Partially Paid";
  /* Notes */
  instruction?: string;
  memo?: string;
  /* Signature */
  signatureName?: string;
}

interface Props {
  data: InvoiceReceiptData;
  onClose: () => void;
}

/* ─── Helpers ─── */
const fmt = (n: number) =>
  n.toLocaleString("id-ID", { minimumFractionDigits: 0 });

export default function InvoiceReceipt({ data, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document
      .write(`<!DOCTYPE html><html><head><title>Invoice ${data.serial}</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @page { size: A4; margin: 12mm; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; font-size: 12px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 7px 10px; text-align: left; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-sm { font-size: 11px; }
        .text-xs { font-size: 10px; }
        .text-muted { color: #64748b; }
        .border-b { border-bottom: 1px solid #e2e8f0; }
        .border-t { border-top: 1px solid #e2e8f0; }
        .mt-4 { margin-top: 16px; }
        .mt-2 { margin-top: 8px; }
        .mb-1 { margin-bottom: 4px; }
        .mb-2 { margin-bottom: 8px; }
        .py-2 { padding-top: 8px; padding-bottom: 8px; }
        .px-3 { padding-left: 12px; padding-right: 12px; }
        .status-badge { display: inline-block; padding: 8px 32px; border-radius: 6px; font-size: 18px; font-weight: 900; letter-spacing: 2px; }
        .status-paid { background: #22c55e; color: #fff; }
        .status-unpaid { background: #ef4444; color: #fff; }
        .status-partial { background: #f59e0b; color: #fff; }
        .total-box { border: 2px solid #e2e8f0; padding: 10px 18px; display: inline-block; margin-top: 8px; }
        .total-box .label { font-size: 13px; font-weight: 600; color: #334155; }
        .total-box .value { font-size: 15px; font-weight: 700; color: #1e293b; }
        .signature-box { text-align: center; margin-top: 16px; }
        .qr-placeholder { width: 80px; height: 80px; border: 1px solid #cbd5e1; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: #94a3b8; margin: 8px auto; }
        .footer { border-top: 2px solid #334155; padding-top: 10px; text-align: center; margin-top: 24px; font-size: 10px; color: #64748b; }
        .items-table th { background: #f8fafc; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 2px solid #e2e8f0; border-top: 2px solid #e2e8f0; }
        .items-table td { border-bottom: 1px solid #f1f5f9; font-size: 12px; }
        @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
      </style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write("</body></html>");
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 400);
  };

  /* Compute totals */
  const itemRows = data.items.map((it) => ({
    ...it,
    total: it.price * it.quantity,
  }));
  const grossTotal = itemRows.reduce((s, r) => s + r.total, 0);
  const subTotal = grossTotal - data.discountTotal;
  const taxAmount = data.taxPercent
    ? Math.round(subTotal * (data.taxPercent / 100))
    : 0;
  const totalBeforeUnik = subTotal + taxAmount;
  const kodeUnik = data.kodeUnik ?? 0;
  const grandTotal = totalBeforeUnik + kodeUnik;

  const statusBadge =
    data.status === "Paid"
      ? "bg-emerald-500 text-white"
      : data.status === "Unpaid"
        ? "bg-red-500 text-white"
        : "bg-amber-500 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[800px] my-auto transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action bar */}
        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all shadow-sm active:scale-95"
          >
            <Download size={15} /> Download
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all shadow-sm active:scale-95"
          >
            <Printer size={15} /> Print
          </button>
          <div className="hidden sm:block flex-1" />
          <button
            onClick={onClose}
            className="p-2 sm:px-4 sm:py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 sm:text-[13px] sm:font-medium sm:text-slate-600 sm:dark:text-slate-300 sm:bg-slate-100 sm:dark:bg-slate-800 transition-colors shrink-0"
            title="Close"
          >
            <X size={18} className="sm:hidden" />
            <span className="hidden sm:block">Close</span>
          </button>
        </div>

        {/* Receipt card */}
        <div
          ref={printRef}
          className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200/80"
          style={{ color: "#1e293b" }}
        >
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-5 sm:p-8 pb-5 sm:pb-6 gap-4 sm:gap-0 text-center sm:text-left border-b-4 border-[#155b96]">
            <img
              src="/ais-logo.png"
              alt="Logo"
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <div className="sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-800">
                INVOICE
              </h1>
              <p className="text-[13px] sm:text-[14px] font-bold text-slate-700 mt-1">
                {data.companyName}
              </p>
              {data.companyTagline && (
                <p className="text-[11px] sm:text-[12px] text-slate-400 font-medium italic mt-0.5">
                  {data.companyTagline}
                </p>
              )}
            </div>
          </div>

          {/* ── Customer & Invoice info ── */}
          <div className="px-5 sm:px-8 py-6 flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between bg-slate-50/50 border-b border-slate-200/60">
            {/* Left: Customer */}
            <div className="text-[12px] leading-relaxed flex-1">
              <p className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">
                Billed To
              </p>
              <p className="font-bold text-[14px] text-slate-800">
                {data.customerName}
              </p>
              <p className="text-slate-600 font-medium mt-0.5">
                {data.customerPhone}
              </p>
              <p className="text-slate-500 mt-0.5 max-w-xs">
                {data.customerAddress || "-"}
              </p>
            </div>

            {/* Right: Invoice details */}
            <div className="text-[12px] flex-1 sm:text-right">
              <table className="ml-0 sm:ml-auto text-[12px] w-full sm:w-auto">
                <tbody>
                  <tr>
                    <td className="text-slate-500 font-medium pr-4 py-1 whitespace-nowrap">
                      No Invoice
                    </td>
                    <td className="text-slate-800 font-bold py-1 text-right">
                      {data.serial}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 font-medium pr-4 py-1">
                      Tanggal Terbit
                    </td>
                    <td className="text-slate-800 font-semibold py-1 text-right">
                      {data.issuedDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 font-medium pr-4 py-1">
                      Jatuh Tempo
                    </td>
                    <td className="text-slate-800 font-semibold py-1 text-right">
                      {data.dueDate}
                    </td>
                  </tr>
                  {data.paidDate && (
                    <tr>
                      <td className="text-slate-500 font-medium pr-4 py-1">
                        Dibayarkan Pada
                      </td>
                      <td className="text-slate-800 font-semibold py-1 text-right">
                        {data.paidDate}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Items table (with horizontal scroll for mobile) ── */}
          <div className="px-5 sm:px-8 py-6 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[500px]">
              <thead>
                <tr className="border-y-2 border-slate-200 bg-slate-50">
                  <th className="py-1.5 px-4 text-left text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Jenis Layanan / Item
                  </th>
                  <th className="py-1.5 px-4 text-right text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Harga
                  </th>
                  <th className="py-1.5 px-4 text-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Qty
                  </th>
                  <th className="py-1.5 px-4 text-right text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Discount
                  </th>
                  <th className="py-1.5 px-4 text-right text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 tabular-nums">
                      {fmt(row.price)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 font-medium tabular-nums">
                      {row.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 tabular-nums">
                      {fmt(row.discount)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-800 font-bold tabular-nums">
                      {fmt(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals & Status ── */}
          <div className="px-5 sm:px-8 pb-6 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-end gap-6">
            {/* Status badge */}
            <div className="w-full sm:w-auto text-center sm:text-left pt-4 sm:pt-0">
              <div
                className={`inline-flex items-center justify-center px-8 py-3 rounded-lg text-[18px] sm:text-[22px] font-black tracking-widest ${statusBadge} shadow-sm border border-black/5`}
              >
                {data.status === "Paid"
                  ? "PAID"
                  : data.status === "Unpaid"
                    ? "UNPAID"
                    : "PARTIAL"}
              </div>
            </div>

            {/* Totals Calculation */}
            <div className="w-full sm:w-[340px] bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-100">
              <div className="flex justify-between py-1.5 text-[12px]">
                <span className="text-slate-500 font-medium">Discount</span>
                <span className="text-slate-700 font-semibold tabular-nums">
                  {fmt(data.discountTotal)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 text-[12px]">
                <span className="text-slate-500 font-medium">Sub Total</span>
                <span className="text-slate-700 font-semibold tabular-nums">
                  {fmt(subTotal)}
                </span>
              </div>

              {data.taxPercent !== undefined && data.taxPercent > 0 && (
                <div className="flex justify-between py-1.5 text-[12px]">
                  <span className="text-slate-500 font-medium">
                    {data.taxLabel || `Ppn (${data.taxPercent}%)`}
                  </span>
                  <span className="text-slate-700 font-semibold tabular-nums">
                    {fmt(taxAmount)}
                  </span>
                </div>
              )}

              {kodeUnik > 0 && (
                <div className="flex justify-between py-1.5 text-[12px]">
                  <span className="text-slate-500 font-medium">Kode Unik</span>
                  <span className="text-slate-700 font-semibold tabular-nums">
                    {fmt(kodeUnik)}
                  </span>
                </div>
              )}

              <div className="border-t-2 border-slate-200/80 my-3" />

              <div className="flex justify-between items-center py-1">
                <span className="text-[14px] font-bold text-slate-800">
                  Grand Total
                </span>
                <span className="text-[18px] font-black text-[#155b96] tabular-nums tracking-tight">
                  Rp. {fmt(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Instruction, Memo & Signature ── */}
          <div className="px-5 sm:px-8 py-6 border-t border-slate-200/60 flex flex-col sm:flex-row gap-8 justify-between">
            <div className="space-y-5 flex-1">
              {data.instruction && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                    Instruksi Pembayaran
                  </p>
                  <p className="text-[12px] font-medium text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    {data.instruction}
                  </p>
                </div>
              )}
              {data.memo && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                    Memo
                  </p>
                  <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-line">
                    {data.memo}
                  </p>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="text-center sm:w-48 shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Authorized Signature
              </p>
              {/* QR placeholder */}
              <div className="w-20 h-20 mx-auto border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 shadow-sm p-1.5">
                <svg viewBox="0 0 80 80" className="w-full h-full opacity-80">
                  <rect x="0" y="0" width="80" height="80" fill="white" />
                  <rect
                    x="4"
                    y="4"
                    width="20"
                    height="20"
                    rx="2"
                    fill="#334155"
                  />
                  <rect
                    x="8"
                    y="8"
                    width="12"
                    height="12"
                    rx="1"
                    fill="white"
                  />
                  <rect x="11" y="11" width="6" height="6" fill="#334155" />
                  <rect
                    x="56"
                    y="4"
                    width="20"
                    height="20"
                    rx="2"
                    fill="#334155"
                  />
                  <rect
                    x="60"
                    y="8"
                    width="12"
                    height="12"
                    rx="1"
                    fill="white"
                  />
                  <rect x="63" y="11" width="6" height="6" fill="#334155" />
                  <rect
                    x="4"
                    y="56"
                    width="20"
                    height="20"
                    rx="2"
                    fill="#334155"
                  />
                  <rect
                    x="8"
                    y="60"
                    width="12"
                    height="12"
                    rx="1"
                    fill="white"
                  />
                  <rect x="11" y="63" width="6" height="6" fill="#334155" />
                  <rect x="28" y="4" width="4" height="4" fill="#155b96" />
                  <rect x="36" y="4" width="4" height="4" fill="#334155" />
                  <rect x="44" y="4" width="4" height="4" fill="#155b96" />
                  <rect x="28" y="12" width="4" height="4" fill="#334155" />
                  <rect x="36" y="12" width="8" height="4" fill="#155b96" />
                  <rect x="28" y="20" width="4" height="4" fill="#155b96" />
                  <rect x="36" y="20" width="4" height="4" fill="#334155" />
                  <rect x="44" y="20" width="4" height="4" fill="#155b96" />
                  <rect x="4" y="28" width="4" height="4" fill="#155b96" />
                  <rect x="12" y="28" width="4" height="4" fill="#334155" />
                  <rect x="20" y="28" width="4" height="4" fill="#155b96" />
                  <rect x="28" y="28" width="8" height="8" fill="#334155" />
                  <rect x="40" y="28" width="4" height="4" fill="#155b96" />
                  <rect x="48" y="28" width="4" height="4" fill="#334155" />
                  <rect x="56" y="28" width="4" height="4" fill="#155b96" />
                  <rect x="68" y="28" width="4" height="4" fill="#334155" />
                  <rect x="4" y="36" width="4" height="4" fill="#334155" />
                  <rect x="16" y="36" width="4" height="4" fill="#155b96" />
                  <rect x="40" y="36" width="4" height="8" fill="#334155" />
                  <rect x="52" y="36" width="4" height="4" fill="#155b96" />
                  <rect x="64" y="36" width="4" height="4" fill="#334155" />
                  <rect x="4" y="44" width="4" height="4" fill="#155b96" />
                  <rect x="12" y="44" width="4" height="4" fill="#334155" />
                  <rect x="24" y="44" width="4" height="4" fill="#155b96" />
                  <rect x="48" y="44" width="8" height="4" fill="#334155" />
                  <rect x="60" y="44" width="4" height="4" fill="#155b96" />
                  <rect x="72" y="44" width="4" height="4" fill="#334155" />
                  <rect x="28" y="48" width="4" height="4" fill="#334155" />
                  <rect x="36" y="48" width="4" height="4" fill="#155b96" />
                  <rect x="56" y="56" width="4" height="4" fill="#334155" />
                  <rect x="64" y="56" width="8" height="4" fill="#155b96" />
                  <rect x="56" y="64" width="4" height="4" fill="#155b96" />
                  <rect x="64" y="64" width="4" height="4" fill="#334155" />
                  <rect x="72" y="64" width="4" height="4" fill="#155b96" />
                  <rect x="56" y="72" width="8" height="4" fill="#334155" />
                  <rect x="68" y="72" width="8" height="4" fill="#155b96" />
                </svg>
              </div>
              {data.signatureName && (
                <p className="text-[12px] font-bold text-slate-800 mt-2">
                  {data.signatureName}
                </p>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="bg-[#1e293b] text-center text-slate-300 py-4 px-6 text-[10px] sm:text-[11px]">
            <p className="font-bold text-white mb-1 text-[12px]">
              {data.companyName}
            </p>
            <p className="opacity-80">
              {data.companyOffice} • {data.companyPhone} • {data.companyEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Plus,
  Send,
  Printer,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { useInvoiceTemplateStore } from "../../../store/invoiceTemplateStore";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";

const INVOICE_COLS: ColDef[] = [
  { key: "invoiceId", label: "Invoice ID" },
  { key: "clientName", label: "Client Name" },
  { key: "description", label: "Description" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", fixed: true },
];
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ActionButton from "../../../components/ActionButton";
import SummaryStats from "../../../components/SummaryStats";
import { MOCK_INVOICE_TABLE as MOCK_INVOICES } from "../constants";
import InvoiceReceipt, { type InvoiceReceiptData } from "./InvoiceReceipt";

export default function InvoiceList() {
  const { template } = useInvoiceTemplateStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [viewInvoice, setViewInvoice] = useState<InvoiceReceiptData | null>(
    null,
  );
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(INVOICE_COLS),
  );

  const subtotal = MOCK_INVOICES.reduce(
    (sum, invoice) => sum + Number(invoice.amount.replace(/\D/g, "")),
    0,
  );

  const openActionModal = (title: string, message: string) => {
    setActionTitle(title);
    setActionMessage(message);
    setActionModalOpen(true);
  };

  const openReceipt = (id: string) => {
    const invoice = MOCK_INVOICES.find((item) => item.id === id);
    if (!invoice) return;
    setViewInvoice({
      companyName: template.companyName,
      companyTagline: template.companyTagline,
      companyOffice: template.companyOffice,
      companyPhone: template.companyPhone,
      companyWebsite: template.companyWebsite,
      companyEmail: template.companyEmail,
      customerName: invoice.client,
      customerPhone: "6281231854329",
      customerAddress: "-",
      serial: invoice.id,
      issuedDate: invoice.date,
      dueDate: invoice.date,
      items: [
        {
          name: invoice.description,
          price: Number(invoice.amount.replace(/\D/g, "")),
          quantity: 1,
          discount: 0,
        },
      ],
      discountTotal: 0,
      taxLabel: template.taxLabel,
      taxPercent: template.taxPercent,
      kodeUnik: 0,
      status: invoice.status,
      instruction: template.instruction,
      memo: template.memo,
      signatureName: template.signatureName,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
            Daftar Invoice
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-100 mt-0.5">
            Kelola tagihan pelanggan dan pantau status pembayaran.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      <SummaryStats
        items={[
          {
            label: "Total Invoice",
            value: MOCK_INVOICES.length,
            icon: <FileText size={18} />,
            color: "blue",
          },
          {
            label: "Paid",
            value: MOCK_INVOICES.filter((i) => i.status === "Paid").length,
            icon: <CheckCircle size={18} />,
            color: "emerald",
          },
          {
            label: "Unpaid",
            value: MOCK_INVOICES.filter((i) => i.status === "Unpaid").length,
            icon: <AlertCircle size={18} />,
            color: "red",
          },
          {
            label: "Total Revenue",
            value: "Rp 1.600.000",
            icon: <DollarSign size={18} />,
            color: "purple",
          },
          {
            label: "Sub Total",
            value: `Rp ${subtotal.toLocaleString("id-ID")}`,
            icon: <DollarSign size={18} />,
            color: "slate",
          },
        ]}
      />

      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
          <select className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries per page</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama atau no. invoice..."
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
        />
        <ColumnToggle
          columns={INVOICE_COLS}
          visible={visibleCols}
          onChange={setVisibleCols}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              {/* JARAK CHECKBOX DAN INVOICE ID DIRAPATKAN */}
              <th className="pl-5 pr-2 py-1.5 w-10">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                />
              </th>
              {visibleCols["invoiceId"] !== false && (
                <th className="pl-2 pr-5 py-1.5">INVOICE ID</th>
              )}
              {visibleCols["clientName"] !== false && (
                <th className="px-5 py-1.5">CLIENT NAME</th>
              )}
              {visibleCols["description"] !== false && (
                <th className="px-5 py-1.5">DESCRIPTION</th>
              )}
              {visibleCols["date"] !== false && (
                <th className="px-5 py-1.5">DATE</th>
              )}
              {visibleCols["amount"] !== false && (
                <th className="px-5 py-1.5">AMOUNT</th>
              )}
              {visibleCols["status"] !== false && (
                <th className="px-5 py-1.5">STATUS</th>
              )}
              <th className="px-5 py-1.5 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_INVOICES.map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* JARAK CHECKBOX DAN INVOICE ID DIRAPATKAN */}
                <td className="pl-5 pr-2 py-3.5">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </td>
                {visibleCols["invoiceId"] !== false && (
                  <td className="pl-2 pr-5 py-3.5 text-[#155b96] dark:text-blue-400 font-semibold">
                    {inv.id}
                  </td>
                )}
                {visibleCols["clientName"] !== false && (
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                    {inv.client}
                  </td>
                )}
                {visibleCols["description"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {inv.description}
                  </td>
                )}
                {visibleCols["date"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                    {inv.date}
                  </td>
                )}
                {visibleCols["amount"] !== false && (
                  <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-100 tabular-nums">
                    {inv.amount}
                  </td>
                )}
                {visibleCols["status"] !== false && (
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${inv.status === "Paid" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                )}
                <td className="px-5 py-3.5">
                  <div className="flex justify-center gap-1">
                    <ActionButton
                      variant="send"
                      label="Send"
                      onClick={() =>
                        openActionModal(
                          "Send Invoice",
                          `Invoice ${inv.id} siap dikirim ke ${inv.client}.`,
                        )
                      }
                    >
                      <Send size={15} />
                    </ActionButton>
                    <ActionButton
                      variant="print"
                      label="Print"
                      onClick={() => openReceipt(inv.id)}
                    >
                      <Printer size={15} />
                    </ActionButton>
                    <ActionButton
                      variant="edit"
                      label="Edit"
                      onClick={() =>
                        openActionModal(
                          "Edit Invoice",
                          `Buka form edit untuk ${inv.id} - ${inv.client}.`,
                        )
                      }
                    >
                      <Edit size={15} />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      label="Delete"
                      onClick={() =>
                        openActionModal(
                          "Delete Invoice",
                          `Konfirmasi hapus invoice ${inv.id} milik ${inv.client}.`,
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-slate-500 dark:text-slate-100">
        <div>
          Showing 1 to {MOCK_INVOICES.length} of {MOCK_INVOICES.length} entry
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed">
            &laquo;
          </button>
          <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed">
            &lsaquo;
          </button>
          <button className="px-2.5 py-1 border border-[#155b96] bg-[#155b96] text-white rounded-lg text-[12px] font-medium">
            1
          </button>
          <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed">
            &rsaquo;
          </button>
          <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed">
            &raquo;
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Invoice"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel
                label="Client Name"
                required
                tooltip="Nama pelanggan yang akan dibuatkan invoice."
              />
              <input
                type="text"
                required
                placeholder="e.g. Budi Susanto"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
              />
            </div>
            <div>
              <FormLabel
                label="Amount (Rp)"
                required
                tooltip="Jumlah tagihan dalam Rupiah."
              />
              <input
                type="number"
                required
                placeholder="250000"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <FormLabel
              label="Description"
              tooltip="Keterangan invoice, contoh: Tagihan Internet Paket 20Mbps."
            />
            <input
              type="text"
              placeholder="e.g. Tagihan Internet Paket 20Mbps"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              Save Invoice
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={actionTitle}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-100">
            {actionMessage}
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActionModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {viewInvoice && (
        <InvoiceReceipt
          data={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
}

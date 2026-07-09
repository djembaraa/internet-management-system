import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  PlusCircle,
  MinusCircle,
  Pencil,
  Trash2,
  Eye,
  Send,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import SummaryStats from "../../../components/SummaryStats";
import EmptyState from "../../../components/EmptyState";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import InvoiceReceipt, { type InvoiceReceiptData } from "./InvoiceReceipt";
import { useInvoiceTemplateStore } from "../../../store/invoiceTemplateStore";
import ActionButton from "../../../components/ActionButton";
import PaginationControls from "../../../components/PaginationControls";
import { type ManualInvoiceItem as ManualInvoice } from "../constants";
import { supabase } from "../../../services/supabase";

const INVOICE_COLS: ColDef[] = [
  { key: "invoiceId", label: "Invoice ID" },
  { key: "clientName", label: "Client Name" },
  { key: "description", label: "Description" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", fixed: true },
];

// Helper for modern toggle switch
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 cursor-pointer group hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
      <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? "transform translate-x-4" : ""}`}
        ></div>
      </div>
    </label>
  );
}

export default function InvoiceManual() {
  const { template } = useInvoiceTemplateStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(INVOICE_COLS),
  );
  const [invoices, setInvoices] = useState<ManualInvoice[]>([]);

  const fetchData = async () => {
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (data) {
      setInvoices(data.map(i => ({
        id: i.id,
        fullname: i.fullname || i.client_id || "Unknown",
        description: i.type === 'Manual' ? 'Manual Invoice' : "Monthly Internet Bill",
        date: new Date(i.created_at).toLocaleDateString(),
        amount: "Rp " + i.amount.toLocaleString(),
        status: i.status === "Unpaid" ? "Unpaid" : "Paid",
        serial: i.serial || i.invoice_number || `INV-${i.id.substring(0,6)}`
      })));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mobile expand
  const [expandedMobileId, setExpandedMobileId] = useState<number | null>(null);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInvoice, setDeleteInvoice] = useState<ManualInvoice | null>(
    null,
  );

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<ManualInvoice | null>(
    null,
  );

  // Receipt / View modal
  const [receiptData, setReceiptData] = useState<InvoiceReceiptData | null>(
    null,
  );

  const openReceipt = (inv: ManualInvoice) => {
    setReceiptData({
      companyName: template.companyName,
      companyTagline: template.companyTagline,
      companyOffice: template.companyOffice,
      companyPhone: template.companyPhone,
      companyWebsite: template.companyWebsite,
      companyEmail: template.companyEmail,
      customerName: inv.fullname,
      customerPhone: "6281231854329",
      customerAddress: "-",
      serial: inv.serial,
      issuedDate: inv.date,
      dueDate: inv.date,
      paidDate: inv.status === "Paid" ? "2026-02-28" : undefined,
      items: [
        {
          name: inv.description,
          price: parseInt(inv.amount.replace(/\D/g, "")),
          quantity: 1,
          discount: 0,
        },
      ],
      discountTotal: 0,
      taxLabel: template.taxLabel,
      taxPercent: template.taxPercent,
      kodeUnik: 0,
      status: inv.status,
      instruction:
        template.instruction || "Ini adalah catatan untuk panduan pembayaran",
      memo: template.memo || "Ini adalah catatan untuk client / customer",
      signatureName: template.signatureName || inv.fullname,
    });
  };

  // Send Notification modal
  const [isSendNotifOpen, setIsSendNotifOpen] = useState(false);
  const [notifInvoice, setNotifInvoice] = useState<ManualInvoice | null>(null);
  const [notifContact, setNotifContact] = useState("");
  const [notifEmail, setNotifEmail] = useState("");
  const [notifAttachment, setNotifAttachment] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifViaWhatsapp, setNotifViaWhatsapp] = useState(false);
  const [notifViaEmail, setNotifViaEmail] = useState(false);

  const openSendNotifModal = (inv: ManualInvoice) => {
    setNotifInvoice(inv);
    setNotifContact("");
    setNotifEmail("");
    setNotifAttachment("-");
    setNotifMessage(
      `Terimakasih telah melakukan pembayaran pada invoice ${inv.serial}`,
    );
    setNotifViaWhatsapp(false);
    setNotifViaEmail(false);
    setIsSendNotifOpen(true);
  };

  // Edit form state
  const [editFullName, setEditFullName] = useState("");
  const [editDraft, setEditDraft] = useState("No");
  const [editStatus, setEditStatus] = useState("Unpaid");
  const [editContact, setEditContact] = useState("");
  const [editIssuedDate, setEditIssuedDate] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editSendWhatsapp, setEditSendWhatsapp] = useState(false);
  const [editAttachInvoice, setEditAttachInvoice] = useState(false);
  const [editSendEmail, setEditSendEmail] = useState(false);
  const [editDownPayment, setEditDownPayment] = useState("0");
  const [editAddress, setEditAddress] = useState("");
  const [editRepeated, setEditRepeated] = useState("No");
  const [editAddTax, setEditAddTax] = useState(false);
  const [editPercentTax, setEditPercentTax] = useState("10.5");
  const [editInstruction, setEditInstruction] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editLineItems, setEditLineItems] = useState([
    { item: "", harga: "", quantity: "", discount: "" },
  ]);

  // Form state
  const [fullName, setFullName] = useState("");
  const [draft, setDraft] = useState("No");
  const [status, setStatus] = useState("Unpaid");
  const [contact, setContact] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [email, setEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sendWhatsapp, setSendWhatsapp] = useState(false);
  const [attachInvoice, setAttachInvoice] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [downPayment, setDownPayment] = useState("");
  const [address, setAddress] = useState("");
  const [repeated, setRepeated] = useState("No");
  const [addTax, setAddTax] = useState(false);
  const [percentTax, setPercentTax] = useState("11");
  const [instruction, setInstruction] = useState("");
  const [memo, setMemo] = useState("");
  const [lineItems, setLineItems] = useState([
    { item: "", harga: "", quantity: "", discount: "" },
  ]);

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";

  const resetForm = () => {
    setFullName("");
    setDraft("No");
    setStatus("Unpaid");
    setContact("");
    setIssuedDate("");
    setEmail("");
    setDueDate("");
    setSendWhatsapp(false);
    setAttachInvoice(false);
    setSendEmail(false);
    setDownPayment("");
    setAddress("");
    setRepeated("No");
    setAddTax(false);
    setPercentTax("11");
    setInstruction("");
    setMemo("");
    setLineItems([{ item: "", harga: "", quantity: "", discount: "" }]);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { item: "", harga: "", quantity: "", discount: "" },
    ]);
  };

  const addEditLineItem = () => {
    setEditLineItems([
      ...editLineItems,
      { item: "", harga: "", quantity: "", discount: "" },
    ]);
  };

  const openEditModal = (inv: ManualInvoice) => {
    setEditingInvoice(inv);
    setEditFullName(inv.fullname);
    setEditDraft("No");
    setEditStatus(inv.status);
    setEditContact("");
    setEditIssuedDate(inv.date);
    setEditEmail("");
    setEditDueDate(inv.date);
    setEditSendWhatsapp(false);
    setEditAttachInvoice(false);
    setEditSendEmail(false);
    setEditDownPayment("0");
    setEditAddress("-");
    setEditRepeated("No");
    setEditAddTax(false);
    setEditPercentTax("11");
    setEditInstruction("Catatan untuk panduan pembayaran");
    setEditMemo("Catatan untuk client");
    setEditLineItems([
      {
        item: inv.description,
        harga: inv.amount.replace(/\D/g, ""),
        quantity: "1",
        discount: "0",
      },
    ]);
    setIsEditModalOpen(true);
  };

  const filtered = invoices.filter(
    (inv) =>
      searchTerm === "" ||
      inv.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.serial.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalInvoices = invoices.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedInvoices = filtered.slice(startIndex, startIndex + pageSize);
  const startItem = filtered.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, filtered.length);
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const unpaidCount = invoices.filter((i) => i.status === "Unpaid").length;
  const partialCount = invoices.filter(
    (i) => i.status === "Partially Paid",
  ).length;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              Daftar Invoice
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola tagihan pelanggan dan pantau status pembayaran
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
          >
            <Plus size={16} /> Add New Invoice
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
          <SummaryStats
            items={[
              {
                label: "Total",
                value: totalInvoices,
                icon: <Layers size={18} />,
                color: "blue",
              },
              {
                label: "Paid",
                value: paidCount,
                icon: <CheckCircle size={18} />,
                color: "emerald",
              },
              {
                label: "Unpaid",
                value: unpaidCount,
                icon: <XCircle size={18} />,
                color: "red",
              },
              {
                label: "Partial",
                value: partialCount,
                icon: <Clock size={18} />,
                color: "amber",
              },
            ]}
          />
        </div>

        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100 font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search fullname or serial..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 transition-all"
            />
            <ColumnToggle
              columns={INVOICE_COLS}
              visible={visibleCols}
              onChange={setVisibleCols}
            />
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 pt-2">
          {filtered.length === 0 ? (
            <EmptyState
              title="Data Kosong"
              message="Tidak ada invoice ditemukan."
            />
          ) : (
            paginatedInvoices.map((inv, index) => {
              const isExpanded = expandedMobileId === inv.id;
              const statusClass =
                inv.status === "Paid"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                  : inv.status === "Unpaid"
                    ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
              const dotClass =
                inv.status === "Paid"
                  ? "bg-emerald-500"
                  : inv.status === "Unpaid"
                    ? "bg-red-500"
                    : "bg-amber-500";

              return (
                <div
                  key={inv.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900"
                >
                  <button
                    onClick={() =>
                      setExpandedMobileId(isExpanded ? null : inv.id)
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-4 shrink-0 tabular-nums">
                      {startIndex + index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate block">
                        {inv.fullname}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tabular-nums truncate mt-0.5 block">
                        {inv.amount}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${statusClass}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${dotClass}`}
                      ></span>
                      {inv.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        size={16}
                        className="text-slate-400 dark:text-slate-100 shrink-0 ml-1"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-slate-400 dark:text-slate-100 shrink-0 ml-1"
                      />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="col-span-2">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                            Description
                          </p>
                          <p className="text-[12px] text-slate-700 dark:text-slate-200 font-medium">
                            {inv.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                            Date
                          </p>
                          <p className="text-[12px] text-slate-700 dark:text-slate-200 font-medium tabular-nums">
                            {inv.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                            Invoice ID
                          </p>
                          <p className="text-[12px] text-[#155b96] dark:text-blue-400 font-bold tabular-nums">
                            {inv.serial}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-2">
                        <ActionButton
                          variant="view"
                          label="View"
                          onClick={() => openReceipt(inv)}
                          className="flex-1 justify-center"
                        >
                          <Eye size={14} /> View
                        </ActionButton>
                        <ActionButton
                          variant="send"
                          label="Notif"
                          onClick={() => openSendNotifModal(inv)}
                          className="flex-1 justify-center"
                        >
                          <Send size={14} /> Notif
                        </ActionButton>
                        <ActionButton
                          variant="edit"
                          label="Edit"
                          onClick={() => openEditModal(inv)}
                          className="flex-1 justify-center"
                        >
                          <Pencil size={14} /> Edit
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          label="Delete"
                          onClick={() => {
                            setDeleteInvoice(inv);
                            setDeleteModalOpen(true);
                          }}
                          className="flex-1 justify-center"
                        >
                          <Trash2 size={14} /> Delete
                        </ActionButton>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Table (desktop only) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                {/* JARAK CHECKBOX DAN INVOICE ID DIRAPATKAN DISINI */}
                <th className="pl-5 pr-2 py-1.5 w-10">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </th>
                {visibleCols["invoiceId"] !== false && (
                  <th className="pl-2 pr-5 py-1.5 w-24">INVOICE ID</th>
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
                <th className="px-5 py-1.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="Data Kosong"
                      message="Tidak ada invoice ditemukan."
                    />
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => {
                  const statusClass =
                    inv.status === "Paid"
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                      : inv.status === "Unpaid"
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                        : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
                  const dotClass =
                    inv.status === "Paid"
                      ? "bg-emerald-500"
                      : inv.status === "Unpaid"
                        ? "bg-red-500"
                        : "bg-amber-500";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                    >
                      {/* JARAK CHECKBOX DAN INVOICE ID DIRAPATKAN DISINI */}
                      <td className="pl-5 pr-2 py-1.5">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                        />
                      </td>
                      {visibleCols["invoiceId"] !== false && (
                        <td className="pl-2 pr-5 py-4 text-[#155b96] dark:text-blue-400 font-bold tabular-nums">
                          {inv.serial}
                        </td>
                      )}
                      {visibleCols["clientName"] !== false && (
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-100">
                          {inv.fullname}
                        </td>
                      )}
                      {visibleCols["description"] !== false && (
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                          {inv.description}
                        </td>
                      )}
                      {visibleCols["date"] !== false && (
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400 tabular-nums">
                          {inv.date}
                        </td>
                      )}
                      {visibleCols["amount"] !== false && (
                        <td className="px-5 py-4 font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                          {inv.amount}
                        </td>
                      )}
                      {visibleCols["status"] !== false && (
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${dotClass}`}
                            ></span>
                            {inv.status}
                          </span>
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => openReceipt(inv)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            onClick={() => openSendNotifModal(inv)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 transition-colors flex items-center gap-1"
                          >
                            <Send size={14} /> Notif
                          </button>
                          <button
                            onClick={() => openEditModal(inv)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteInvoice(inv);
                              setDeleteModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          totalItems={filtered.length}
          itemLabel="entries"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ─── Add/Edit Invoice Modal (2-Column Layout) ─── */}
      <Modal
        isOpen={isModalOpen || isEditModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
        }}
        title={
          isModalOpen
            ? "Add New Invoice"
            : `Edit Invoice ${editingInvoice?.serial || ""}`
        }
        maxWidth="xl" // Using a wider modal for complex form
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (isModalOpen) {
              const amount = lineItems.reduce((acc, curr) => acc + (parseInt(curr.harga) || 0) * (parseInt(curr.quantity) || 1), 0);
              supabase.from('invoices').insert([{
                fullname: fullName,
                serial: `INV-M-${Math.floor(100000 + Math.random() * 900000)}`,
                amount: amount,
                status: status,
                type: 'Manual',
                due_date: dueDate ? new Date(dueDate).toISOString() : null
              }]).then(() => {
                fetchData();
              });
              setIsModalOpen(false);
            } else {
              const amount = editLineItems.reduce((acc, curr) => acc + (parseInt(curr.harga) || 0) * (parseInt(curr.quantity) || 1), 0);
              supabase.from('invoices').update({
                fullname: editFullName,
                status: editStatus,
                amount: amount,
                due_date: editDueDate ? new Date(editDueDate).toISOString() : null
              }).eq('id', editingInvoice?.id).then(() => {
                fetchData();
              });
              setIsEditModalOpen(false);
              setEditingInvoice(null);
            }
            resetForm();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Customer & Invoice Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <Layers
                  size={16}
                  className="text-[#155b96] dark:text-blue-400"
                />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Invoice Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Full Name" required />
                  <input
                    type="text"
                    required
                    value={isModalOpen ? fullName : editFullName}
                    onChange={(e) =>
                      isModalOpen
                        ? setFullName(e.target.value)
                        : setEditFullName(e.target.value)
                    }
                    placeholder="Customer Name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Status" required />
                  <select
                    value={isModalOpen ? status : editStatus}
                    onChange={(e) =>
                      isModalOpen
                        ? setStatus(e.target.value)
                        : setEditStatus(e.target.value)
                    }
                    className={selectClasses}
                  >
                    <option>Unpaid</option>
                    <option>Paid</option>
                    <option>Partially Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Contact (Phone)" />
                  <input
                    type="text"
                    value={isModalOpen ? contact : editContact}
                    onChange={(e) =>
                      isModalOpen
                        ? setContact(e.target.value)
                        : setEditContact(e.target.value)
                    }
                    placeholder="0812..."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Email" />
                  <input
                    type="email"
                    value={isModalOpen ? email : editEmail}
                    onChange={(e) =>
                      isModalOpen
                        ? setEmail(e.target.value)
                        : setEditEmail(e.target.value)
                    }
                    placeholder="mail@example.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Issued Date" required />
                  <input
                    type="date"
                    required
                    value={isModalOpen ? issuedDate : editIssuedDate}
                    onChange={(e) =>
                      isModalOpen
                        ? setIssuedDate(e.target.value)
                        : setEditIssuedDate(e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Due Date" required />
                  <input
                    type="date"
                    required
                    value={isModalOpen ? dueDate : editDueDate}
                    onChange={(e) =>
                      isModalOpen
                        ? setDueDate(e.target.value)
                        : setEditDueDate(e.target.value)
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Address" />
                <textarea
                  rows={2}
                  value={isModalOpen ? address : editAddress}
                  onChange={(e) =>
                    isModalOpen
                      ? setAddress(e.target.value)
                      : setEditAddress(e.target.value)
                  }
                  placeholder="Full address"
                  className={inputClasses + " resize-y"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Save as Draft" required />
                  <select
                    value={isModalOpen ? draft : editDraft}
                    onChange={(e) =>
                      isModalOpen
                        ? setDraft(e.target.value)
                        : setEditDraft(e.target.value)
                    }
                    className={selectClasses}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <FormLabel label="Repeated (Recurring)" required />
                  <select
                    value={isModalOpen ? repeated : editRepeated}
                    onChange={(e) =>
                      isModalOpen
                        ? setRepeated(e.target.value)
                        : setEditRepeated(e.target.value)
                    }
                    className={selectClasses}
                  >
                    <option value="No">No</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="4 Weeks">4 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Line Items, Tax, Down Payment & Prefs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <Save size={16} className="text-[#155b96] dark:text-blue-400" />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Items & Preferences
                </h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                    Line Items
                  </h4>
                  <button
                    type="button"
                    onClick={isModalOpen ? addLineItem : addEditLineItem}
                    className="text-[11px] font-medium text-[#155b96] hover:text-[#0e4a7a] flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md transition-colors"
                  >
                    <PlusCircle size={13} /> Add Item
                  </button>
                </div>

                {/* Header items */}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 shrink-0" />
                  <div className="grid grid-cols-4 gap-2 flex-1 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    <span>Item Name</span>
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Discount</span>
                  </div>
                </div>

                {/* Render Line Items based on mode */}
                {(isModalOpen ? lineItems : editLineItems).map((item, i) => (
                  <div key={i} className="group flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isModalOpen) {
                          setLineItems(lineItems.filter((_, idx) => idx !== i));
                        } else {
                          setEditLineItems(
                            editLineItems.filter((_, idx) => idx !== i),
                          );
                        }
                      }}
                      disabled={
                        (isModalOpen
                          ? lineItems.length
                          : editLineItems.length) === 1
                      }
                      className="mt-1 w-6 h-6 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MinusCircle size={14} />
                    </button>
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={item.item}
                        onChange={(e) => {
                          if (isModalOpen) {
                            const n = [...lineItems];
                            n[i].item = e.target.value;
                            setLineItems(n);
                          } else {
                            const n = [...editLineItems];
                            n[i].item = e.target.value;
                            setEditLineItems(n);
                          }
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.harga}
                        onChange={(e) => {
                          if (isModalOpen) {
                            const n = [...lineItems];
                            n[i].harga = e.target.value;
                            setLineItems(n);
                          } else {
                            const n = [...editLineItems];
                            n[i].harga = e.target.value;
                            setEditLineItems(n);
                          }
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          if (isModalOpen) {
                            const n = [...lineItems];
                            n[i].quantity = e.target.value;
                            setLineItems(n);
                          } else {
                            const n = [...editLineItems];
                            n[i].quantity = e.target.value;
                            setEditLineItems(n);
                          }
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Disc"
                        value={item.discount}
                        onChange={(e) => {
                          if (isModalOpen) {
                            const n = [...lineItems];
                            n[i].discount = e.target.value;
                            setLineItems(n);
                          } else {
                            const n = [...editLineItems];
                            n[i].discount = e.target.value;
                            setEditLineItems(n);
                          }
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <FormLabel label="Down Payment" />
                  <input
                    type="number"
                    value={isModalOpen ? downPayment : editDownPayment}
                    onChange={(e) =>
                      isModalOpen
                        ? setDownPayment(e.target.value)
                        : setEditDownPayment(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer group">
                    <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
                      Apply Tax
                    </span>
                    <div className="relative shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isModalOpen ? addTax : editAddTax}
                        onChange={(e) =>
                          isModalOpen
                            ? setAddTax(e.target.checked)
                            : setEditAddTax(e.target.checked)
                        }
                      />
                      <div
                        className={`block w-8 h-4 rounded-full transition-colors ${isModalOpen ? (addTax ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600") : editAddTax ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform shadow-sm ${isModalOpen ? (addTax ? "transform translate-x-4" : "") : editAddTax ? "transform translate-x-4" : ""}`}
                      ></div>
                    </div>
                  </label>
                  {(isModalOpen ? addTax : editAddTax) && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="text"
                        placeholder="e.g. 11"
                        value={isModalOpen ? percentTax : editPercentTax}
                        onChange={(e) =>
                          isModalOpen
                            ? setPercentTax(e.target.value)
                            : setEditPercentTax(e.target.value)
                        }
                        className={inputClasses + " py-1.5"}
                      />
                      <span className="text-[12px] font-bold text-slate-500">
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <ToggleSwitch
                  label="Send Whatsapp Notification"
                  checked={isModalOpen ? sendWhatsapp : editSendWhatsapp}
                  onChange={() =>
                    isModalOpen
                      ? setSendWhatsapp(!sendWhatsapp)
                      : setEditSendWhatsapp(!editSendWhatsapp)
                  }
                />
                <ToggleSwitch
                  label="Attach PDF in Whatsapp"
                  checked={isModalOpen ? attachInvoice : editAttachInvoice}
                  onChange={() =>
                    isModalOpen
                      ? setAttachInvoice(!attachInvoice)
                      : setEditAttachInvoice(!editAttachInvoice)
                  }
                />
                <ToggleSwitch
                  label="Send Email Notification"
                  checked={isModalOpen ? sendEmail : editSendEmail}
                  onChange={() =>
                    isModalOpen
                      ? setSendEmail(!sendEmail)
                      : setEditSendEmail(!editSendEmail)
                  }
                />
              </div>

              <div>
                <FormLabel
                  label="Instruction"
                  tooltip="Gunakan '*' untuk default dari template"
                />
                <textarea
                  rows={2}
                  value={isModalOpen ? instruction : editInstruction}
                  onChange={(e) =>
                    isModalOpen
                      ? setInstruction(e.target.value)
                      : setEditInstruction(e.target.value)
                  }
                  className={inputClasses + " resize-y"}
                  placeholder="Catatan pembayaran..."
                />
              </div>

              <div>
                <FormLabel
                  label="Memo"
                  tooltip="Gunakan '*' untuk default dari template"
                />
                <textarea
                  rows={2}
                  value={isModalOpen ? memo : editMemo}
                  onChange={(e) =>
                    isModalOpen
                      ? setMemo(e.target.value)
                      : setEditMemo(e.target.value)
                  }
                  className={inputClasses + " resize-y"}
                  placeholder="Pesan untuk client..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors active:scale-[0.98]"
            >
              <Save size={16} />{" "}
              {isModalOpen ? "Save New Invoice" : "Update Invoice"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Send Notification Modal ─── */}
      <Modal
        isOpen={isSendNotifOpen}
        onClose={() => {
          setIsSendNotifOpen(false);
          setNotifInvoice(null);
        }}
        title="Send Notification"
        maxWidth="md"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Send notif:", {
              notifInvoice,
              notifContact,
              notifEmail,
              notifAttachment,
              notifMessage,
              notifViaWhatsapp,
              notifViaEmail,
            });
            setIsSendNotifOpen(false);
            setNotifInvoice(null);
          }}
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg mb-4">
            <p className="text-[12px] font-semibold text-[#155b96] dark:text-blue-400 flex items-center justify-between">
              <span>Invoice: {notifInvoice?.serial}</span>
              <span className="tabular-nums">{notifInvoice?.amount}</span>
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
              To: <span className="font-medium">{notifInvoice?.fullname}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel label="Contact (Phone)" />
              <input
                type="text"
                value={notifContact}
                onChange={(e) => setNotifContact(e.target.value)}
                placeholder="6281234567890"
                className={inputClasses}
              />
            </div>
            <div>
              <FormLabel label="Email Address" />
              <input
                type="email"
                value={notifEmail}
                onChange={(e) => setNotifEmail(e.target.value)}
                placeholder="someone@gmail.com"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <FormLabel label="Attachment Link" />
            <input
              type="text"
              value={notifAttachment}
              onChange={(e) => setNotifAttachment(e.target.value)}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>

          <div>
            <FormLabel label="Message" />
            <textarea
              rows={4}
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              className={inputClasses + " resize-none"}
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
              Send Via Platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ToggleSwitch
                label="WhatsApp"
                checked={notifViaWhatsapp}
                onChange={() => setNotifViaWhatsapp(!notifViaWhatsapp)}
              />
              <ToggleSwitch
                label="Email"
                checked={notifViaEmail}
                onChange={() => setNotifViaEmail(!notifViaEmail)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSendNotifOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors active:scale-[0.98]"
            >
              <Send size={15} /> Send Notification
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteInvoice(null);
        }}
        onConfirm={() => {
          if (deleteInvoice?.id) {
            supabase
              .from('invoices')
              .delete()
              .eq('id', deleteInvoice.id)
              .then(() => {
                fetchData();
              });
          }
          setDeleteInvoice(null);
          setDeleteModalOpen(false);
        }}
        itemCount={1}
      />

      {/* ─── Invoice Receipt View ─── */}
      {receiptData && (
        <InvoiceReceipt
          data={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  );
}

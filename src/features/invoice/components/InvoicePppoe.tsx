import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  PlusCircle,
  MinusCircle,
  Layers,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useInvoiceTemplateStore } from "../../../store/invoiceTemplateStore";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import EmptyState from "../../../components/EmptyState";
import PaginationControls from "../../../components/PaginationControls";
import SummaryStats from "../../../components/SummaryStats";
import ActionButton from "../../../components/ActionButton";
import InvoiceReceipt, { type InvoiceReceiptData } from "./InvoiceReceipt";
import { supabase } from "../../../services/supabase";

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
    <label className="flex items-center justify-between px-3.5 py-2.5 h-[42px] bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer group hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
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

// Helper for expandable toggle switch
function ExpandableToggle({
  checked,
  onChange,
  label,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border transition-all duration-200 ${checked ? "border-[#155b96]/30 bg-blue-50/10 dark:bg-blue-900/10 shadow-sm" : "border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40"}`}
    >
      <label className="flex items-center justify-between px-3.5 py-2.5 h-[42px] cursor-pointer group">
        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
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
      {checked && (
        <div className="px-3.5 pb-3.5 pt-1 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function InvoicePppoe() {
  const { template } = useInvoiceTemplateStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState<InvoiceReceiptData | null>(
    null,
  );

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data: cData } = await supabase.from('profiles').select('*').eq('role', 'client');
    if (cData) setClients(cData);

    const { data } = await supabase
      .from('invoices')
      .select('*, profiles(username)')
      .eq('type', 'PPPoE')
      .order('created_at', { ascending: false });
    
    if (data) {
      setInvoices(data.map(d => ({
        ...d,
        username: d.profiles?.username || '-'
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filtered = invoices.filter(
    (inv) =>
      searchTerm === "" ||
      inv.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.serial.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedInvoices = filtered.slice(startIndex, startIndex + pageSize);
  const startItem = filtered.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, filtered.length);
  const totalInvoices = invoices.length;
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const unpaidCount = invoices.filter((i) => i.status === "Unpaid").length;
  const partialCount = invoices.filter(
    (i) => i.status === "Partially Paid",
  ).length;

  const buildReceipt = (
    inv: any,
  ): InvoiceReceiptData => ({
    companyName: template.companyName,
    companyTagline: template.companyTagline,
    companyOffice: template.companyOffice,
    companyPhone: template.companyPhone,
    companyWebsite: template.companyWebsite,
    companyEmail: template.companyEmail,
    customerName: inv.fullname,
    customerPhone: inv.username || "-",
    customerAddress: "-",
    serial: inv.serial,
    issuedDate: "2026-03-07",
    dueDate: "2026-03-14",
    items: [
      {
        name: `PPPoE Invoice untuk ${inv.fullname}`,
        price: inv.amount,
        quantity: 1,
        discount: 0,
      },
    ],
    discountTotal: 0,
    taxLabel: template.taxLabel,
    taxPercent: template.taxPercent,
    kodeUnik: 0,
    status:
      inv.status === "Paid"
        ? "Paid"
        : inv.status === "Partially Paid"
          ? "Partially Paid"
          : "Unpaid",
    instruction: template.instruction,
    memo: template.memo,
    signatureName: template.signatureName,
  });

  // Add form state
  const [fullName, setFullName] = useState("");
  const [draft, setDraft] = useState("No");
  const [tujukanPelanggan, setTujukanPelanggan] = useState(false);
  const [nomorPelanggan, setNomorPelanggan] = useState("");
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
  const [taxPercent, setTaxPercent] = useState("11");
  const [instruction, setInstruction] = useState("");
  const [memo, setMemo] = useState("");

  // Line items
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
    setTujukanPelanggan(false);
    setNomorPelanggan("");
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
    setTaxPercent("11");
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

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              List Invoice PPPoE
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola tagihan khusus pelanggan layanan PPPoE
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
              placeholder="Search invoice..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Mobile Cards (Empty Placeholder) */}
        <div className="md:hidden px-4 pb-4">
          <EmptyState
            title="Data Kosong"
            message="Belum ada invoice PPPoE yang ditambahkan."
          />
        </div>

        {/* Table (desktop only) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pl-5 pr-2 py-1.5 w-10">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </th>
                <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                <th className="px-5 py-1.5">FULLNAME</th>
                <th className="px-5 py-1.5">USERNAME</th>
                <th className="px-5 py-1.5">SERIAL</th>
                <th className="px-5 py-1.5">AMOUNT</th>
                <th className="px-5 py-1.5">STATUS</th>
                <th className="px-5 py-1.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin inline mr-2 text-[#155b96]" /> Loading invoices...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      title="Data Kosong"
                      message="Belum ada invoice PPPoE yang ditambahkan."
                    />
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv, idx) => {
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
                      <td className="pl-5 pr-2 py-3.5">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                        />
                      </td>
                      <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                        {startIndex + idx + 1}
                      </td>
                      <td className="px-5 py-3.5">{inv.fullname}</td>
                      <td className="px-5 py-3.5">{inv.username}</td>
                      <td className="px-5 py-3.5">{inv.serial}</td>
                      <td className="px-5 py-3.5">
                        Rp {inv.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusClass}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${dotClass}`}
                          />
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-center gap-1.5">
                          <ActionButton
                            variant="view"
                            label="View"
                            onClick={() => setViewInvoice(buildReceipt(inv))}
                          >
                            <Eye size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="edit"
                            label="Edit"
                            onClick={() =>
                              console.log("Edit PPPoE invoice:", inv)
                            }
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="send"
                            label="Send"
                            onClick={() =>
                              console.log("Send PPPoE invoice:", inv)
                            }
                          >
                            <Send size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="delete"
                            label="Delete"
                            onClick={async () => {
                              if(window.confirm('Yakin hapus tagihan ini?')) {
                                await supabase.from('invoices').delete().eq('id', inv.id);
                                fetchInvoices();
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* ─── Add New Invoice Modal (2-Column Layout) ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Add New PPPoE Invoice"
        maxWidth="xl"
      >
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const amount = lineItems.reduce((acc, it) => acc + (Number(it.harga)*Number(it.quantity) - Number(it.discount)), 0);
            
            const { error } = await supabase.from('invoices').insert({
              client_id: tujukanPelanggan && nomorPelanggan ? nomorPelanggan : null,
              fullname: fullName,
              serial: `INV-${Date.now()}`,
              amount: amount,
              status: status,
              type: 'PPPoE',
              due_date: dueDate || null,
              created_at: issuedDate ? new Date(issuedDate).toISOString() : undefined,
            });

            if (error) {
              alert("Gagal menyimpan invoice: " + error.message);
              return;
            }

            fetchInvoices();
            setIsModalOpen(false);
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Customer Name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Status" required />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={selectClasses}
                  >
                    <option>Unpaid</option>
                    <option>Paid</option>
                    <option>Partially Paid</option>
                  </select>
                </div>
              </div>

              {/* Expandable Toggle Tujukan Pelanggan */}
              <div>
                <ExpandableToggle
                  label="Tujukan pada pelanggan"
                  checked={tujukanPelanggan}
                  onChange={() => setTujukanPelanggan(!tujukanPelanggan)}
                >
                  <select
                    value={nomorPelanggan}
                    onChange={(e) => setNomorPelanggan(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="">Pilih Klien...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.full_name || c.username}</option>
                    ))}
                  </select>
                </ExpandableToggle>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Contact (Phone)" />
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="0812..."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Email" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Due Date" required />
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Address" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                  className={inputClasses + " resize-y"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Save as Draft" required />
                  <select
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <FormLabel label="Repeated (Recurring)" required />
                  <select
                    value={repeated}
                    onChange={(e) => setRepeated(e.target.value)}
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

            {/* Right Column: Items & Prefs */}
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
                    onClick={addLineItem}
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

                {lineItems.map((item, i) => (
                  <div key={i} className="group flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setLineItems(lineItems.filter((_, idx) => idx !== i))
                      }
                      disabled={lineItems.length === 1}
                      className="mt-1 w-6 h-6 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <MinusCircle size={14} />
                    </button>
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={item.item}
                        onChange={(e) => {
                          const n = [...lineItems];
                          n[i].item = e.target.value;
                          setLineItems(n);
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.harga}
                        onChange={(e) => {
                          const n = [...lineItems];
                          n[i].harga = e.target.value;
                          setLineItems(n);
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const n = [...lineItems];
                          n[i].quantity = e.target.value;
                          setLineItems(n);
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Disc"
                        value={item.discount}
                        onChange={(e) => {
                          const n = [...lineItems];
                          n[i].discount = e.target.value;
                          setLineItems(n);
                        }}
                        className="border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 outline-none focus:border-[#155b96] transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* EXACT ALIGNMENT HERE */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <FormLabel label="Down Payment" />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div className="w-full">
                  <ExpandableToggle
                    label="Apply Tax"
                    checked={addTax}
                    onChange={() => setAddTax(!addTax)}
                  >
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:border-[#155b96] focus-within:ring-2 focus-within:ring-[#155b96]/10 transition-all bg-white dark:bg-slate-800">
                      <input
                        type="number"
                        step="0.1"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-[13px] bg-transparent text-slate-700 dark:text-slate-100 outline-none"
                      />
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-l border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-semibold text-[13px]">
                        %
                      </div>
                    </div>
                  </ExpandableToggle>
                </div>
              </div>

              <div className="space-y-3">
                <ToggleSwitch
                  label="Send Whatsapp Notification"
                  checked={sendWhatsapp}
                  onChange={() => setSendWhatsapp(!sendWhatsapp)}
                />
                <ToggleSwitch
                  label="Attach PDF in Whatsapp"
                  checked={attachInvoice}
                  onChange={() => setAttachInvoice(!attachInvoice)}
                />
                <ToggleSwitch
                  label="Send Email Notification"
                  checked={sendEmail}
                  onChange={() => setSendEmail(!sendEmail)}
                />
              </div>

              <div>
                <FormLabel
                  label="Instruction"
                  tooltip="Gunakan '*' untuk default dari template"
                />
                <textarea
                  rows={2}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
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
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className={inputClasses + " resize-y"}
                  placeholder="Pesan untuk client..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
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
              <Save size={16} /> Save New Invoice
            </button>
          </div>
        </form>
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

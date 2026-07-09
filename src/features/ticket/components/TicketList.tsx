import { useState, useRef, useEffect } from "react";
import { supabase } from "../../../services/supabase";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import EmptyState from "../../../components/EmptyState";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ActionButton from "../../../components/ActionButton";
import SummaryStats from "../../../components/SummaryStats";
import PaginationControls from "../../../components/PaginationControls";

const TICKET_COLS: ColDef[] = [
  { key: "subject_person", label: "Subject Person" },
  { key: "no_ticket", label: "No Ticket" },
  { key: "subject", label: "Subject" },
  { key: "status", label: "Status" },
  { key: "last_update", label: "Last Update" },
  { key: "action", label: "Action", fixed: true },
];

export default function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = async () => {
    const { data, error } = await supabase.from("tickets").select("*").order("last_update", { ascending: false });
    if (!error && data) {
      setTickets(data);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, (payload) => {
        console.log('Real-time update:', payload);
        fetchTickets(); // Re-fetch on any change for simplicity, or we could mutate state locally
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(TICKET_COLS),
  );

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterTicketStatus, setFilterTicketStatus] = useState("");

  type SortKey =
    | "subject_person"
    | "no_ticket"
    | "subject"
    | "status"
    | "last_update";
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const handleSort = (col: SortKey) => {
    if (sortBy === col) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };
  const sortIcon = (col: SortKey) =>
    sortBy !== col ? (
      <ArrowUpDown size={12} className="opacity-40" />
    ) : sortOrder === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );

  // Form state
  const [issuedTo, setIssuedTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  const filteredTickets = [...tickets]
    .filter(
      (t) =>
        (searchTerm === "" ||
          t.subject_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterTicketStatus === "" || t.status === filterTicketStatus),
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const av = String(a[sortBy]).toLowerCase();
      const bv = String(b[sortBy]).toLowerCase();
      return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + pageSize);
  const startItem = filteredTickets.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, filteredTickets.length);

  const resetForm = () => {
    setIssuedTo("");
    setSubject("");
    setMessage("");
    setAttachments([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
            Daftar Tiket
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-100 mt-0.5">
            Kelola tiket layanan pelanggan.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Open New Ticket
        </button>
      </div>

      <SummaryStats
        items={[
          {
            label: "Total Tiket",
            value: tickets.length,
            icon: <FileText size={18} />,
            color: "blue",
          },
          {
            label: "Open",
            value: tickets.filter((t) => t.status === "Opened").length,
            icon: <CheckCircle size={18} />,
            color: "emerald",
          },
          {
            label: "Closed",
            value: tickets.filter((t) => t.status === "Closed").length,
            icon: <AlertCircle size={18} />,
            color: "red",
          },
        ]}
      />

      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search tickets..."
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-56 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors ${showFilter ? "border-[#155b96] text-[#155b96] bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <Filter size={14} /> Filter
            </button>
            <ColumnToggle
              columns={TICKET_COLS}
              visible={visibleCols}
              onChange={setVisibleCols}
            />
          </div>
        </div>
        {showFilter && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
              <span className="font-medium">Status:</span>
              <select
                value={filterTicketStatus}
                onChange={(e) => {
                  setFilterTicketStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                <option value="Opened">Opened</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            {filterTicketStatus !== "" && (
              <button
                onClick={() => setFilterTicketStatus("")}
                className="text-[12px] text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {tickets.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="pl-5 pr-2 py-1.5 w-10 text-center">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </th>
                <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                {visibleCols["subject_person"] !== false && (
                  <th className="px-5 py-1.5">
                    <button
                      onClick={() => handleSort("subject_person")}
                      className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                    >
                      SUBJECT PERSON {sortIcon("subject_person")}
                    </button>
                  </th>
                )}
                {visibleCols["no_ticket"] !== false && (
                  <th className="px-5 py-1.5">
                    <button
                      onClick={() => handleSort("no_ticket")}
                      className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                    >
                      NO TICKET {sortIcon("no_ticket")}
                    </button>
                  </th>
                )}
                {visibleCols["subject"] !== false && (
                  <th className="px-5 py-1.5">
                    <button
                      onClick={() => handleSort("subject")}
                      className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                    >
                      SUBJECT {sortIcon("subject")}
                    </button>
                  </th>
                )}
                {visibleCols["status"] !== false && (
                  <th className="px-5 py-1.5">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                    >
                      STATUS {sortIcon("status")}
                    </button>
                  </th>
                )}
                {visibleCols["last_update"] !== false && (
                  <th className="px-5 py-1.5">
                    <button
                      onClick={() => handleSort("last_update")}
                      className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                    >
                      LAST UPDATE {sortIcon("last_update")}
                    </button>
                  </th>
                )}
                <th className="px-5 py-1.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="pl-5 pr-2 py-3.5 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                      />
                    </td>
                    <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-100">
                      {startIndex + index + 1}
                    </td>
                    {visibleCols["subject_person"] !== false && (
                      <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                        {ticket.subject_person}
                      </td>
                    )}
                    {visibleCols["no_ticket"] !== false && (
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                        {ticket.no_ticket}
                      </td>
                    )}
                    {visibleCols["subject"] !== false && (
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-100">
                        {ticket.subject}
                      </td>
                    )}
                    {visibleCols["status"] !== false && (
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            ticket.status === "Opened"
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                              : ticket.status === "On Hold"
                                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                                : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ticket.status === "Opened"
                                ? "bg-emerald-500"
                                : ticket.status === "On Hold"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          ></span>
                          {ticket.status}
                        </span>
                      </td>
                    )}
                    {visibleCols["last_update"] !== false && (
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 text-[12px]">
                        {ticket.last_update}
                      </td>
                    )}
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-1">
                        <ActionButton variant="view" label="View">
                          <Search size={15} />
                        </ActionButton>
                        <ActionButton variant="edit" label="Edit">
                          <Edit size={15} />
                        </ActionButton>
                        <ActionButton variant="delete" label="Delete">
                          <Trash2 size={15} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <PaginationControls
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        startItem={startItem}
        endItem={endItem}
        totalItems={filteredTickets.length}
        itemLabel="entries"
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Open New Ticket"
        maxWidth="lg"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("New ticket:", {
              issuedTo,
              subject,
              message,
              attachments,
            });
            setIsModalOpen(false);
            resetForm();
          }}
        >
          {/* Issued To */}
          <div>
            <FormLabel label="Issued To" required />
            <div className="relative">
              <select
                required
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
                className={inputClasses + " appearance-none pr-9"}
              >
                <option value="" disabled>
                  Select Subject Person
                </option>
                <option>Budi Susanto</option>
                <option>Siti Rahayu</option>
                <option>Administrator</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Subject */}
          <div>
            <FormLabel label="Subject" required />
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="contoh: Pembayaran"
              className={inputClasses}
            />
          </div>

          {/* Message / Description */}
          <div>
            <FormLabel label="Message / Description" required />
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="contoh: Saya telah melakukan pembayaran namun internet belum kunjung up juga"
              className={inputClasses + " resize-y"}
            />
          </div>

          {/* Attachments */}
          <div>
            <FormLabel label="Attachments (Optional)" />
            <p className="text-[12px] text-red-500 mb-2">
              (Max 3 attachment &amp; 1 Mb / files)
            </p>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-sm bg-white dark:bg-slate-800">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="shrink-0 px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-medium border-r border-slate-200 dark:border-slate-600 transition-colors text-[13px]"
              >
                Choose Files
              </button>
              <span className="px-3.5 text-slate-400 dark:text-slate-100 text-[13px]">
                {attachments.length === 0
                  ? "No file chosen"
                  : attachments.map((f) => f.name).join(", ")}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []).slice(0, 3);
                setAttachments(files);
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <Save size={15} /> Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

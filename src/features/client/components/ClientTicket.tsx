import { useState, useRef } from "react";
import { Plus, Search, Save } from "lucide-react";
import { MOCK_CLIENT_TICKETS } from "../../router/constants";
import EmptyState from "../../../components/EmptyState";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import PaginationControls from "../../../components/PaginationControls";

export default function ClientTicket() {
  const tickets = MOCK_CLIENT_TICKETS;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setAttachments([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const limitToday = 0;
  const maxLimit = 3;

  const filtered = tickets.filter(
    (t) =>
      searchTerm === "" ||
      t.noTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedTickets = filtered.slice(startIndex, startIndex + pageSize);
  const startItem = filtered.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, filtered.length);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-800 dark:text-slate-100">
            Limit Today:{" "}
            <span className="text-[#155b96] dark:text-blue-400">
              {limitToday}/{maxLimit}
            </span>
          </h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Open New Ticket
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-56 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <EmptyState
            title="Belum ada ticket"
            message="Anda belum membuat ticket support apapun."
          />
        ) : (
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="pl-5 pr-2 py-1.5 w-10 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                </th>
                <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                <th className="px-5 py-1.5">NO TICKET</th>
                <th className="px-5 py-1.5">SUBJECT</th>
                <th className="px-5 py-1.5 text-center">STATUS</th>
                <th className="px-5 py-1.5">LAST UPDATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedTickets.map((t, i) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="pl-5 pr-2 py-3.5 text-center">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                    />
                  </td>
                  <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {startIndex + i + 1}
                  </td>
                  <td className="px-5 py-3.5 text-[#155b96] dark:text-blue-400 font-semibold">
                    {t.noTicket}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-100">
                    {t.subject}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          t.status === "Opened"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                            : t.status === "On Hold"
                              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                              : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.status === "Opened"
                              ? "bg-emerald-500"
                              : t.status === "On Hold"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        ></span>
                        {t.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 text-[12px] tabular-nums">
                    {t.lastUpdate}
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
        totalItems={filtered.length}
        itemLabel="entries"
        onPageChange={setCurrentPage}
      />

      {/* Modal: Open New Ticket */}
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
            console.log("Client ticket:", { subject, message, attachments });
            setIsModalOpen(false);
            resetForm();
          }}
        >
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
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
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

          {/* Submit */}
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

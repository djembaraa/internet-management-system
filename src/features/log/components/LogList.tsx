import { useState, useEffect } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronDown,
  ChevronUp,
  Activity,
  Monitor,
  Server,
} from "lucide-react";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import { supabase } from "../../../services/supabase";
import Modal from "../../../components/Modal";
import EmptyState from "../../../components/EmptyState";
import PaginationControls from "../../../components/PaginationControls";

const LOG_COLS: ColDef[] = [
  { key: "description", label: "Description" },
  { key: "topics", label: "Topics" },
  { key: "timestamp", label: "Timestamp" },
  { key: "action", label: "Action", fixed: true },
];

const DEFAULT_DETAIL = {
  before: { data: "(no previous state)" },
  after: { data: "(no changes recorded)" },
  browser: {
    ip: "–",
    userAgent: "–",
    execStart: "–",
    execEnd: "–",
    execTime: "–",
  },
};

function TerminalBlock({ data }: { data: Record<string, string> }) {
  const entries = Object.entries(data);
  const keyWidth = Math.max(...entries.map(([k]) => k.length));
  return (
    <div className="bg-slate-900 dark:bg-[#0f172a] rounded-xl px-4 py-3.5 font-mono text-[12px] leading-relaxed shadow-inner border border-slate-800">
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-2.5">
          <span
            className="text-slate-500 shrink-0"
            style={{ minWidth: keyWidth + "ch" }}
          >
            {k}
          </span>
          <span className="text-slate-600 shrink-0">:</span>
          <span className="text-emerald-400 break-all">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function LogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setLogs(data.map(l => ({
          ...l,
          timestamp: new Date(l.created_at).toLocaleString()
        })));
      }
    }
    fetchLogs();
  }, []);
  const [visibleCols, setVisibleCols] = useState(() => initVisible(LOG_COLS));

  // Mobile expand
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterTopics, setFilterTopics] = useState("");

  type SortKey = "description" | "topics" | "timestamp";
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

  const filtered = logs.filter(
    (l) =>
      (searchTerm === "" ||
        l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.topics.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterTopics === "" || l.topics.toLowerCase().includes(filterTopics)),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;
    const av = String(a[sortBy]).toLowerCase();
    const bv = String(b[sortBy]).toLowerCase();
    return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedLogs = sorted.slice(startIndex, startIndex + pageSize);
  const startItem = sorted.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, sorted.length);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
        <div>
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            System Logs
          </h2>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau aktivitas dan riwayat perubahan sistem
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search logs..."
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors shrink-0 ${showFilter ? "border-[#155b96] text-[#155b96] bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <Filter size={14} /> Filter
            </button>
            <ColumnToggle
              columns={LOG_COLS}
              visible={visibleCols}
              onChange={setVisibleCols}
            />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-100 w-full sm:w-auto">
              <span className="font-semibold uppercase tracking-wider text-slate-400">
                Category:
              </span>
              <select
                value={filterTopics}
                onChange={(e) => {
                  setFilterTopics(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] text-[13px] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-100 flex-1 sm:flex-none"
              >
                <option value="">All Topics</option>
                <option value="invoice">Invoice</option>
                <option value="payment">Payment</option>
                <option value="router">Router</option>
                <option value="hotspot">Hotspot</option>
                <option value="add">Add Data</option>
                <option value="edit">Edit Data</option>
                <option value="delete">Delete Data</option>
              </select>
            </div>
            {filterTopics !== "" && (
              <button
                onClick={() => setFilterTopics("")}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100 transition-colors font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden px-4 pb-4 flex flex-col gap-2 pt-2">
        {sorted.length === 0 ? (
          <EmptyState title="Data Kosong" message="Tidak ada log ditemukan." />
        ) : (
          paginatedLogs.map((log, index) => {
            const isExpanded = expandedMobileId === log.id;
            return (
              <div
                key={log.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900"
              >
                <button
                  onClick={() =>
                    setExpandedMobileId(isExpanded ? null : log.id)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-4 shrink-0 tabular-nums">
                    {startIndex + index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate block">
                      {log.description}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums block mt-0.5">
                      {log.timestamp}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp
                      size={16}
                      className="text-slate-400 dark:text-slate-500 shrink-0 ml-1"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-slate-400 dark:text-slate-500 shrink-0 ml-1"
                    />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                        Topics
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {log.topics.split(",").map((t: string) => (
                          <span
                            key={t}
                            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold text-[#155b96] dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Search size={14} /> View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table */}
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
              {/* JARAK NO DAN DESCRIPTION DIRAPATKAN DISINI */}
              <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
              {visibleCols["description"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("description")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    DESCRIPTION {sortIcon("description")}
                  </button>
                </th>
              )}
              {visibleCols["topics"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("topics")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    TOPICS {sortIcon("topics")}
                  </button>
                </th>
              )}
              {visibleCols["timestamp"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("timestamp")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    TIMESTAMP {sortIcon("timestamp")}
                  </button>
                </th>
              )}
              <th className="px-5 py-1.5 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="Data Kosong"
                    message="Tidak ada log ditemukan."
                  />
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                >
                  <td className="pl-5 pr-2 py-3.5">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                    />
                  </td>
                  {/* JARAK NO DAN DESCRIPTION DIRAPATKAN DISINI */}
                  <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                    {startIndex + index + 1}
                  </td>
                  {visibleCols["description"] !== false && (
                    <td
                      className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100 truncate max-w-xs"
                      title={log.description}
                    >
                      {log.description}
                    </td>
                  )}
                  {visibleCols["topics"] !== false && (
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {log.topics.split(",").map((t: string) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  {visibleCols["timestamp"] !== false && (
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-[12px] tabular-nums font-medium">
                      {log.timestamp}
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-center">
                      <button
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-[#155b96] dark:bg-blue-900/30 dark:text-blue-400 transition-colors flex items-center gap-1.5"
                        title="View Detail"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Search size={14} /> Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
        totalItems={sorted.length}
        itemLabel="entries"
        onPageChange={setCurrentPage}
      />

      {/* ─── Log Detail Modal ─── */}
      {selectedLog &&
        (() => {
          const detail = {
            before: selectedLog.data_before || DEFAULT_DETAIL.before,
            after: selectedLog.data_after || DEFAULT_DETAIL.after,
            browser: selectedLog.browser || DEFAULT_DETAIL.browser,
          };
          return (
            <Modal
              isOpen={!!selectedLog}
              onClose={() => setSelectedLog(null)}
              title="Log Execution Details"
              maxWidth="2xl"
            >
              <div className="space-y-6">
                {/* Summary Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity
                      size={16}
                      className="text-[#155b96] dark:text-blue-400"
                    />
                    <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                      Execution Summary
                    </h3>
                  </div>
                  <TerminalBlock
                    data={{
                      Topics: selectedLog.topics,
                      Messages: selectedLog.description,
                      Timestamp: selectedLog.timestamp,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Condition Before */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Server size={16} className="text-amber-500" />
                      <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                        State Before Action
                      </h3>
                    </div>
                    <TerminalBlock data={detail.before} />
                  </div>

                  {/* Condition After */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Server size={16} className="text-emerald-500" />
                      <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                        State After Action
                      </h3>
                    </div>
                    <TerminalBlock data={detail.after} />
                  </div>
                </div>

                {/* Browser Detail */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Monitor
                      size={16}
                      className="text-purple-500 dark:text-purple-400"
                    />
                    <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                      Client / Browser Meta
                    </h3>
                  </div>
                  <div className="bg-slate-900 dark:bg-[#0f172a] rounded-xl px-4 py-4 font-mono text-[12px] leading-relaxed shadow-inner border border-slate-800 space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-slate-500 shrink-0 min-w-[14ch]">
                        IP Address
                      </span>
                      <span className="text-slate-600 shrink-0">:</span>
                      <span className="text-emerald-400">
                        {detail.browser.ip}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-500 shrink-0 min-w-[14ch]">
                        User Agent
                      </span>
                      <span className="text-slate-600 shrink-0">:</span>
                      <span className="text-emerald-400 break-all">
                        {detail.browser.userAgent}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 gap-1.5">
                      <div className="flex gap-2">
                        <span className="text-slate-500 shrink-0 min-w-[14ch]">
                          Execution Start
                        </span>
                        <span className="text-slate-600 shrink-0">:</span>
                        <span className="text-amber-400">
                          {detail.browser.execStart}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 shrink-0 min-w-[14ch]">
                          Execution End
                        </span>
                        <span className="text-slate-600 shrink-0">:</span>
                        <span className="text-amber-400">
                          {detail.browser.execEnd}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 shrink-0 min-w-[14ch]">
                          Total Time
                        </span>
                        <span className="text-slate-600 shrink-0">:</span>
                        <span className="text-amber-400 font-bold">
                          {detail.browser.execTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </Modal>
          );
        })()}
    </div>
  );
}

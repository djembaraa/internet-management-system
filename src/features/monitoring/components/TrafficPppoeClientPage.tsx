import { useState, useEffect } from "react";
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "../../../services/supabase";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import PaginationControls from "../../../components/PaginationControls";

const TRAFFIC_COLS: ColDef[] = [
  { key: "username", label: "Username" },
  { key: "ip", label: "IP Address" },
  { key: "upload", label: "Upload" },
  { key: "download", label: "Download" },
  { key: "uptime", label: "Uptime" },
  { key: "profile", label: "Profile" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", fixed: true },
];

export default function TrafficPppoeClientPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(TRAFFIC_COLS),
  );

  const [trafficData, setTrafficData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('pppoe_clients').select(`
        *,
        pppoe_profiles ( name )
      `);
      if (!error && data) {
        setTrafficData(data.map(d => ({
          id: d.id,
          username: d.fullname,
          ip: d.ip || "-",
          upload: "0.0 Mbps",
          download: "0.0 Mbps",
          uptime: "0m",
          profile: d.pppoe_profiles?.name || "-",
          status: d.status
        })));
      }
    }
    fetchData();
  }, []);

  const filtered = trafficData.filter(
    (t) =>
      searchTerm === "" ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ip.includes(searchTerm),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedTraffic = filtered.slice(startIndex, startIndex + pageSize);
  const startItem = filtered.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, filtered.length);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          Traffic PPPoE Client
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-100 mt-0.5">
          Pantau traffic upload/download client PPPoE aktif secara real-time.
        </p>
      </div>

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
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari username atau IP..."
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-56 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
        />
        <ColumnToggle
          columns={TRAFFIC_COLS}
          visible={visibleCols}
          onChange={setVisibleCols}
        />
      </div>

      <div className="overflow-x-auto">
        {/* Mobile Cards */}
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-center text-[13px] text-slate-400 py-6">
              Tidak ada data ditemukan.
            </p>
          ) : (
            paginatedTraffic.map((t, index) => {
              const isExpanded = expandedId === t.id;
              return (
                <div
                  key={t.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : t.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-[11px] text-slate-400 dark:text-slate-100 w-5 shrink-0 tabular-nums">
                      {startIndex + index + 1}
                    </span>
                    <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate min-w-0 w-[7ch]">
                      {t.username}
                    </span>
                    <span className="flex-1" />
                    <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium text-[9px] tabular-nums shrink-0">
                      <ArrowUp size={8} /> {t.upload}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium text-[9px] tabular-nums shrink-0">
                      <ArrowDown size={8} /> {t.download}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        size={15}
                        className="text-slate-400 dark:text-slate-100 shrink-0"
                      />
                    ) : (
                      <ChevronDown
                        size={15}
                        className="text-slate-400 dark:text-slate-100 shrink-0"
                      />
                    )}
                  </button>
                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 grid grid-cols-2 gap-x-4 gap-y-3">
                      {/* Username header */}
                      <div className="col-span-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                          Username
                        </p>
                        <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                          {t.username}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                          IP Address
                        </p>
                        <p className="text-[12px] font-mono text-slate-500 dark:text-slate-100">
                          {t.ip}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                          Uptime
                        </p>
                        <p className="text-[12px] text-slate-600 dark:text-slate-100 tabular-nums">
                          {t.uptime}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                          Profile
                        </p>
                        <p className="text-[12px] text-[#155b96] dark:text-blue-400 font-medium">
                          {t.profile}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-1">
                          Upload
                        </p>
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[12px] tabular-nums">
                          <ArrowUp size={11} /> {t.upload}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-1">
                          Download
                        </p>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[12px] tabular-nums">
                          <ArrowDown size={11} /> {t.download}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            t.status === "Active"
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${t.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}
                          ></span>
                          {t.status}
                        </span>
                      </div>
                      <div className="flex items-end">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#155b96] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          title="Detail"
                        >
                          <Search size={13} /> Detail
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
        <table className="hidden md:table w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="pl-5 pr-2 py-1.5 w-8 text-center">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                />
              </th>
              <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
              {visibleCols["username"] !== false && (
                <th className="px-4 py-1.5">USERNAME</th>
              )}
              {visibleCols["ip"] !== false && (
                <th className="px-4 py-1.5">IP ADDRESS</th>
              )}
              {visibleCols["upload"] !== false && (
                <th className="px-4 py-1.5">UPLOAD</th>
              )}
              {visibleCols["download"] !== false && (
                <th className="px-4 py-1.5">DOWNLOAD</th>
              )}
              {visibleCols["uptime"] !== false && (
                <th className="px-4 py-1.5">UPTIME</th>
              )}
              {visibleCols["profile"] !== false && (
                <th className="px-4 py-1.5">PROFILE</th>
              )}
              {visibleCols["status"] !== false && (
                <th className="px-4 py-1.5 text-center">STATUS</th>
              )}
              <th className="px-4 py-1.5 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedTraffic.map((t, index) => (
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
                  {startIndex + index + 1}
                </td>
                {visibleCols["username"] !== false && (
                  <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                    {t.username}
                  </td>
                )}
                {visibleCols["ip"] !== false && (
                  <td className="px-4 py-3.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                    {t.ip}
                  </td>
                )}
                {visibleCols["upload"] !== false && (
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium tabular-nums">
                      <ArrowUp size={13} /> {t.upload}
                    </span>
                  </td>
                )}
                {visibleCols["download"] !== false && (
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                      <ArrowDown size={13} /> {t.download}
                    </span>
                  </td>
                )}
                {visibleCols["uptime"] !== false && (
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                    {t.uptime}
                  </td>
                )}
                {visibleCols["profile"] !== false && (
                  <td className="px-4 py-3.5 text-[#155b96] dark:text-blue-400 font-medium">
                    {t.profile}
                  </td>
                )}
                {visibleCols["status"] !== false && (
                  <td className="px-4 py-3.5">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          t.status === "Active"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        ></span>
                        {t.status}
                      </span>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3.5 flex justify-center">
                  <button
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#155b96] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Detail"
                  >
                    <Search size={15} />
                  </button>
                </td>
              </tr>
            ))}
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
  );
}

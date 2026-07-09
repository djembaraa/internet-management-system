import { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  RefreshCw,
  Info,
  Save,
  Trash,
  CheckCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronDown,
  ChevronUp,
  XCircle,
  Clock,
} from "lucide-react";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import ActionButton from "../../../components/ActionButton";

const VOUCHER_COLS: ColDef[] = [
  { key: "username", label: "Username" },
  { key: "password", label: "Password" },
  { key: "profile", label: "Profile" },
  { key: "masaBerlaku", label: "Masa Berlaku" },
  { key: "status", label: "Status" },
  { key: "macAddress", label: "MAC Address" },
  { key: "action", label: "Action", fixed: true },
];
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import SummaryStats from "../../../components/SummaryStats";
import {
  MOCK_VOUCHER_ITEMS as MOCK_VOUCHERS,
  type VoucherItem as Voucher,
} from "../constants";

export default function HotspotVoucherList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(VOUCHER_COLS),
  );

  // Generate modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [genJumlah, setGenJumlah] = useState("");
  const [genProfile, setGenProfile] = useState("");
  const [genMode, setGenMode] = useState("Username Only");
  const [genLength, setGenLength] = useState("4");
  const [genKomposisi, setGenKomposisi] = useState("Alphabet only");
  const [genPrefix, setGenPrefix] = useState("");
  const [genPrint, setGenPrint] = useState(false);

  // Info modal
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoVoucher, setInfoVoucher] = useState<Voucher | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteVoucher, setDeleteVoucher] = useState<Voucher | null>(null);

  // Refresh state: "idle" | "loading" | "success"
  const [refreshState, setRefreshState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  // Mobile expand
  const [expandedMobileId, setExpandedMobileId] = useState<number | null>(null);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterVoucherStatus, setFilterVoucherStatus] = useState("");
  const [filterVoucherProfile, setFilterVoucherProfile] = useState("");

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none";

  const filtered = MOCK_VOUCHERS.filter(
    (v) =>
      (searchTerm === "" ||
        v.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterVoucherStatus === "" || v.status === filterVoucherStatus) &&
      (filterVoucherProfile === "" || v.profile === filterVoucherProfile),
  );

  type SortKey = "username" | "profile" | "masaBerlaku" | "status";
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
  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;
    const av = String(a[sortBy]).toLowerCase();
    const bv = String(b[sortBy]).toLowerCase();
    return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const handleRefresh = useCallback(() => {
    setRefreshState("loading");
    setTimeout(() => {
      setRefreshState("success");
      setTimeout(() => setRefreshState("idle"), 1500);
    }, 1200);
  }, []);

  const handleInfoClick = (voucher: Voucher) => {
    setInfoVoucher(voucher);
    setInfoModalOpen(true);
  };

  const handleDeleteClick = (voucher: Voucher) => {
    setDeleteVoucher(voucher);
    setDeleteModalOpen(true);
  };

  const resetGenerateForm = () => {
    setGenJumlah("");
    setGenProfile("");
    setGenMode("Username Only");
    setGenLength("4");
    setGenKomposisi("Alphabet only");
    setGenPrefix("");
    setGenPrint(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header — Gestalt: proximity groups title with actions */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          List Hotspot Voucher
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshState !== "idle"}
            className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] disabled:opacity-70 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
          >
            <RefreshCw
              size={15}
              className={refreshState === "loading" ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            onClick={() => setGenerateModalOpen(true)}
            className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
          >
            <Plus size={16} /> Generate
          </button>
        </div>
      </div>

      <SummaryStats
        items={[
          {
            label: "Available",
            value: MOCK_VOUCHERS.filter((v) => v.status === "Available").length,
            icon: <CheckCircle size={18} />,
            color: "emerald",
          },
          {
            label: "In Use",
            value: MOCK_VOUCHERS.filter((v) => v.status === "Used").length,
            icon: <Clock size={18} />,
            color: "amber",
          },
          {
            label: "Expired",
            value: MOCK_VOUCHERS.filter((v) => v.status === "Expired").length,
            icon: <XCircle size={18} />,
            color: "red",
          },
        ]}
      />

      {/* Limit + Clear Expired — Gestalt: similarity + proximity */}
      <div className="px-5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Limit: <span className="text-[#155b96]">{filtered.length}</span> /
          9999999999
        </p>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors">
          <Trash size={14} /> Clear Expired Voucher
        </button>
      </div>

      {/* Toolbar — Gestalt: common region */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
            <select className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries per page</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-48 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors ${showFilter ? "border-[#155b96] text-[#155b96] bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <Filter size={14} /> Filter
            </button>
            <ColumnToggle
              columns={VOUCHER_COLS}
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
                value={filterVoucherStatus}
                onChange={(e) => setFilterVoucherStatus(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                <option value="Available">Available</option>
                <option value="Used">Used</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
              <span className="font-medium">Profile:</span>
              <select
                value={filterVoucherProfile}
                onChange={(e) => setFilterVoucherProfile(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                {[...new Set(MOCK_VOUCHERS.map((v) => v.profile))].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            {(filterVoucherStatus !== "" || filterVoucherProfile !== "") && (
              <button
                onClick={() => {
                  setFilterVoucherStatus("");
                  setFilterVoucherProfile("");
                }}
                className="text-[12px] text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No data</p>
        ) : (
          sorted.map((voucher, index) => {
            const isExpanded = expandedMobileId === voucher.id;
            const statusLabel =
              voucher.status === "Available"
                ? "Available"
                : voucher.status === "Used"
                  ? "In Use"
                  : voucher.status;
            const statusClass =
              voucher.status === "Available"
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                : voucher.status === "Used"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                  : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
            const dotClass =
              voucher.status === "Available"
                ? "bg-emerald-500"
                : voucher.status === "Used"
                  ? "bg-amber-500"
                  : "bg-red-500";
            return (
              <div
                key={voucher.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Summary Row */}
                <button
                  onClick={() =>
                    setExpandedMobileId(isExpanded ? null : voucher.id)
                  }
                  className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-[11px] text-slate-400 dark:text-slate-100 w-5 shrink-0 tabular-nums">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate min-w-0">
                    {voucher.username}
                  </span>
                  <span className="flex-1" />
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusClass}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${dotClass}`}
                    ></span>
                    {statusLabel}
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
                    <div className="col-span-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Username
                      </p>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                        {voucher.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Password
                      </p>
                      <p className="text-[12px] font-mono text-slate-500 dark:text-slate-100">
                        {voucher.password || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Profile
                      </p>
                      <p className="text-[12px] text-[#155b96] dark:text-blue-400 font-medium">
                        {voucher.profile}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Masa Berlaku
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-100">
                        {voucher.masaBerlaku}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${dotClass}`}
                        ></span>
                        {statusLabel}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        MAC Address
                      </p>
                      <p className="text-[12px] font-mono text-slate-500 dark:text-slate-100">
                        {voucher.macAddress || "-"}
                      </p>
                    </div>
                    <div className="col-span-2 pt-1 flex gap-1">
                      <button
                        onClick={() => handleInfoClick(voucher)}
                        className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#155b96] hover:bg-[#0e4a7a] text-white transition-colors flex items-center gap-1"
                      >
                        <Info size={12} /> Info
                      </button>
                      <button
                        onClick={() => handleDeleteClick(voucher)}
                        className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Table (desktop only) — Gestalt: continuity via consistent row structure */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="pl-5 pr-2 py-1.5 w-10">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                />
              </th>
              <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
              {visibleCols["username"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("username")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    USERNAME {sortIcon("username")}
                  </button>
                </th>
              )}
              {visibleCols["password"] !== false && (
                <th className="px-5 py-1.5">PASSWORD</th>
              )}
              {visibleCols["profile"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("profile")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    PROFILE {sortIcon("profile")}
                  </button>
                </th>
              )}
              {visibleCols["masaBerlaku"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("masaBerlaku")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    MASA BERLAKU {sortIcon("masaBerlaku")}
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
              {visibleCols["macAddress"] !== false && (
                <th className="px-5 py-1.5">MAC ADDRESS</th>
              )}
              <th className="px-5 py-1.5 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.map((voucher, index) => (
              <tr
                key={voucher.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="pl-5 pr-2 py-3.5">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </td>
                <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-100">
                  {index + 1}
                </td>
                {visibleCols["username"] !== false && (
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                    {voucher.username}
                  </td>
                )}
                {visibleCols["password"] !== false && (
                  <td className="px-5 py-3.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                    {voucher.password || ""}
                  </td>
                )}
                {visibleCols["profile"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {voucher.profile}
                  </td>
                )}
                {visibleCols["masaBerlaku"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {voucher.masaBerlaku}
                  </td>
                )}
                {visibleCols["status"] !== false && (
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        voucher.status === "Available"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                          : voucher.status === "Used"
                            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                            : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          voucher.status === "Available"
                            ? "bg-emerald-500"
                            : voucher.status === "Used"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {voucher.status === "Available"
                        ? "Available"
                        : voucher.status === "Used"
                          ? "In Use"
                          : voucher.status}
                    </span>
                  </td>
                )}
                {visibleCols["macAddress"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {voucher.macAddress || ""}
                  </td>
                )}
                <td className="px-5 py-3.5">
                  <div className="flex justify-center gap-1">
                    <ActionButton
                      variant="info"
                      label="Info"
                      onClick={() => handleInfoClick(voucher)}
                    >
                      <Info size={12} />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      label="Delete"
                      onClick={() => handleDeleteClick(voucher)}
                    >
                      <Trash2 size={12} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-slate-500 dark:text-slate-100">
        <div>
          Showing <span className="text-[#155b96] font-medium">1</span> to{" "}
          <span className="text-[#155b96] font-medium">{filtered.length}</span>{" "}
          of {filtered.length} entry
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

      {/* ─── Refresh Loading / Success Overlay ─── */}
      {refreshState !== "idle" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-8 flex flex-col items-center gap-4 min-w-[280px] animate-in fade-in zoom-in-95">
            {refreshState === "loading" ? (
              <>
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <Loader2 size={28} className="text-[#155b96] animate-spin" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                  Memuat data voucher...
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Data berhasil diperbarui!
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Generate New Voucher Modal (Screenshot 2) ─── */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => {
          setGenerateModalOpen(false);
          resetGenerateForm();
        }}
        title="Generate New Voucher"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Generate vouchers:", {
              genJumlah,
              genProfile,
              genMode,
              genLength,
              genKomposisi,
              genPrefix,
              genPrint,
            });
            setGenerateModalOpen(false);
            resetGenerateForm();
          }}
        >
          <div>
            <FormLabel label="Jumlah Voucher" required />
            <div className="flex items-center gap-1.5 mb-1.5">
              <Info
                size={13}
                className="text-red-500 dark:text-red-400 shrink-0"
              />
              <p className="text-[12px] text-red-500 dark:text-red-400 font-medium">
                Max 500 Voucher / Generate
              </p>
            </div>
            <input
              type="number"
              required
              min={1}
              max={500}
              value={genJumlah}
              onChange={(e) => setGenJumlah(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <FormLabel label="Profile" required />
            <select
              value={genProfile}
              onChange={(e) => setGenProfile(e.target.value)}
              className={selectClasses}
            >
              <option value="">Pilih Profile</option>
              <option value="asd">asd</option>
              <option value="Voucher 2 Jam">Voucher 2 Jam</option>
              <option value="Voucher 1 Hari">Voucher 1 Hari</option>
              <option value="Voucher 1 Minggu">Voucher 1 Minggu</option>
            </select>
          </div>

          <div>
            <FormLabel label="Mode Akun" required />
            <select
              value={genMode}
              onChange={(e) => setGenMode(e.target.value)}
              className={selectClasses}
            >
              <option>Username Only</option>
              <option>Username &amp; Password</option>
            </select>
          </div>

          <div>
            <FormLabel label="Panjang Kode Voucher" required />
            <select
              value={genLength}
              onChange={(e) => setGenLength(e.target.value)}
              className={selectClasses}
            >
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
            </select>
          </div>

          <div>
            <FormLabel label="Komposisi Voucher" required />
            <select
              value={genKomposisi}
              onChange={(e) => setGenKomposisi(e.target.value)}
              className={selectClasses}
            >
              <option>Alphabet only</option>
              <option>Number only</option>
              <option>Alphabet &amp; Number</option>
            </select>
          </div>

          <div>
            <FormLabel label="Prefix (optional)" />
            <input
              type="text"
              value={genPrefix}
              onChange={(e) => setGenPrefix(e.target.value)}
              placeholder="IND"
              className={inputClasses}
            />
          </div>

          {/* Print Voucher toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={genPrint}
              onClick={() => setGenPrint(!genPrint)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#155b96]/20 ${
                genPrint ? "bg-[#155b96]" : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  genPrint ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-100">
              Print Voucher
            </span>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              <Save size={16} /> Generate
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Detail Voucher Info Modal (Screenshot 3) ─── */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => {
          setInfoModalOpen(false);
          setInfoVoucher(null);
        }}
        title="Detail Voucher Info"
      >
        {infoVoucher && (
          <div className="space-y-3.5">
            {/* Gestalt: proximity groups related label-value pairs */}
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Username:
              </span>
              <span className="text-sm text-slate-800 dark:text-slate-100 font-medium">
                {infoVoucher.username}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Profile:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-100">
                {infoVoucher.profile}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Status:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                  infoVoucher.status === "Available"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                    : infoVoucher.status === "Used"
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    infoVoucher.status === "Available"
                      ? "bg-emerald-500"
                      : infoVoucher.status === "Used"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                ></span>
                {infoVoucher.status === "Available"
                  ? "Available"
                  : infoVoucher.status === "Used"
                    ? "In Use"
                    : infoVoucher.status}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Mac Address:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-100">
                {infoVoucher.macAddress || "-"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Brand:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-100">
                {infoVoucher.brand || "-"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Sisa Masa Aktif:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-100">
                {infoVoucher.masaBerlaku}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100 min-w-[140px]">
                Total Penggunaan:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-100">
                {infoVoucher.totalUsage}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteVoucher(null);
        }}
        onConfirm={() => {
          console.log("Delete voucher:", deleteVoucher?.id);
          setDeleteVoucher(null);
        }}
        itemCount={1}
      />
    </div>
  );
}

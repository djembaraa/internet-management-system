import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  Info,
  Save,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "../../../services/supabase";
import EmptyState from "../../../components/EmptyState";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import PaginationControls from "../../../components/PaginationControls";
import SummaryStats from "../../../components/SummaryStats";

const ONU_COLS: ColDef[] = [
  { key: "name", label: "Name" },
  { key: "distance", label: "Distance" },
  { key: "rxPower", label: "RX Power" },
  { key: "olt", label: "OLT" },
  { key: "macSn", label: "MAC / SN" },
  { key: "lastSeen", label: "Last Seen" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", fixed: true },
];

const OLT_COLS: ColDef[] = [
  { key: "name", label: "Label" },
  { key: "ip", label: "Address" },
  { key: "port", label: "SNMP Port" },
  { key: "community", label: "SNMP Community" },
  { key: "uptime", label: "Last Seen" },
];

const OLT_MODELS = [
  "HSGQ (E04, E04R, E04I)",
  "ZTE C300",
  "ZTE C600",
  "Huawei MA5800",
  "Huawei MA5600",
  "Nokia 7360",
];

interface OltFormData {
  label: string;
  model: string;
  address: string;
  snmpPort: string;
  snmpCommunity: string;
}

const defaultForm: OltFormData = {
  label: "",
  model: "HSGQ (E04, E04R, E04I)",
  address: "",
  snmpPort: "161",
  snmpCommunity: "public",
};

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<"ONU" | "OLT">("ONU");
  const [filterOlt, setFilterOlt] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleOnuCols, setVisibleOnuCols] = useState(() =>
    initVisible(ONU_COLS),
  );
  const [visibleOltCols, setVisibleOltCols] = useState(() =>
    initVisible(OLT_COLS),
  );

  const [onus, setOnus] = useState<any[]>([]);
  const [olts, setOlts] = useState<any[]>([]);

  const fetchData = async () => {
    const { data: oltData } = await supabase.from('olts').select('*').order('created_at', { ascending: false });
    if (oltData) setOlts(oltData);

    const { data: onuData } = await supabase.from('onus').select('*, olts(name)').order('created_at', { ascending: false });
    if (onuData) {
      setOnus(onuData.map(o => ({
        ...o,
        olt: o.olts?.name || '-',
        macSn: o.mac_sn,
        rxPower: o.rx_power,
        lastSeen: o.last_seen ? new Date(o.last_seen).toLocaleString() : '-'
      })));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterOnuStatus, setFilterOnuStatus] = useState("");
  const [filterOltStatus, setFilterOltStatus] = useState("");

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Edit form
  const [editSelectedOlt, setEditSelectedOlt] = useState("");
  const [editForm, setEditForm] = useState<OltFormData>({ ...defaultForm });

  // Delete
  const [deleteSelectedOlt, setDeleteSelectedOlt] = useState("");

  // Add form
  const [addForm, setAddForm] = useState<OltFormData>({ ...defaultForm });

  const openEdit = () => {
    setEditSelectedOlt("");
    setEditForm({ ...defaultForm });
    setShowEdit(true);
  };

  const openDelete = () => {
    setDeleteSelectedOlt("");
    setShowDelete(true);
  };

  const openAdd = () => {
    setAddForm({ ...defaultForm });
    setShowAdd(true);
  };

  // Sorting for ONU
  type OnuSortKey =
    | "name"
    | "distance"
    | "rxPower"
    | "olt"
    | "macSn"
    | "lastSeen"
    | "status";
  const [onuSortBy, setOnuSortBy] = useState<OnuSortKey | null>(null);
  const [onuSortOrder, setOnuSortOrder] = useState<"asc" | "desc">("asc");
  const handleOnuSort = (col: OnuSortKey) => {
    if (onuSortBy === col)
      setOnuSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setOnuSortBy(col);
      setOnuSortOrder("asc");
    }
  };
  const onuSortIcon = (col: OnuSortKey) =>
    onuSortBy !== col ? (
      <ArrowUpDown size={12} className="opacity-40" />
    ) : onuSortOrder === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );

  // Sorting for OLT
  type OltSortKey = "name" | "ip" | "port" | "uptime";
  const [oltSortBy, setOltSortBy] = useState<OltSortKey | null>(null);
  const [oltSortOrder, setOltSortOrder] = useState<"asc" | "desc">("asc");
  const handleOltSort = (col: OltSortKey) => {
    if (oltSortBy === col)
      setOltSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setOltSortBy(col);
      setOltSortOrder("asc");
    }
  };
  const oltSortIcon = (col: OltSortKey) =>
    oltSortBy !== col ? (
      <ArrowUpDown size={12} className="opacity-40" />
    ) : oltSortOrder === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );

  // Mobile expand states
  const [expandedOnuId, setExpandedOnuId] = useState<string | null>(null);
  const [expandedOltId, setExpandedOltId] = useState<string | null>(null);

  const handleEditOltSelect = (id: string) => {
    setEditSelectedOlt(id);
    const found = olts.find((o) => o.id === id);
    if (found) {
      setEditForm({
        label: found.name,
        model: "HSGQ (E04, E04R, E04I)",
        address: found.ip,
        snmpPort: String(found.port),
        snmpCommunity: "public",
      });
    } else {
      setEditForm({ ...defaultForm });
    }
  };

  const uniqueOlts = ["All", ...new Set(onus.map((o) => o.olt))];

  const filteredOnu = onus.filter((onu) => {
    const matchOlt = filterOlt === "All" || onu.olt === filterOlt;
    const matchSearch =
      searchTerm === "" ||
      onu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      onu.macSn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterOnuStatus === "" || onu.status === filterOnuStatus;
    return matchOlt && matchSearch && matchStatus;
  });

  const sortedOnu = [...filteredOnu].sort((a, b) => {
    if (!onuSortBy) return 0;
    const av = String(a[onuSortBy]).toLowerCase();
    const bv = String(b[onuSortBy]).toLowerCase();
    return onuSortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const filteredOlt = olts.filter(
    (olt) =>
      (searchTerm === "" ||
        olt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        olt.ip?.includes(searchTerm)) &&
      (filterOltStatus === "" || olt.status === filterOltStatus),
  );

  const sortedOlt = [...filteredOlt].sort((a, b) => {
    if (!oltSortBy) return 0;
    const av = String(a[oltSortBy]).toLowerCase();
    const bv = String(b[oltSortBy]).toLowerCase();
    return oltSortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const activeItems = activeTab === "ONU" ? sortedOnu : sortedOlt;
  const totalPages = Math.max(1, Math.ceil(activeItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedOnu = sortedOnu.slice(startIndex, startIndex + pageSize);
  const paginatedOlt = sortedOlt.slice(startIndex, startIndex + pageSize);
  const startItem = activeItems.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, activeItems.length);
  const totalOnu = onus.length;
  const onlineOnu = onus.filter(
    (onu) => onu.status === "Online",
  ).length;
  const warningOnu = onus.filter(
    (onu) => onu.status === "Warning",
  ).length;
  const offlineOnu = onus.filter(
    (onu) => onu.status === "Offline",
  ).length;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Tabs */}
        <div className="px-5 pt-4 flex items-center gap-6 border-b border-slate-100 dark:border-slate-800">
          {(["ONU", "OLT"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`pb-3 text-[13px] font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#155b96] text-[#155b96] dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-slate-400 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "ONU" && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <SummaryStats
              items={[
                {
                  label: "Total ONU",
                  value: totalOnu,
                  color: "blue",
                },
                {
                  label: "Online",
                  value: onlineOnu,
                  color: "emerald",
                },
                {
                  label: "Warning",
                  value: warningOnu,
                  color: "amber",
                },
                {
                  label: "Offline",
                  value: offlineOnu,
                  color: "red",
                },
              ]}
            />
          </div>
        )}

        {activeTab === "OLT" && (
          <div className="px-5 pt-4 flex justify-end gap-2">
            <button
              onClick={openEdit}
              className="px-3 py-1.5 rounded text-[12px] font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5"
            >
              <Edit size={13} /> Edit
            </button>
            <button
              onClick={openDelete}
              className="px-3 py-1.5 rounded text-[12px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Delete
            </button>
            <button
              onClick={openAdd}
              className="px-3 py-1.5 rounded text-[12px] font-semibold bg-[#155b96] hover:bg-[#0e4a7a] text-white transition-colors flex items-center gap-1.5"
            >
              <Plus size={13} /> Add
            </button>
          </div>
        )}

        {/* Limit display (OLT tab) */}
        {activeTab === "OLT" && (
          <div className="px-5 pt-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
              Limit:{" "}
              <span className="text-[#155b96]">{filteredOlt.length}</span> /
              9999999999
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {activeTab === "ONU" && (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-slate-500 dark:text-slate-100 font-medium">
                    Filter OLT
                  </span>
                  <select
                    value={filterOlt}
                    onChange={(e) => setFilterOlt(e.target.value)}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-[13px] text-slate-600 dark:text-slate-100"
                  >
                    {uniqueOlts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              )}
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
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
              <span>Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
                columns={activeTab === "ONU" ? ONU_COLS : OLT_COLS}
                visible={activeTab === "ONU" ? visibleOnuCols : visibleOltCols}
                onChange={
                  activeTab === "ONU" ? setVisibleOnuCols : setVisibleOltCols
                }
              />
            </div>
          </div>
          {showFilter && (
            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              {activeTab === "ONU" && (
                <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
                  <span className="font-medium">Status ONU:</span>
                  <select
                    value={filterOnuStatus}
                    onChange={(e) => {
                      setFilterOnuStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
                  >
                    <option value="">Semua</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>
              )}
              {activeTab === "OLT" && (
                <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
                  <span className="font-medium">Status OLT:</span>
                  <select
                    value={filterOltStatus}
                    onChange={(e) => {
                      setFilterOltStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
                  >
                    <option value="">Semua</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
              {(filterOnuStatus !== "" || filterOltStatus !== "") && (
                <button
                  onClick={() => {
                    setFilterOnuStatus("");
                    setFilterOltStatus("");
                  }}
                  className="text-[12px] text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* ONU Table */}
        {activeTab === "ONU" && (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
              {filteredOnu.length === 0 ? (
                <EmptyState
                  title="Data ONU Kosong"
                  message="Tidak ada ONU ditemukan untuk filter ini."
                />
              ) : (
                paginatedOnu.map((onu, index) => {
                  const isExpanded = expandedOnuId === onu.id;
                  const rxBadgeClass =
                    parseFloat(onu.rxPower) > -20
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                      : parseFloat(onu.rxPower) > -25
                        ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                        : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30";
                  return (
                    <div
                      key={onu.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
                    >
                      {/* Summary Row */}
                      <button
                        onClick={() =>
                          setExpandedOnuId(isExpanded ? null : onu.id)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="text-[11px] text-slate-400 dark:text-slate-100 w-5 shrink-0 tabular-nums">
                          {startIndex + index + 1}
                        </span>
                        <span className="flex-1 font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">
                          {onu.name}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${rxBadgeClass}`}
                        >
                          {onu.rxPower}
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
                          {/* Name header */}
                          <div className="col-span-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              ONU Name
                            </p>
                            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                              {onu.name}
                            </p>
                          </div>
                          {/* RX Power */}
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-1">
                              RX Power
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-mono font-bold ${rxBadgeClass}`}
                            >
                              {onu.rxPower}
                              <span className="text-[10px] font-normal opacity-70">
                                {parseFloat(onu.rxPower) > -20
                                  ? "Good"
                                  : parseFloat(onu.rxPower) > -25
                                    ? "Warning"
                                    : "Critical"}
                              </span>
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              Distance
                            </p>
                            <p className="text-[12px] text-slate-600 dark:text-slate-100 tabular-nums">
                              {onu.distance}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              OLT
                            </p>
                            <p className="text-[12px] text-[#155b96] dark:text-blue-400 font-medium">
                              {onu.olt}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              MAC / SN
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-100 break-all">
                              {onu.macSn}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              Last Seen
                            </p>
                            <p className="text-[12px] text-slate-500 dark:text-slate-100 tabular-nums">
                              {onu.lastSeen}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              Status
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                onu.status === "Online"
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                                  : onu.status === "Warning"
                                    ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                                    : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${onu.status === "Online" ? "bg-emerald-500" : onu.status === "Warning" ? "bg-amber-500" : "bg-red-500"}`}
                              ></span>
                              {onu.status}
                            </span>
                          </div>
                          <div className="col-span-2 pt-1">
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
            <div className="hidden md:block overflow-x-auto">
              {filteredOnu.length === 0 ? (
                <EmptyState
                  title="Data ONU Kosong"
                  message="Tidak ada ONU ditemukan untuk filter ini."
                />
              ) : (
                <table className="w-full text-left text-[13px] whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="pl-5 pr-2 py-1.5 w-10 text-center">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                        />
                      </th>
                      <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                      {visibleOnuCols["name"] !== false && (
                        <th className="px-5 py-1.5">
                          <button
                            onClick={() => handleOnuSort("name")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            NAME {onuSortIcon("name")}
                          </button>
                        </th>
                      )}
                      {visibleOnuCols["distance"] !== false && (
                        <th className="px-5 py-1.5">
                          <button
                            onClick={() => handleOnuSort("distance")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            DISTANCE {onuSortIcon("distance")}
                          </button>
                        </th>
                      )}
                      {visibleOnuCols["rxPower"] !== false && (
                        <th className="px-5 py-1.5">
                          <button
                            onClick={() => handleOnuSort("rxPower")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            RX POWER {onuSortIcon("rxPower")}
                          </button>
                        </th>
                      )}
                      {visibleOnuCols["olt"] !== false && (
                        <th className="px-5 py-1.5">
                          <button
                            onClick={() => handleOnuSort("olt")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            OLT {onuSortIcon("olt")}
                          </button>
                        </th>
                      )}
                      {visibleOnuCols["macSn"] !== false && (
                        <th className="px-5 py-1.5">
                          <button
                            onClick={() => handleOnuSort("macSn")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            MAC / SN {onuSortIcon("macSn")}
                          </button>
                        </th>
                      )}
                      {visibleOnuCols["lastSeen"] !== false && (
                        <th className="px-5 py-1.5">
                          <button
                            onClick={() => handleOnuSort("lastSeen")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            LAST SEEN {onuSortIcon("lastSeen")}
                          </button>
                        </th>
                      )}
                      {visibleOnuCols["status"] !== false && (
                        <th className="px-5 py-1.5 text-center">
                          <button
                            onClick={() => handleOnuSort("status")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors mx-auto"
                          >
                            STATUS {onuSortIcon("status")}
                          </button>
                        </th>
                      )}
                      <th className="px-5 py-1.5 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedOnu.map((onu, index) => (
                      <tr
                        key={onu.id}
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
                        {visibleOnuCols["name"] !== false && (
                          <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                            {onu.name}
                          </td>
                        )}
                        {visibleOnuCols["distance"] !== false && (
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                            {onu.distance}
                          </td>
                        )}
                        {visibleOnuCols["rxPower"] !== false && (
                          <td className="px-5 py-3.5">
                            <span
                              className={`font-mono text-[12px] font-medium ${
                                parseFloat(onu.rxPower) > -20
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : parseFloat(onu.rxPower) > -25
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {onu.rxPower}
                            </span>
                          </td>
                        )}
                        {visibleOnuCols["olt"] !== false && (
                          <td className="px-5 py-3.5 text-[#155b96] dark:text-blue-400 font-medium">
                            {onu.olt}
                          </td>
                        )}
                        {visibleOnuCols["macSn"] !== false && (
                          <td className="px-5 py-3.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                            {onu.macSn}
                          </td>
                        )}
                        {visibleOnuCols["lastSeen"] !== false && (
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 text-[12px] tabular-nums">
                            {onu.lastSeen}
                          </td>
                        )}
                        {visibleOnuCols["status"] !== false && (
                          <td className="px-5 py-3.5">
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                                  onu.status === "Online"
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                                    : onu.status === "Warning"
                                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    onu.status === "Online"
                                      ? "bg-emerald-500"
                                      : onu.status === "Warning"
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                  }`}
                                ></span>
                                {onu.status}
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
              )}
            </div>
          </>
        )}

        {activeTab === "OLT" && (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
              {filteredOlt.length === 0 ? (
                <EmptyState
                  title="Data OLT Kosong"
                  message="Tidak ada OLT ditemukan."
                />
              ) : (
                paginatedOlt.map((olt, index) => {
                  const isExpanded = expandedOltId === olt.id;
                  return (
                    <div
                      key={olt.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
                    >
                      {/* Summary Row */}
                      <button
                        onClick={() =>
                          setExpandedOltId(isExpanded ? null : olt.id)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="text-[11px] text-slate-400 dark:text-slate-100 w-5 shrink-0 tabular-nums">
                          {startIndex + index + 1}
                        </span>
                        <span className="flex-1 font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">
                          {olt.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-100 shrink-0">
                          {olt.ip}
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
                          {/* Label + Address header */}
                          <div className="col-span-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              Label
                            </p>
                            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                              {olt.name}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              Address
                            </p>
                            <p className="text-[12px] font-mono text-slate-600 dark:text-slate-100 break-all">
                              {olt.ip}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              SNMP Port
                            </p>
                            <p className="text-[12px] text-slate-600 dark:text-slate-100 tabular-nums">
                              {olt.port}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              SNMP Community
                            </p>
                            <p className="text-[12px] text-slate-600 dark:text-slate-100">
                              public
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                              Last Seen
                            </p>
                            <p className="text-[12px] text-slate-500 dark:text-slate-100 tabular-nums">
                              {olt.uptime}
                            </p>
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
              {filteredOlt.length === 0 ? (
                <EmptyState
                  title="Data OLT Kosong"
                  message="Tidak ada OLT ditemukan."
                />
              ) : (
                <table className="w-full text-left text-[13px] whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-1.5 w-12">NO</th>
                      {visibleOltCols["name"] !== false && (
                        <th className="px-4 py-1.5">
                          <button
                            onClick={() => handleOltSort("name")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            LABEL {oltSortIcon("name")}
                          </button>
                        </th>
                      )}
                      {visibleOltCols["ip"] !== false && (
                        <th className="px-4 py-1.5">
                          <button
                            onClick={() => handleOltSort("ip")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            ADDRESS {oltSortIcon("ip")}
                          </button>
                        </th>
                      )}
                      {visibleOltCols["port"] !== false && (
                        <th className="px-4 py-1.5">
                          <button
                            onClick={() => handleOltSort("port")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            SNMP PORT {oltSortIcon("port")}
                          </button>
                        </th>
                      )}
                      {visibleOltCols["community"] !== false && (
                        <th className="px-4 py-1.5">SNMP COMMUNITY</th>
                      )}
                      {visibleOltCols["uptime"] !== false && (
                        <th className="px-4 py-1.5">
                          <button
                            onClick={() => handleOltSort("uptime")}
                            className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                          >
                            LAST SEEN {oltSortIcon("uptime")}
                          </button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedOlt.map((olt, index) => (
                      <tr
                        key={olt.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-100">
                          {startIndex + index + 1}
                        </td>
                        {visibleOltCols["name"] !== false && (
                          <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                            {olt.name}
                          </td>
                        )}
                        {visibleOltCols["ip"] !== false && (
                          <td className="px-4 py-3.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                            {olt.ip}
                          </td>
                        )}
                        {visibleOltCols["port"] !== false && (
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                            {olt.port}
                          </td>
                        )}
                        {visibleOltCols["community"] !== false && (
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-100">
                            public
                          </td>
                        )}
                        {visibleOltCols["uptime"] !== false && (
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                            {olt.uptime}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        <PaginationControls
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          totalItems={activeItems.length}
          itemLabel="entries"
          onPageChange={setCurrentPage}
        />
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                Add New OLT
              </h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Olt Name"
                  value={addForm.label}
                  onChange={(e) =>
                    setAddForm({ ...addForm, label: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              {/* Model OLT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  Model OLT <span className="text-red-500">*</span>
                </label>
                <select
                  value={addForm.model}
                  onChange={(e) =>
                    setAddForm({ ...addForm, model: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                >
                  {OLT_MODELS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  Address <span className="text-red-500">*</span>
                </label>
                <p className="flex items-start gap-1.5 text-[12px] text-blue-600 dark:text-blue-400 leading-snug">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  Jika OLT tidak memiliki ip publik yang dapat dipanggil,
                  gunakan ip address yang di dapat dari VPN dan lakukan port
                  forwarding pada router ke arah olt port 161. Atau gunakan menu{" "}
                  <span className="font-semibold underline cursor-pointer">
                    Helper (Klik Me)
                  </span>
                  .
                </p>
                <input
                  type="text"
                  placeholder="10.255.1.1"
                  value={addForm.address}
                  onChange={(e) =>
                    setAddForm({ ...addForm, address: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              {/* SNMP Port */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  SNMP Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="161"
                  value={addForm.snmpPort}
                  onChange={(e) =>
                    setAddForm({ ...addForm, snmpPort: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              {/* SNMP Community */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  SNMP Community <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="public"
                  value={addForm.snmpCommunity}
                  onChange={(e) =>
                    setAddForm({ ...addForm, snmpCommunity: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-lg text-[13px] font-semibold bg-[#155b96] hover:bg-[#0e4a7a] text-white transition-colors flex items-center gap-2"
              >
                <Save size={14} /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                Edit OLT
              </h2>
              <button
                onClick={() => setShowEdit(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Select OLT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  OLT <span className="text-red-500">*</span>
                </label>
                <select
                  value={editSelectedOlt}
                  onChange={(e) => handleEditOltSelect(e.target.value)}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                >
                  <option value="">Select OLT</option>
                  {olts.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Olt Name"
                  value={editForm.label}
                  onChange={(e) =>
                    setEditForm({ ...editForm, label: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              {/* Model OLT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  Model OLT <span className="text-red-500">*</span>
                </label>
                <select
                  value={editForm.model}
                  onChange={(e) =>
                    setEditForm({ ...editForm, model: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                >
                  {OLT_MODELS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  Address <span className="text-red-500">*</span>
                </label>
                <p className="flex items-start gap-1.5 text-[12px] text-blue-600 dark:text-blue-400 leading-snug">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  Jika OLT tidak memiliki ip publik yang dapat dipanggil,
                  gunakan ip address yang di dapat dari VPN dan lakukan port
                  forwarding pada router ke arah olt port 161.
                </p>
                <input
                  type="text"
                  placeholder="10.255.1.1"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              {/* SNMP Port */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  SNMP Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="161"
                  value={editForm.snmpPort}
                  onChange={(e) =>
                    setEditForm({ ...editForm, snmpPort: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
              {/* SNMP Community */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-100">
                  SNMP Community <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="public"
                  value={editForm.snmpCommunity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, snmpCommunity: e.target.value })
                  }
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowEdit(false)}
                className="px-5 py-2 rounded-lg text-[13px] font-semibold bg-[#155b96] hover:bg-[#0e4a7a] text-white transition-colors flex items-center gap-2"
              >
                <Save size={14} /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm mx-4">
            {/* Red top bar */}
            <div className="h-1 bg-red-500 rounded-t-xl" />
            {/* Close */}
            <div className="flex justify-end px-5 pt-4">
              <button
                onClick={() => setShowDelete(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 pb-6 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <AlertTriangle size={30} className="text-red-500" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                Are you sure?
              </h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-100 leading-relaxed">
                Semua data yang berhubungan dengan OLT tersebut akan terhapus
                termasuk pada tab ONU
              </p>
              {/* Select OLT to delete */}
              <select
                value={deleteSelectedOlt}
                onChange={(e) => setDeleteSelectedOlt(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-red-400 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 mt-1"
              >
                <option value="">— Pilih OLT —</option>
                {olts.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Footer */}
            <div className="px-6 pb-6 flex items-center gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2 rounded-lg text-[13px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDelete(false)}
                disabled={!deleteSelectedOlt}
                className="flex-1 py-2 rounded-lg text-[13px] font-semibold bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

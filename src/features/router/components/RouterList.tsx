import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Terminal,
  Server,
  Wifi,
  WifiOff,
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

const ROUTER_COLS: ColDef[] = [
  { key: "name", label: "Description" },
  { key: "secret", label: "Secret" },
  { key: "address", label: "Address" },
  { key: "status", label: "Status" },
  { key: "reservedAddress", label: "Reserved Address" },
  { key: "actions", label: "Actions", fixed: true },
];
import { MOCK_ROUTERS } from "../constants";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import SummaryStats from "../../../components/SummaryStats";
import ScriptModal from "../../../components/ScriptModal";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import type { Router } from "../types";
import ActionButton from "../../../components/ActionButton";
import PaginationControls from "../../../components/PaginationControls";

/* ── Sample script content (would come from API in production) ── */
const ROUTER_SCRIPTS: Record<string, Record<string, string>> = {
  "router-1": {
    v6: `# Connect VPN
/interface ovpn-client add cipher=aes256 activate1 \\
  connect="VPN-AIS" connect-to=tunnel.altafocus.id port=1194 name=R.Altafocus-Integrator \\
  user-peer-dns=no user=41s82a5dd9f8fb password=41s82a5dd1b847fb

# Set & Enabled NTP Client
/system ntp client set enabled=yes primary-ntp=10.255.0.1
  secondary-ntp=10.255.0.1
/system clock set time-zone-name=Asia/Jakarta

# Set Radius
/radius add address=10.255.0.1 secret=123 service=ppp,hotspot \\
  authentication-port=1808 accounting-port=1818 timeout=3s
/radius incoming set accept=yes accept-port=3799

# Set PPP to Use Secret
/ppp aaa set use-radius=yes accounting=yes interim-update=00:10:00

# Add default pool & Isolir pool
/ip pool add name=AIS-Isolir-Pool \\
  ranges=10.100.173.1-10.100.173.254 comment="AIS Default Isolir Pool"
/ip pool add name=AIS-PPPoE-Pool \\
  ranges=10.16.0.2-10.16.15.254 comment="AIS Default Pool"

# Add Static DNS & Isolir Landing Page
/ip dns set allow-remote-requests=yes
/ip dns static add address=103.189.147.149 name=isolir.altafocus.id
/ip proxy set enabled=yes parent-proxy=0.0.0.0 port="8080"
/ip proxy access add action=deny redirect-to="isolir.altafocus.id"
/ip firewall nat add action=accept chain=dstnat comment="dummy-rules"
/ip firewall nat add action=accept chain=dstnat src-address=10.100.173.0/24 \\
  src-target=list dst-address-list=AIS-Resources place-before=[ find (!disabled) \\~0 ]]
/ip firewall nat add action=redirect chain=dstnat comment="AIS - Isolir WebProxy" \\
  protocol=tcp dst-port=80,443 to-port=8080
/ip firewall nat add action=redirect chain=dstnat protocol=udp dst-port=80,443 to-port=8080

# Add default profile
/ppp profile add change-tcp-mss=yes local-address=10.99.99.1 \\
  name=only-srv-ppp remote-address=AIS-PPPoE-Pool comment="AIS Default Profile" \\
  dns-server=10.16.0.1,1.1.1.1 \\
  on-up=""
  on-down=""

# Add default hotspot user profile
/ip hotspot user profile add name=on-login="/ip hotspot cookie remove [find user=\\$username]" \\
  on-login-html fetch url="https://ais.altafocus.id/telegram/bot"

# Set all hotspot server to use radius
/ip hotspot profile set [find] login-by=http-chap,http-pap,cookie,mac-cookie use-radius=yes radius-accounting=yes radius-interim-update=00:01:00

# Drop chain forward for isolir pool
/ip firewall address-list add list=AIS-Resources address=ais.altafocus.id
/ip firewall address-list add list=AIS-Resources address=103.189.147.149

/ip firewall filter add chain=forward comment="AIS Drop Isolir Client" \\
  action=drop dst-address-list=!AIS-Resources src-address=10.100.173.0/24`,
    v7: `# Connect VPN (RouterOS v7)
/interface/ovpn-client/add cipher=aes256-cbc connect-to=tunnel.altafocus.id \\
  port=1194 name=R.Altafocus-Integrator \\
  user=41s82a5dd9f8fb password=41s82a5dd1b847fb

# NTP Client
/system/ntp/client/set enabled=yes servers=10.255.0.1
/system/clock/set time-zone-name=Asia/Jakarta

# Radius
/radius/add address=10.255.0.1 secret=123 service=ppp,hotspot \\
  authentication-port=1808 accounting-port=1818 timeout=3s
/radius/incoming/set accept=yes accept-port=3799

# PPP AAA
/ppp/aaa/set use-radius=yes accounting=yes interim-update=00:10:00

# IP Pools
/ip/pool/add name=AIS-Isolir-Pool \\
  ranges=10.100.173.1-10.100.173.254 comment="AIS Default Isolir Pool"
/ip/pool/add name=AIS-PPPoE-Pool \\
  ranges=10.16.0.2-10.16.15.254 comment="AIS Default Pool"

# DNS + Isolir Landing
/ip/dns/set allow-remote-requests=yes
/ip/dns/static/add address=103.189.147.149 name=isolir.altafocus.id

# Firewall rules
/ip/firewall/nat/add action=accept chain=dstnat comment="dummy-rules"
/ip/firewall/nat/add action=redirect chain=dstnat comment="AIS - Isolir WebProxy" \\
  protocol=tcp dst-port=80,443 to-port=8080

# Default PPP Profile
/ppp/profile/add change-tcp-mss=yes local-address=10.99.99.1 \\
  name=only-srv-ppp remote-address=AIS-PPPoE-Pool comment="AIS Default Profile" \\
  dns-server=10.16.0.1,1.1.1.1

# Hotspot profile
/ip/hotspot/user/profile/set [find] on-login=""

# Firewall filter
/ip/firewall/filter/add chain=forward comment="AIS Drop Isolir Client" \\
  action=drop dst-address-list=!AIS-Resources src-address=10.100.173.0/24`,
  },
  "router-2": {
    v6: `# Router Pusat - v6 Script
/interface ovpn-client add cipher=aes256 activate1 \\
  connect="VPN-AIS" connect-to=tunnel.altafocus.id port=1194 name=R.Pusat

# Set Radius
/radius add address=10.255.0.1 secret=pusat_rahasia service=ppp,hotspot

# PPP AAA
/ppp aaa set use-radius=yes accounting=yes interim-update=00:10:00`,
    v7: `# Router Pusat - v7 Script
/interface/ovpn-client/add cipher=aes256-cbc connect-to=tunnel.altafocus.id \\
  port=1194 name=R.Pusat

# Radius
/radius/add address=10.255.0.1 secret=pusat_rahasia service=ppp,hotspot

# PPP AAA
/ppp/aaa/set use-radius=yes accounting=yes interim-update=00:10:00`,
  },
};

export default function RouterList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(ROUTER_COLS),
  );

  // Script modal
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [scriptRouter, setScriptRouter] = useState<Router | null>(null);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRouter, setEditRouter] = useState<Router | null>(null);
  const [editName, setEditName] = useState("");
  const [editSecret, setEditSecret] = useState("");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRouter, setDeleteRouter] = useState<Router | null>(null);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterRouterStatus, setFilterRouterStatus] = useState("");

  const filteredRouters = MOCK_ROUTERS.filter(
    (r) =>
      (searchTerm === "" ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.secret.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRouterStatus === "" ||
        (filterRouterStatus === "online"
          ? r.vpn.is_connected === 1
          : r.vpn.is_connected === 0)),
  );

  type SortKey = "name" | "secret";
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

  const sortedRouters = [...filteredRouters].sort((a, b) => {
    if (!sortBy) return 0;
    const av = a[sortBy].toLowerCase();
    const bv = b[sortBy].toLowerCase();
    return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.max(1, Math.ceil(sortedRouters.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRouters = sortedRouters.slice(startIndex, startIndex + pageSize);
  const startItem = sortedRouters.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, sortedRouters.length);

  const handleScriptClick = (router: Router) => {
    setScriptRouter(router);
    setScriptModalOpen(true);
  };

  const handleEditClick = (router: Router) => {
    setEditRouter(router);
    setEditName(router.name);
    setEditSecret(router.secret);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (router: Router) => {
    setDeleteRouter(router);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to update router — editRouter?.id, { name: editName, secret: editSecret }
    setEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    // TODO: call API to delete router — deleteRouter?.id
    setDeleteRouter(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          List Router
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Add new
        </button>
      </div>

      <SummaryStats
        items={[
          {
            label: "Total Router",
            value: MOCK_ROUTERS.length,
            icon: <Server size={18} />,
            color: "blue",
          },
          {
            label: "Connected",
            value: MOCK_ROUTERS.filter((r) => r.vpn?.is_connected).length,
            icon: <Wifi size={18} />,
            color: "emerald",
          },
          {
            label: "Disconnected",
            value: MOCK_ROUTERS.filter((r) => !r.vpn?.is_connected).length,
            icon: <WifiOff size={18} />,
            color: "red",
          },
        ]}
      />

      {/* Limit */}
      <div className="px-5 pt-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Limit:{" "}
          <span className="text-[#155b96]">{filteredRouters.length}</span> /
          9999999999
        </p>
      </div>

      {/* Toolbar */}
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
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
            <span>Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-48 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors ${showFilter ? "border-[#155b96] text-[#155b96] bg-blue-50 dark:bg-blue-950/30" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <Filter size={14} /> Filter
            </button>
            <ColumnToggle
              columns={ROUTER_COLS}
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
                value={filterRouterStatus}
                onChange={(e) => {
                  setFilterRouterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            {filterRouterStatus !== "" && (
              <button
                onClick={() => setFilterRouterStatus("")}
                className="text-[12px] text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="pl-5 pr-2 py-2 w-10">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                />
              </th>
              <th className="pl-2 pr-5 py-2 w-12">NO</th>
              {visibleCols["name"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    DESCRIPTION {sortIcon("name")}
                  </button>
                </th>
              )}
              {visibleCols["secret"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("secret")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    SECRET {sortIcon("secret")}
                  </button>
                </th>
              )}
              {visibleCols["address"] !== false && (
                <th className="px-5 py-1.5">ADDRESS</th>
              )}
              {visibleCols["status"] !== false && (
                <th className="px-5 py-1.5">STATUS</th>
              )}
              {visibleCols["reservedAddress"] !== false && (
                <th className="px-5 py-1.5">RESERVED ADDRESS</th>
              )}
              <th className="px-5 py-1.5">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedRouters.map((router, index) => (
              <tr
                key={router.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="pl-5 pr-2 py-1.5 text-center">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </td>
                <td className="pl-2 pr-5 py-1.5 text-slate-500 dark:text-slate-100">
                  {startIndex + index + 1}
                </td>
                {visibleCols["name"] !== false && (
                  <td className="px-4 py-1.5 font-semibold text-slate-800 dark:text-slate-100">
                    {router.name}
                  </td>
                )}
                {visibleCols["secret"] !== false && (
                  <td className="px-4 py-1.5 text-slate-500 dark:text-slate-100">
                    {router.secret}
                  </td>
                )}
                {visibleCols["address"] !== false && (
                  <td className="px-4 py-1.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                    {router.vpn?.ip || "-"}
                  </td>
                )}
                {visibleCols["status"] !== false && (
                  <td className="px-4 py-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${
                        router.vpn?.is_connected
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          router.vpn?.is_connected
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {router.vpn?.is_connected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                )}
                {visibleCols["reservedAddress"] !== false && (
                  <td className="px-4 py-1.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                    {router.vpn?.reserved_ip || "-"}
                  </td>
                )}
                <td className="px-4 py-1.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleScriptClick(router)}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    >
                      <Terminal size={12} /> Script
                    </button>
                    <ActionButton
                      variant="edit"
                      label="Edit"
                      onClick={() => handleEditClick(router)}
                    >
                      <Edit size={12} />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      label="Delete"
                      onClick={() => handleDeleteClick(router)}
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
      <PaginationControls
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        startItem={startItem}
        endItem={endItem}
        totalItems={sortedRouters.length}
        itemLabel="entries"
        onPageChange={setCurrentPage}
      />

      {/* ─── Add Router Modal ─── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Router"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsAddModalOpen(false);
          }}
        >
          <div>
            <FormLabel
              label="Name"
              required
              tooltip="Nama router untuk identifikasi di dashboard."
            />
            <input
              type="text"
              required
              placeholder="Name"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <FormLabel
              label="Secret"
              required
              tooltip="Secret key untuk autentikasi koneksi ke router Mikrotik."
            />
            <input
              type="text"
              required
              placeholder="Secret"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              <Save size={16} />
              Save changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Script Modal ─── */}
      <ScriptModal
        isOpen={scriptModalOpen}
        onClose={() => {
          setScriptModalOpen(false);
          setScriptRouter(null);
        }}
        routerName={scriptRouter?.name || ""}
        scripts={
          scriptRouter
            ? ROUTER_SCRIPTS[scriptRouter.id] || {
                v6: "# No script available",
                v7: "# No script available",
              }
            : { v6: "", v7: "" }
        }
      />

      {/* ─── Edit Router Modal ─── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditRouter(null);
        }}
        title={`Edit Router${editRouter ? ` — ${editRouter.name}` : ""}`}
      >
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <div>
            <FormLabel label="Name" required />
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <FormLabel label="Secret" required />
            <input
              type="text"
              required
              value={editSecret}
              onChange={(e) => setEditSecret(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              <Save size={16} />
              Save changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteRouter(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemCount={1}
        itemName={deleteRouter?.name}
      />
    </div>
  );
}

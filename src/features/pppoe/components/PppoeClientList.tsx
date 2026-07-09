import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Save,
  Info,
  FileUp,
  FileDown,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import SummaryStats from "../../../components/SummaryStats";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import ActionButton from "../../../components/ActionButton";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import type { PppoeClientItem } from "../constants";

const PPPOE_CLIENT_COLS: ColDef[] = [
  { key: "name", label: "Username (Name)" },
  { key: "service", label: "Service" },
  { key: "profile", label: "Profile" },
  { key: "remoteAddress", label: "Remote Address" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", fixed: true },
];

export default function PppoeClientList() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    // Joining with pppoe_profiles to get the profile name
    const { data, error } = await supabase
      .from("pppoe_clients")
      .select("*, pppoe_profiles(name)")
      .order("created_at", { ascending: false });
      
    if (!error && data) {
      const mapped = data.map((d: any) => ({
        id: d.id,
        name: d.fullname,
        service: "pppoe",
        profile: d.pppoe_profiles?.name || "Unknown",
        remoteAddress: d.ip || "-",
        status: (d.status || "Disconnected").toLowerCase()
      }));
      setClients(mapped);
    }
  };

  const [pppoeProfiles, setPppoeProfiles] = useState<any[]>([]);
  const [clientProfiles, setClientProfiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchSelectData = async () => {
      const { data: profs } = await supabase.from('pppoe_profiles').select('*');
      if (profs) setPppoeProfiles(profs);

      const { data: cData } = await supabase.from('profiles').select('*').eq('role', 'client');
      if (cData) setClientProfiles(cData);
    };
    fetchSelectData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(PPPOE_CLIENT_COLS),
  );

  // Sorting state
  const [sortBy, setSortBy] = useState<
    "name" | "service" | "profile" | "remoteAddress" | "status" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Import modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Filter by tags
  const [filterTag, setFilterTag] = useState("");

  // Advanced filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProfile, setFilterProfile] = useState("");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<any | null>(null);

  // Add form state
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addProfile, setAddProfile] = useState("asd");
  const [addStaticIp, setAddStaticIp] = useState("");
  const [addSn, setAddSn] = useState("");
  const [addFullname, setAddFullname] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addTags, setAddTags] = useState("");
  const [addBilling, setAddBilling] = useState(false);

  // Payment state (visible when addBilling is checked)
  const [addPaymentType, setAddPaymentType] = useState("Pascabayar");
  const [addDiscount, setAddDiscount] = useState("");
  const [addTax, setAddTax] = useState(false);
  const [addSendInvoiceNotif, setAddSendInvoiceNotif] = useState(false);
  const [addAttachInvoice, setAddAttachInvoice] = useState(false);
  const [addExpiredReminder, setAddExpiredReminder] = useState(false);
  const [addInvoiceEmail, setAddInvoiceEmail] = useState(false);

  // Handle sorting
  const handleSort = (
    column: "name" | "service" | "profile" | "remoteAddress" | "status",
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Render sort icon
  const renderSortIcon = (
    column: "name" | "service" | "profile" | "remoteAddress" | "status",
  ) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={12} className="opacity-40" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );
  };

  const filtered = clients.filter(
    (c) =>
      (searchTerm === "" ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "" || c.status === filterStatus) &&
      (filterProfile === "" || c.profile === filterProfile),
  );

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Convert to lowercase for string comparison
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const resetAddForm = () => {
    setAddUsername("");
    setAddPassword("");
    setAddProfile("asd");
    setAddStaticIp("");
    setAddSn("");
    setAddFullname("");
    setAddPhone("");
    setAddEmail("");
    setAddAddress("");
    setAddTags("");
    setAddBilling(false);
    setAddPaymentType("Pascabayar");
    setAddDiscount("");
    setAddTax(false);
    setAddSendInvoiceNotif(false);
    setAddAttachInvoice(false);
    setAddExpiredReminder(false);
    setAddInvoiceEmail(false);
  };

  const handleEditClick = (client: any) => {
    setEditClient(client);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (clientId: number) => {
    setDeleteClientId(clientId);
    setDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // addFullname acts as the reference to profile's username
    const { error } = await supabase.from("pppoe_clients").insert({
      fullname: addFullname,
      ip: addStaticIp,
      profile_id: addProfile || null,
      status: 'Disconnected',
    });

    if (!error) {
      setIsModalOpen(false);
      resetAddForm();
      fetchClients();
    } else {
      alert("Failed to add client: " + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteClientId) {
      const { error } = await supabase.from("pppoe_clients").delete().eq('id', deleteClientId);
      if (!error) {
        setDeleteModalOpen(false);
        setDeleteClientId(null);
        fetchClients();
      } else {
        alert("Failed to delete client: " + error.message);
      }
    }
  };

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          List PPPoE Users
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <SummaryStats
        items={[
          {
            label: "Total Users",
            value: clients.length,
            icon: <Users size={18} />,
            color: "blue",
          },
          {
            label: "Connected",
            value: clients.filter((c) => c.status === "connected").length,
            icon: <UserCheck size={18} />,
            color: "emerald",
          },
          {
            label: "Disconnected",
            value: clients.filter((c) => c.status === "disconnected")
              .length,
            icon: <UserX size={18} />,
            color: "red",
          },
          {
            label: "Disable",
            value: clients.filter((c) => c.status === "disable").length,
            icon: <UserMinus size={18} />,
            color: "amber",
          },
          {
            label: "Expired",
            value: clients.filter((c) => c.status === "expired").length,
            icon: <UserX size={18} />,
            color: "red",
          },
        ]}
      />

      {/* Limit */}
      <div className="px-5 pt-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Limit: <span className="text-[#155b96]">{sorted.length}</span> /
          9999999999
        </p>
      </div>

      {/* Export / Import buttons */}
      <div className="px-5 pt-3 flex gap-2">
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors">
          <FileUp size={15} /> Export
        </button>
        <button
          onClick={() => setImportModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded text-[13px] font-semibold transition-colors"
        >
          <FileDown size={15} /> Import
        </button>
      </div>

      {/* Filter by tags */}
      <div className="px-5 pt-4">
        <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-100 mb-2">
          Filter by tags:
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            placeholder="Tags"
            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-48 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button className="flex items-center gap-1.5 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Toolbar */}
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
              columns={PPPOE_CLIENT_COLS}
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                <option value="connected">Connected</option>
                <option value="disconnected">Disconnected</option>
                <option value="disable">Disable</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
              <span className="font-medium">Profile:</span>
              <select
                value={filterProfile}
                onChange={(e) => setFilterProfile(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                <option value="Paket 10Mbps">Paket 10Mbps</option>
                <option value="Paket 20Mbps">Paket 20Mbps</option>
                <option value="Paket 50Mbps">Paket 50Mbps</option>
              </select>
            </div>
            {(filterStatus !== "" || filterProfile !== "") && (
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterProfile("");
                }}
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
        <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="pl-5 pr-2 py-1.5 w-10">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                />
              </th>
              <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
              {visibleCols["name"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    USERNAME (NAME){renderSortIcon("name")}
                  </button>
                </th>
              )}
              {visibleCols["service"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("service")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    SERVICE{renderSortIcon("service")}
                  </button>
                </th>
              )}
              {visibleCols["profile"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("profile")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    PROFILE{renderSortIcon("profile")}
                  </button>
                </th>
              )}
              {visibleCols["remoteAddress"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("remoteAddress")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    REMOTE ADDRESS{renderSortIcon("remoteAddress")}
                  </button>
                </th>
              )}
              {visibleCols["status"] !== false && (
                <th className="px-5 py-1.5 text-center">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors mx-auto"
                  >
                    STATUS{renderSortIcon("status")}
                  </button>
                </th>
              )}
              <th className="px-5 py-1.5">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.map((client, index) => (
              <tr
                key={client.id}
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
                {visibleCols["name"] !== false && (
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                    {client.name}
                  </td>
                )}
                {visibleCols["service"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 uppercase text-[11px] font-medium tracking-wider">
                    {client.service}
                  </td>
                )}
                {visibleCols["profile"] !== false && (
                  <td className="px-5 py-3.5 text-[#155b96] dark:text-blue-400 font-medium">
                    {client.profile}
                  </td>
                )}
                {visibleCols["remoteAddress"] !== false && (
                  <td className="px-5 py-3.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                    {client.remoteAddress}
                  </td>
                )}
                {visibleCols["status"] !== false && (
                  <td className="px-5 py-3.5">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          client.status === "connected"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                            : client.status === "expired"
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                              : client.status === "disable"
                                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                                : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            client.status === "connected"
                              ? "bg-emerald-500"
                              : client.status === "expired"
                                ? "bg-slate-500"
                                : client.status === "disable"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                          }`}
                        ></span>
                        {client.status === "connected"
                          ? "Online"
                          : client.status === "expired"
                            ? "Expired"
                            : client.status === "disable"
                              ? "Disable"
                              : "Offline"}
                      </span>
                      {client.isExpired && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Expired
                        </span>
                      )}
                    </div>
                  </td>
                )}
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <ActionButton
                      variant="edit"
                      label="Edit"
                      onClick={() => handleEditClick(client)}
                    >
                      <Edit size={12} />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      label="Delete"
                      onClick={() => handleDeleteClick(client.id)}
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
          <span className="text-[#155b96] font-medium">{sorted.length}</span> of{" "}
          {sorted.length} entry
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

      {/* ─── Add New Client Modal (matches Screenshot 5 — wide two-column layout) ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetAddForm();
        }}
        title="Add New Client"
        maxWidth={addBilling ? "2xl" : "xl"}
      >
        <form
          className="space-y-6"
          onSubmit={handleAddSubmit}
        >
          {/* Two-column grid */}
          <div
            className={`grid grid-cols-1 gap-x-8 gap-y-2 ${addBilling ? "md:grid-cols-3" : "md:grid-cols-2"}`}
          >
            {/* ── LEFT COLUMN ── */}
            <div className="space-y-4">
              {/* ACCOUNT section */}
              <div className="text-center mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#155b96] dark:text-blue-400 border-b border-[#155b96]/30 dark:border-blue-400/30 pb-1">
                  Account
                </span>
              </div>

              <div>
                <FormLabel label="Username" required />
                <input
                  type="text"
                  required
                  value={addUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  placeholder="user@altafocus"
                  className={inputClasses}
                />
              </div>

              <div>
                <FormLabel label="Password" required />
                <input
                  type="password"
                  required
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="password123"
                  className={inputClasses}
                />
              </div>

              {/* CONSTRAINTS section */}
              <div className="text-center mt-6 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#155b96] dark:text-blue-400 border-b border-[#155b96]/30 dark:border-blue-400/30 pb-1">
                  Constraints
                </span>
              </div>

              <div>
                <FormLabel label="Internet Profile" required />
                <select
                  value={addProfile}
                  onChange={(e) => setAddProfile(e.target.value)}
                  className={inputClasses}
                  required
                >
                  <option value="">Pilih Profil...</option>
                  {pppoeProfiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <FormLabel label="Static IP Address" />
                <div className="flex items-start gap-1.5 mb-1.5">
                  <Info
                    size={14}
                    className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0"
                  />
                  <p className="text-[11px] text-blue-500 dark:text-blue-400 leading-relaxed">
                    Jika ingin melakukan static ip pada pelanggan (Bahkan IP
                    Address berada di luar range pool yang ada) anda bisa
                    mengisi form ini
                  </p>
                </div>
                <input
                  type="text"
                  value={addStaticIp}
                  onChange={(e) => setAddStaticIp(e.target.value)}
                  placeholder="192.168.1.1"
                  className={inputClasses}
                />
              </div>

              <div>
                <FormLabel label="SN" />
                <input
                  type="text"
                  value={addSn}
                  onChange={(e) => setAddSn(e.target.value)}
                  placeholder="ZTEGC22B760C"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-4">
              {/* PERSONAL INFORMATION section */}
              <div className="text-center mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#155b96] dark:text-blue-400 border-b border-[#155b96]/30 dark:border-blue-400/30 pb-1">
                  Personal Information
                </span>
              </div>

              <div>
                <FormLabel label="Client Account (User)" required />
                <select
                  required
                  value={addFullname}
                  onChange={(e) => setAddFullname(e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Pilih Client...</option>
                  {clientProfiles.map(c => (
                    <option key={c.id} value={c.username}>{c.full_name || c.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <FormLabel label="Phone Number" />
                <input
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="(62) __-___-____"
                  className={inputClasses}
                />
              </div>

              <div>
                <FormLabel label="Email" />
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="someone@gmail.com"
                  className={inputClasses}
                />
              </div>

              <div>
                <FormLabel label="Address" />
                <textarea
                  value={addAddress}
                  onChange={(e) => setAddAddress(e.target.value)}
                  placeholder="JL. Soekarno Hattas No 45"
                  rows={3}
                  className={`${inputClasses} resize-y`}
                />
              </div>

              <div>
                <FormLabel label="Tags" />
                <input
                  type="text"
                  value={addTags}
                  onChange={(e) => setAddTags(e.target.value)}
                  placeholder="Tags"
                  className={inputClasses}
                />
              </div>

              {/* Add on billing */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="add-billing"
                  checked={addBilling}
                  onChange={(e) => setAddBilling(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                <label
                  htmlFor="add-billing"
                  className="text-[13px] font-medium text-slate-700 dark:text-slate-100 cursor-pointer"
                >
                  Add on billing
                </label>
              </div>
            </div>

            {/* ── PAYMENTS COLUMN (only when addBilling is checked) ── */}
            {addBilling && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#155b96] dark:text-blue-400 border-b border-[#155b96]/30 dark:border-blue-400/30 pb-1">
                    Payments
                  </span>
                </div>

                <div>
                  <FormLabel label="Payment Type" required />
                  <select
                    value={addPaymentType}
                    onChange={(e) => setAddPaymentType(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="Pascabayar">Pascabayar</option>
                    <option value="Prabayar">Prabayar</option>
                  </select>
                </div>

                <div>
                  <FormLabel label="Discount" />
                  <input
                    type="number"
                    value={addDiscount}
                    onChange={(e) => setAddDiscount(e.target.value)}
                    placeholder="20000"
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    {
                      id: "add-tax",
                      label: "Add Tax",
                      checked: addTax,
                      onChange: (v: boolean) => setAddTax(v),
                    },
                    {
                      id: "add-send-invoice",
                      label: "Send Invoice Notification",
                      checked: addSendInvoiceNotif,
                      onChange: (v: boolean) => setAddSendInvoiceNotif(v),
                    },
                    {
                      id: "add-attach-invoice",
                      label: "Attach Invoice File",
                      checked: addAttachInvoice,
                      onChange: (v: boolean) => setAddAttachInvoice(v),
                    },
                    {
                      id: "add-expired-reminder",
                      label: "Send Expired Reminder (Whatsapp H-1)",
                      checked: addExpiredReminder,
                      onChange: (v: boolean) => setAddExpiredReminder(v),
                    },
                    {
                      id: "add-invoice-email",
                      label: "Send Invoice Notification (Email)",
                      checked: addInvoiceEmail,
                      onChange: (v: boolean) => setAddInvoiceEmail(v),
                    },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <label
                        htmlFor={item.id}
                        className="text-[13px] text-slate-600 dark:text-slate-100 cursor-pointer"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-4">
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

      {/* ─── Edit Client Modal ─── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditClient(null);
        }}
        title="Edit Client"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Edit client:", editClient?.id);
            setEditModalOpen(false);
            setEditClient(null);
          }}
        >
          <div>
            <FormLabel label="Name" required />
            <input
              type="text"
              required
              defaultValue={editClient?.name || ""}
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Profile" required />
            <select
              defaultValue={editClient?.profile || ""}
              className={inputClasses}
            >
              <option value="Paket 10Mbps">Paket 10Mbps</option>
              <option value="Paket 20Mbps">Paket 20Mbps</option>
              <option value="Paket 50Mbps">Paket 50Mbps</option>
            </select>
          </div>
          <div>
            <FormLabel label="Remote Address" />
            <input
              type="text"
              defaultValue={editClient?.remoteAddress || ""}
              className={inputClasses}
            />
          </div>
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              <Save size={16} /> Save changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteClientId(null);
        }}
        onConfirm={() => {
          console.log("Delete client:", deleteClientId);
          setDeleteClientId(null);
        }}
        itemCount={1}
      />

      {/* ─── Import PPPoE User Modal ─── */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
          setImportFile(null);
        }}
        title="Import PPPoE User"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600 dark:text-slate-100 leading-relaxed">
            Proses akan dijalankan pada latar belakang, silahkan periksa Log
            untuk memantau progres.
          </p>

          <div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-600 dark:text-slate-100
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border file:border-slate-300 dark:file:border-slate-600
                file:text-sm file:font-medium
                file:bg-white dark:file:bg-slate-800
                file:text-slate-700 dark:file:text-slate-300
                hover:file:bg-slate-50 dark:hover:file:bg-slate-700
                file:cursor-pointer file:transition-colors"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                console.log("Import file:", importFile?.name);
                setImportModalOpen(false);
                setImportFile(null);
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

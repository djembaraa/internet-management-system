import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FileDown,
  FileUp,
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
import ActionButton from "../../../components/ActionButton";

const PPPOE_PROFILE_COLS: ColDef[] = [
  { key: "name", label: "Name" },
  { key: "rate_limit", label: "Rate" },
  { key: "pool", label: "Pool" },
  { key: "price", label: "Price" },
  { key: "uniq_id", label: "Group" },
  { key: "action", label: "Action", fixed: true },
];
import { MOCK_PPPOE_PROFILES } from "../../router/constants";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import type { PppoeProfile } from "../../router/types";

export default function PppoeProfileList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(PPPOE_PROFILE_COLS),
  );

  // Import modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<PppoeProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editPool, setEditPool] = useState("");
  const [editLocalProfile, setEditLocalProfile] = useState("");
  const [editRateLimit, setEditRateLimit] = useState("");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState<PppoeProfile | null>(null);

  // Add form state
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addPool, setAddPool] = useState("");
  const [addLocalProfile, setAddLocalProfile] = useState("");
  const [addRateLimit, setAddRateLimit] = useState("");
  const [addAdvanced, setAddAdvanced] = useState(false);

  // Advanced burst fields
  const [addUpMaxLimit, setAddUpMaxLimit] = useState("");
  const [addUpLimitAt, setAddUpLimitAt] = useState("");
  const [addUpBurstLimit, setAddUpBurstLimit] = useState("");
  const [addUpBurstThreshold, setAddUpBurstThreshold] = useState("");
  const [addUpBurstTime, setAddUpBurstTime] = useState("");
  const [addDlMaxLimit, setAddDlMaxLimit] = useState("");
  const [addDlLimitAt, setAddDlLimitAt] = useState("");
  const [addDlBurstLimit, setAddDlBurstLimit] = useState("");
  const [addDlBurstThreshold, setAddDlBurstThreshold] = useState("");
  const [addDlBurstTime, setAddDlBurstTime] = useState("");

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterGroup, setFilterGroup] = useState("");

  const filtered = MOCK_PPPOE_PROFILES.filter(
    (p) =>
      (searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterGroup === "" || p.uniq_id === filterGroup),
  );

  type SortKey = "name" | "rate_limit" | "price" | "uniq_id";
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
    const av = String(a[sortBy] ?? "").toLowerCase();
    const bv = String(b[sortBy] ?? "").toLowerCase();
    return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const handleEditClick = (profile: PppoeProfile) => {
    setEditProfile(profile);
    setEditName(profile.name);
    setEditPrice(String(profile.price));
    setEditPool("");
    setEditLocalProfile(profile.local_profile || "");
    setEditRateLimit(profile.rate_limit || "");
    setEditModalOpen(true);
  };

  const handleDeleteClick = (profile: PppoeProfile) => {
    setDeleteProfile(profile);
    setDeleteModalOpen(true);
  };

  const resetAddForm = () => {
    setAddName("");
    setAddPrice("");
    setAddPool("");
    setAddLocalProfile("");
    setAddRateLimit("");
    setAddAdvanced(false);
    setAddUpMaxLimit("");
    setAddUpLimitAt("");
    setAddUpBurstLimit("");
    setAddUpBurstThreshold("");
    setAddUpBurstTime("");
    setAddDlMaxLimit("");
    setAddDlLimitAt("");
    setAddDlBurstLimit("");
    setAddDlBurstThreshold("");
    setAddDlBurstTime("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          List PPPoE Profile
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Add new
        </button>
      </div>

      {/* Export / Import buttons */}
      <div className="px-5 pt-4 flex gap-2">
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
              columns={PPPOE_PROFILE_COLS}
              visible={visibleCols}
              onChange={setVisibleCols}
            />
          </div>
        </div>
        {showFilter && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
              <span className="font-medium">Group:</span>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                {[...new Set(MOCK_PPPOE_PROFILES.map((p) => p.uniq_id))].map(
                  (g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ),
                )}
              </select>
            </div>
            {filterGroup !== "" && (
              <button
                onClick={() => setFilterGroup("")}
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
                    NAME {sortIcon("name")}
                  </button>
                </th>
              )}
              {visibleCols["rate_limit"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("rate_limit")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    RATE {sortIcon("rate_limit")}
                  </button>
                </th>
              )}
              {visibleCols["pool"] !== false && (
                <th className="px-5 py-1.5">POOL</th>
              )}
              {visibleCols["price"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    PRICE {sortIcon("price")}
                  </button>
                </th>
              )}
              {visibleCols["uniq_id"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("uniq_id")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    GROUP {sortIcon("uniq_id")}
                  </button>
                </th>
              )}
              <th className="px-5 py-1.5">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.map((profile, index) => (
              <tr
                key={profile.id}
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
                    {profile.name}
                  </td>
                )}
                {visibleCols["rate_limit"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {profile.rate_limit || "-"}
                  </td>
                )}
                {visibleCols["pool"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    -
                  </td>
                )}
                {visibleCols["price"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                    Rp. {profile.price}
                  </td>
                )}
                {visibleCols["uniq_id"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {profile.uniq_id}
                  </td>
                )}
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    <ActionButton
                      variant="edit"
                      label="Edit"
                      onClick={() => handleEditClick(profile)}
                    >
                      <Edit size={12} />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      label="Delete"
                      onClick={() => handleDeleteClick(profile)}
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

      {/* ─── Add New Profile Modal (matches Screenshot 4) ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetAddForm();
        }}
        title="Add New Profile"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Add profile:", {
              addName,
              addPrice,
              addPool,
              addLocalProfile,
              addRateLimit,
              addAdvanced,
            });
            setIsModalOpen(false);
            resetAddForm();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-4 items-start">
            <div className="space-y-4">
              <div>
                <FormLabel label="Name" required />
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Paket Juara"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                />
              </div>
              <div>
                <FormLabel label="Price" required />
                <input
                  type="number"
                  required
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  placeholder="250000"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                />
              </div>
              <div>
                <FormLabel label="IP Pool Name" />
                <input
                  type="text"
                  value={addPool}
                  onChange={(e) => setAddPool(e.target.value)}
                  placeholder="Pool-Juara"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                />
              </div>
              <div>
                <FormLabel label="Local Profile" required />
                <input
                  type="text"
                  required
                  value={addLocalProfile}
                  onChange={(e) => setAddLocalProfile(e.target.value)}
                  placeholder="ais"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                />
              </div>
              <div>
                <FormLabel label="Rate Limit" required />
                <input
                  type="text"
                  required
                  value={addRateLimit}
                  onChange={(e) => setAddRateLimit(e.target.value)}
                  placeholder="10M/10M"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/60 dark:bg-slate-800/30">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-advanced"
                  checked={addAdvanced}
                  onChange={(e) => setAddAdvanced(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-[#155b96] cursor-pointer"
                />
                <label
                  htmlFor="add-advanced"
                  className="text-[13px] font-medium text-slate-700 dark:text-slate-100 cursor-pointer select-none"
                >
                  Advanced
                </label>
              </div>

              {addAdvanced ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5">
                      Upload
                    </p>
                    {[
                      {
                        label: "Max Limit",
                        value: addUpMaxLimit,
                        setter: setAddUpMaxLimit,
                      },
                      {
                        label: "Limit At",
                        value: addUpLimitAt,
                        setter: setAddUpLimitAt,
                      },
                      {
                        label: "Burst Limit",
                        value: addUpBurstLimit,
                        setter: setAddUpBurstLimit,
                      },
                      {
                        label: "Burst Threshold",
                        value: addUpBurstThreshold,
                        setter: setAddUpBurstThreshold,
                      },
                      {
                        label: "Burst Time",
                        value: addUpBurstTime,
                        setter: setAddUpBurstTime,
                      },
                    ].map(({ label, value, setter }) => (
                      <input
                        key={label}
                        type="text"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={label}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[12px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-1.5">
                      Download
                    </p>
                    {[
                      {
                        label: "Max Limit",
                        value: addDlMaxLimit,
                        setter: setAddDlMaxLimit,
                      },
                      {
                        label: "Limit At",
                        value: addDlLimitAt,
                        setter: setAddDlLimitAt,
                      },
                      {
                        label: "Burst Limit",
                        value: addDlBurstLimit,
                        setter: setAddDlBurstLimit,
                      },
                      {
                        label: "Burst Threshold",
                        value: addDlBurstThreshold,
                        setter: setAddDlBurstThreshold,
                      },
                      {
                        label: "Burst Time",
                        value: addDlBurstTime,
                        setter: setAddDlBurstTime,
                      },
                    ].map(({ label, value, setter }) => (
                      <input
                        key={label}
                        type="text"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={label}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[12px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-slate-500 dark:text-slate-300 leading-relaxed">
                  Aktifkan Advanced untuk mengisi burst limit dan parameter
                  upload/download.
                </p>
              )}
            </div>
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

      {/* ─── Edit Profile Modal ─── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditProfile(null);
        }}
        title="Edit Profile"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Edit profile:", editProfile?.id, {
              editName,
              editPrice,
              editPool,
              editLocalProfile,
              editRateLimit,
            });
            setEditModalOpen(false);
            setEditProfile(null);
          }}
        >
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
            <FormLabel label="Price / Month" required />
            <input
              type="number"
              required
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <FormLabel label="IP Pool Name" />
            <input
              type="text"
              value={editPool}
              onChange={(e) => setEditPool(e.target.value)}
              placeholder="Pool Name"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <FormLabel label="Local Profile" required />
            <input
              type="text"
              required
              value={editLocalProfile}
              onChange={(e) => setEditLocalProfile(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <FormLabel label="Rate Limit" required />
            <input
              type="text"
              required
              value={editRateLimit}
              onChange={(e) => setEditRateLimit(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100"
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
          setDeleteProfile(null);
        }}
        onConfirm={() => {
          console.log("Delete profile:", deleteProfile?.id);
          setDeleteProfile(null);
        }}
        itemCount={1}
      />

      {/* ─── Import PPPoE Profile Modal ─── */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
          setImportFile(null);
        }}
        title="Import PPPoE Profile"
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

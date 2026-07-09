import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  Save,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ColumnToggle, {
  type ColDef,
  initVisible,
} from "../../../components/ColumnToggle";
import ActionButton from "../../../components/ActionButton";

const HOTSPOT_PROFILE_COLS: ColDef[] = [
  { key: "name", label: "Name" },
  { key: "sharedUsers", label: "Shared Users" },
  { key: "rateLimit", label: "Rate Limit" },
  { key: "validity", label: "Validity" },
  { key: "price", label: "Price" },
  { key: "action", label: "Action", fixed: true },
];
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import SummaryStats from "../../../components/SummaryStats";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import { supabase } from "../../../services/supabase";

/** Shared "Masa Berlaku" info block — declared outside render to avoid recreation */
function MasaBerlakuInfo() {
  return (
    <div className="space-y-0.5 mb-1.5">
      <p className="text-[12px] text-slate-500 dark:text-slate-100">
        Info: 30d = 30 hari, 10h = 10 jam, 30m = 30 menit, 5s = 5 detik
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-100">
        Contoh: 1 hari 12 jam = 1d 12h, 2 jam 30 menit = 2h 30m
      </p>
    </div>
  );
}

export default function HotspotProfileList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCols, setVisibleCols] = useState(() =>
    initVisible(HOTSPOT_PROFILE_COLS),
  );
  
  const [profiles, setProfiles] = useState<any[]>([]);
  
  const fetchProfiles = async () => {
    const { data, error } = await supabase.from("hotspot_profiles").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setProfiles(data);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addLocalProfile, setAddLocalProfile] = useState("");
  const [addValidity, setAddValidity] = useState("");
  const [addRateLimit, setAddRateLimit] = useState("");
  const [addAdvanced, setAddAdvanced] = useState(false);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLocalProfile, setEditLocalProfile] = useState("");
  const [editValidity, setEditValidity] = useState("");
  const [editRateLimit, setEditRateLimit] = useState("");
  const [editAdvanced, setEditAdvanced] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState<any | null>(null);

  // Mobile expand
  const [expandedMobileId, setExpandedMobileId] = useState<number | null>(null);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterValidity, setFilterValidity] = useState("");

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  const filtered = profiles.filter(
    (p) =>
      (searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterValidity === "" || p.validity === filterValidity),
  );

  type SortKey = "name" | "sharedUsers" | "rateLimit" | "validity" | "price";
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

  const resetAddForm = () => {
    setAddName("");
    setAddPrice("");
    setAddLocalProfile("");
    setAddValidity("");
    setAddRateLimit("");
    setAddAdvanced(false);
  };

  const handleEditClick = (profile: any) => {
    setEditProfile(profile);
    setEditName(profile.name);
    setEditPrice(profile.price);
    setEditLocalProfile(profile.localProfile || "ais");
    setEditValidity(profile.validity);
    setEditRateLimit("");
    setEditAdvanced(false);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (profile: any) => {
    setDeleteProfile(profile);
    setDeleteModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          List Hotspot Profile
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} /> Add new
        </button>
      </div>

      <SummaryStats
        items={[
          {
            label: "Total Profile",
            value: profiles.length,
            icon: <Layers size={18} />,
            color: "blue",
          },
        ]}
      />

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
              placeholder="Search..."
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
              columns={HOTSPOT_PROFILE_COLS}
              visible={visibleCols}
              onChange={setVisibleCols}
            />
          </div>
        </div>
        {showFilter && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-100">
              <span className="font-medium">Masa Berlaku:</span>
              <select
                value={filterValidity}
                onChange={(e) => setFilterValidity(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none focus:border-[#155b96] text-[13px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100"
              >
                <option value="">Semua</option>
                {[...new Set(profiles.map((p) => p.validity))].map(
                  (v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ),
                )}
              </select>
            </div>
            {filterValidity !== "" && (
              <button
                onClick={() => setFilterValidity("")}
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
          sorted.map((profile, index) => {
            const isExpanded = expandedMobileId === profile.id;
            return (
              <div
                key={profile.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Summary Row */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <button
                    onClick={() =>
                      setExpandedMobileId(isExpanded ? null : profile.id)
                    }
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                  >
                    <span className="text-[11px] text-slate-400 dark:text-slate-100 w-5 shrink-0 tabular-nums">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">
                      {profile.name}
                    </span>
                    <span className="flex-1" />
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
                  <button
                    onClick={() => handleDeleteClick(profile)}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="col-span-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Name
                      </p>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Shared Users
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-100">
                        {profile.limit_users || 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Rate Limit
                      </p>
                      <p className="text-[12px] font-mono text-slate-500 dark:text-slate-100">
                        -
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Validity
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-100">
                        {profile.validity}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100 mb-0.5">
                        Price
                      </p>
                      <p className="text-[12px] text-slate-600 dark:text-slate-100 font-medium">
                        Rp. {profile.price}
                      </p>
                    </div>
                    <div className="col-span-2 pt-1 flex gap-1">
                      <button
                        onClick={() => handleEditClick(profile)}
                        className="px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(profile)}
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

      {/* Table (desktop only) */}
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
              {visibleCols["sharedUsers"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("sharedUsers")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    SHARED USERS {sortIcon("sharedUsers")}
                  </button>
                </th>
              )}
              {visibleCols["rateLimit"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("rateLimit")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    RATE LIMIT {sortIcon("rateLimit")}
                  </button>
                </th>
              )}
              {visibleCols["validity"] !== false && (
                <th className="px-5 py-1.5">
                  <button
                    onClick={() => handleSort("validity")}
                    className="flex items-center gap-1.5 hover:text-[#155b96] dark:hover:text-blue-400 transition-colors"
                  >
                    VALIDITY {sortIcon("validity")}
                  </button>
                </th>
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
              <th className="px-5 py-1.5 text-center">ACTION</th>
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
                {visibleCols["sharedUsers"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {profile.limit_users || 1}
                  </td>
                )}
                {visibleCols["rateLimit"] !== false && (
                  <td className="px-5 py-3.5 font-mono text-[12px] text-slate-500 dark:text-slate-100">
                    -
                  </td>
                )}
                {visibleCols["validity"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100">
                    {profile.validity}
                  </td>
                )}
                {visibleCols["price"] !== false && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-100 tabular-nums">
                    Rp. {profile.price}
                  </td>
                )}
                <td className="px-5 py-3.5">
                  <div className="flex justify-center gap-1">
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

      {/* ─── Add New Profile Modal (matches Screenshot 1) ─── */}
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
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('hotspot_profiles').insert({
              name: addName,
              price: Number(addPrice) || 0,
              validity: addValidity,
              limit_users: 1
            });
            if (!error) {
              setIsModalOpen(false);
              resetAddForm();
              fetchProfiles();
            } else {
              alert("Failed to add hotspot profile: " + error.message);
            }
          }}
        >
          <div>
            <FormLabel label="Nama" required />
            <input
              type="text"
              required
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="Paket Juara"
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Harga" required />
            <input
              type="number"
              required
              value={addPrice}
              onChange={(e) => setAddPrice(e.target.value)}
              placeholder="250000"
              className={inputClasses}
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
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Masa Berlaku" required />
            <MasaBerlakuInfo />
            <input
              type="text"
              required
              value={addValidity}
              onChange={(e) => setAddValidity(e.target.value)}
              placeholder="1d"
              className={inputClasses}
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
              className={inputClasses}
            />
          </div>

          {/* Advanced toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="add-hs-advanced"
              checked={addAdvanced}
              onChange={(e) => setAddAdvanced(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <label
              htmlFor="add-hs-advanced"
              className="text-[13px] font-medium text-slate-700 dark:text-slate-100 cursor-pointer"
            >
              Advanced
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors"
            >
              <Save size={16} /> Save changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Edit Profile Modal (matches Screenshot 2) ─── */}
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
          onSubmit={async (e) => {
            e.preventDefault();
            if (!editProfile?.id) return;
            const { error } = await supabase.from('hotspot_profiles').update({
              name: editName,
              price: Number(editPrice) || 0,
              validity: editValidity,
            }).eq('id', editProfile.id);
            if (!error) {
              setEditModalOpen(false);
              setEditProfile(null);
              fetchProfiles();
            } else {
              alert("Failed to update hotspot profile: " + error.message);
            }
          }}
        >
          <div>
            <FormLabel label="Nama" required />
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Harga" required />
            <input
              type="number"
              required
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Local Profile" required />
            <input
              type="text"
              required
              value={editLocalProfile}
              onChange={(e) => setEditLocalProfile(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Masa Berlaku" required />
            <MasaBerlakuInfo />
            <input
              type="text"
              required
              value={editValidity}
              onChange={(e) => setEditValidity(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FormLabel label="Rate Limit" required />
            <input
              type="text"
              required
              value={editRateLimit}
              onChange={(e) => setEditRateLimit(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Advanced toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-hs-advanced"
              checked={editAdvanced}
              onChange={(e) => setEditAdvanced(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <label
              htmlFor="edit-hs-advanced"
              className="text-[13px] font-medium text-slate-700 dark:text-slate-100 cursor-pointer"
            >
              Advanced
            </label>
          </div>

          <div className="flex justify-end pt-4">
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
        onConfirm={async () => {
          if (deleteProfile?.id) {
            const { error } = await supabase.from('hotspot_profiles').delete().eq('id', deleteProfile.id);
            if (!error) {
              setDeleteProfile(null);
              setDeleteModalOpen(false);
              fetchProfiles();
            } else {
              alert("Failed to delete hotspot profile: " + error.message);
            }
          }
        }}
        itemCount={1}
      />
    </div>
  );
}

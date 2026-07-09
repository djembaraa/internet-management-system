import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Server,
  Eye,
} from "lucide-react";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import EmptyState from "../../../components/EmptyState";
import ActionButton from "../../../components/ActionButton";
import {
  MOCK_ROOT_PACKAGES as MOCK_PACKAGES,
  type UserPackage,
} from "../constants";

// Helper for modern toggle switch
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 cursor-pointer group hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
      <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? "transform translate-x-4" : ""}`}
        ></div>
      </div>
    </label>
  );
}

export default function UserPackageList() {
  const [packages] = useState<UserPackage[]>(MOCK_PACKAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPriceMonth, setAddPriceMonth] = useState("");
  const [addPriceYear, setAddPriceYear] = useState("");
  const [addReleasePublic, setAddReleasePublic] = useState("no");
  const [addRouter, setAddRouter] = useState("");
  const [addPppoe, setAddPppoe] = useState("");
  const [addHotspot, setAddHotspot] = useState("");
  const [addOlt, setAddOlt] = useState("");
  const [addPaymentGateway, setAddPaymentGateway] = useState(true);
  const [addWhatsapp, setAddWhatsapp] = useState(false);
  const [addClientarea, setAddClientarea] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [, setEditPkg] = useState<UserPackage | null>(null);
  const [editName, setEditName] = useState("");
  const [editPriceMonth, setEditPriceMonth] = useState("");
  const [editPriceYear, setEditPriceYear] = useState("");
  const [editReleasePublic, setEditReleasePublic] = useState("no");
  const [editRouter, setEditRouter] = useState("");
  const [editPppoe, setEditPppoe] = useState("");
  const [editHotspot, setEditHotspot] = useState("");
  const [editOlt, setEditOlt] = useState("");
  const [editPaymentGateway, setEditPaymentGateway] = useState(true);
  const [editWhatsapp, setEditWhatsapp] = useState(false);
  const [editClientarea, setEditClientarea] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePkg, setDeletePkg] = useState<UserPackage | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPkg, setDetailPkg] = useState<UserPackage | null>(null);

  const filtered = packages.filter(
    (p) =>
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.price.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEditClick = (pkg: UserPackage) => {
    setEditPkg(pkg);
    setEditName(pkg.name);
    setEditPriceMonth("");
    setEditPriceYear("");
    setEditReleasePublic("no");
    setEditRouter("");
    setEditPppoe("");
    setEditHotspot("");
    setEditOlt("");
    setEditPaymentGateway(true);
    setEditWhatsapp(false);
    setEditClientarea(false);
    setEditOpen(true);
  };

  const handleDeleteClick = (pkg: UserPackage) => {
    setDeletePkg(pkg);
    setDeleteOpen(true);
  };

  const handleDetailClick = (pkg: UserPackage) => {
    setDetailPkg(pkg);
    setDetailOpen(true);
  };

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";
  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              List User Packages
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola paket langganan dan batasan fitur klien
            </p>
          </div>
          <button
            onClick={() => {
              setAddName("");
              setAddPriceMonth("");
              setAddPriceYear("");
              setAddReleasePublic("no");
              setAddRouter("");
              setAddPppoe("");
              setAddHotspot("");
              setAddOlt("");
              setAddPaymentGateway(true);
              setAddWhatsapp(false);
              setAddClientarea(false);
              setAddOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
          >
            <Plus size={16} /> Add New Package
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-100">
            <select className="border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#155b96] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-100 font-medium">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries per page</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search package name or price..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 pt-2">
          {filtered.length === 0 ? (
            <EmptyState
              title="Data Kosong"
              message="Tidak ada paket ditemukan."
            />
          ) : (
            filtered.map((pkg, index) => {
              const isExpanded = expandedId === pkg.id;
              const pppoeLimitation = pkg.limitations.find(
                (l) => l.label === "PPPoE",
              );

              return (
                <div
                  key={pkg.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : pkg.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-4 shrink-0 tabular-nums">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">
                        {pkg.name}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                        {pkg.price}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp
                        size={16}
                        className="text-slate-400 shrink-0 ml-1"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-slate-400 shrink-0 ml-1"
                      />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
                          Key Limitation (PPPoE)
                        </p>
                        {pppoeLimitation && (
                          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${pppoeLimitation.color}`}
                            >
                              <pppoeLimitation.icon size={14} />{" "}
                              {pppoeLimitation.label}
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                              {pppoeLimitation.value}{" "}
                              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">
                                User(s)
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex gap-2">
                        <ActionButton
                          variant="view"
                          label="Detail"
                          onClick={() => handleDetailClick(pkg)}
                          className="flex-1 justify-center"
                        >
                          <Eye size={14} /> Detail
                        </ActionButton>
                        <ActionButton
                          variant="edit"
                          label="Edit"
                          onClick={() => handleEditClick(pkg)}
                          className="flex-1 justify-center"
                        >
                          <Edit size={14} /> Edit
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          label="Delete"
                          onClick={() => handleDeleteClick(pkg)}
                          className="flex-1 justify-center"
                        >
                          <Trash2 size={14} /> Delete
                        </ActionButton>
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
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                {/* JARAK CHECKBOX DAN NOMOR DIRAPATKAN DISINI */}
                <th className="pl-5 pr-2 py-1.5 w-10">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </th>
                <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                <th className="px-5 py-1.5">PACKAGE NAME</th>
                <th className="px-5 py-1.5">PRICE</th>
                <th className="px-5 py-1.5">KEY LIMITATION (PPPoE)</th>
                <th className="px-5 py-1.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="Data Kosong"
                      message="Tidak ada paket ditemukan."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((pkg, index) => {
                  const pppoeLimitation = pkg.limitations.find(
                    (l) => l.label === "PPPoE",
                  );
                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                    >
                      {/* JARAK CHECKBOX DAN NOMOR DIRAPATKAN DISINI */}
                      <td className="pl-5 pr-2 py-3.5">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                        />
                      </td>
                      <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                        {pkg.name}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {pkg.price}
                      </td>
                      <td className="px-5 py-3.5">
                        {pppoeLimitation && (
                          <div className="inline-flex items-center gap-2 p-1.5 pr-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                            <span
                              className={`p-1 rounded bg-white dark:bg-slate-900 ${pppoeLimitation.color} shadow-sm`}
                            >
                              <pppoeLimitation.icon size={14} />
                            </span>
                            <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                              {pppoeLimitation.value}{" "}
                              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">
                                User(s)
                              </span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-center gap-2">
                          <ActionButton
                            variant="view"
                            label="Detail"
                            onClick={() => handleDetailClick(pkg)}
                          >
                            <Eye size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="edit"
                            label="Edit"
                            onClick={() => handleEditClick(pkg)}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="delete"
                            label="Delete"
                            onClick={() => handleDeleteClick(pkg)}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
          <div>
            Showing 1 to {filtered.length} of {filtered.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
              &laquo;
            </button>
            <button className="px-3 py-1 border border-[#155b96] bg-[#155b96] text-white rounded-lg text-[12px] font-medium shadow-sm">
              1
            </button>
            <button className="px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* ─── Add/Edit Package Modal (2-Column Layout) ─── */}
      <Modal
        isOpen={addOpen || editOpen}
        onClose={() => {
          setAddOpen(false);
          setEditOpen(false);
          setEditPkg(null);
        }}
        title={addOpen ? "Add New Package" : "Edit Package"}
        maxWidth="xl"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setAddOpen(false);
            setEditOpen(false);
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Info & Pricing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <CreditCard
                  size={16}
                  className="text-[#155b96] dark:text-blue-400"
                />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Informasi Paket
                </h3>
              </div>

              <div>
                <FormLabel label="Package Name" required />
                <input
                  type="text"
                  required
                  value={addOpen ? addName : editName}
                  onChange={(e) =>
                    addOpen
                      ? setAddName(e.target.value)
                      : setEditName(e.target.value)
                  }
                  placeholder="Misal: Paket Gold 50Mbps"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Price / Month" required />
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOpen ? addPriceMonth : editPriceMonth}
                    onChange={(e) =>
                      addOpen
                        ? setAddPriceMonth(e.target.value)
                        : setEditPriceMonth(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Price / Year" required />
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOpen ? addPriceYear : editPriceYear}
                    onChange={(e) =>
                      addOpen
                        ? setAddPriceYear(e.target.value)
                        : setEditPriceYear(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Release On Public" />
                <select
                  value={addOpen ? addReleasePublic : editReleasePublic}
                  onChange={(e) =>
                    addOpen
                      ? setAddReleasePublic(e.target.value)
                      : setEditReleasePublic(e.target.value)
                  }
                  className={selectClasses}
                >
                  <option value="no">No (Private)</option>
                  <option value="yes">Yes (Public)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <ToggleSwitch
                  label="Payment Gateway"
                  checked={addOpen ? addPaymentGateway : editPaymentGateway}
                  onChange={() =>
                    addOpen
                      ? setAddPaymentGateway(!addPaymentGateway)
                      : setEditPaymentGateway(!editPaymentGateway)
                  }
                />
                <ToggleSwitch
                  label="Whatsapp Gateway"
                  checked={addOpen ? addWhatsapp : editWhatsapp}
                  onChange={() =>
                    addOpen
                      ? setAddWhatsapp(!addWhatsapp)
                      : setEditWhatsapp(!editWhatsapp)
                  }
                />
                <ToggleSwitch
                  label="Client Area Access"
                  checked={addOpen ? addClientarea : editClientarea}
                  onChange={() =>
                    addOpen
                      ? setAddClientarea(!addClientarea)
                      : setEditClientarea(!editClientarea)
                  }
                />
              </div>
            </div>

            {/* Right Column: Limitations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <Server
                  size={16}
                  className="text-amber-500 dark:text-amber-400"
                />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Limitasi Resource
                </h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <FormLabel label="Router Limit" required />
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOpen ? addRouter : editRouter}
                    onChange={(e) =>
                      addOpen
                        ? setAddRouter(e.target.value)
                        : setEditRouter(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="PPPoE Users Limit" required />
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOpen ? addPppoe : editPppoe}
                    onChange={(e) =>
                      addOpen
                        ? setAddPppoe(e.target.value)
                        : setEditPppoe(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Hotspot Voucher Limit" required />
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOpen ? addHotspot : editHotspot}
                    onChange={(e) =>
                      addOpen
                        ? setAddHotspot(e.target.value)
                        : setEditHotspot(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="OLT Limit" required />
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOpen ? addOlt : editOlt}
                    onChange={(e) =>
                      addOpen
                        ? setAddOlt(e.target.value)
                        : setEditOlt(e.target.value)
                    }
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors active:scale-[0.98]"
            >
              <Save size={16} />{" "}
              {addOpen ? "Simpan Paket Baru" : "Update Paket"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Detail Package Modal ─── */}
      <Modal
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailPkg(null);
        }}
        title="Detail Informasi Paket"
        maxWidth="md"
      >
        {detailPkg && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Nama Paket
                </p>
                <p className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                  {detailPkg.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Harga
                </p>
                <p className="text-[16px] font-bold text-emerald-600 dark:text-emerald-400">
                  {detailPkg.price}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                Semua Limitasi & Fitur
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detailPkg.limitations.map((lim) => {
                  const Icon = lim.icon;
                  // Handle yes/no differently for styling
                  const isYesNo =
                    lim.value.toLowerCase() === "yes" ||
                    lim.value.toLowerCase() === "no";
                  const isYes = lim.value.toLowerCase() === "yes";

                  return (
                    <div
                      key={lim.label}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                    >
                      <div
                        className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 ${lim.color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-bold truncate">
                          {lim.label}
                        </span>
                        {isYesNo ? (
                          <span
                            className={`text-[12px] font-bold mt-0.5 ${isYes ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                          >
                            {lim.value}
                          </span>
                        ) : (
                          <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                            {lim.value}{" "}
                            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">
                              User(s)
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Delete Package Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletePkg(null);
        }}
        onConfirm={() => {
          console.log("Delete package:", deletePkg?.id);
          setDeletePkg(null);
          setDeleteOpen(false);
        }}
        itemCount={1}
      />
    </div>
  );
}

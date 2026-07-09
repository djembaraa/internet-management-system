import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Eye,
  User,
  CreditCard,
  Bell,
} from "lucide-react";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import EmptyState from "../../../components/EmptyState";
import ActionButton from "../../../components/ActionButton";
import { supabase } from "../../../services/supabase";
import { Router, Users, Ticket } from "lucide-react";

/* ─── Component ─── */
export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data) {
      setUsers(data.map(p => ({
        id: p.id,
        fullname: p.full_name || p.username,
        username: p.username,
        lastLogin: new Date(p.created_at).toLocaleDateString(),
        packages: p.role,
        resources: [
          { icon: Router, label: "Router", used: 1, limit: 1, color: "text-blue-500" },
          { icon: Users, label: "Client", used: 10, limit: 100, color: "text-emerald-500" },
          { icon: Ticket, label: "Voucher", used: 50, limit: 1000, color: "text-amber-500" }
        ]
      })));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add modal state
  const [addOpen, setAddOpen] = useState(false);
  const [addFullname, setAddFullname] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addPackage, setAddPackage] = useState("Free");
  const [addSiklus, setAddSiklus] = useState("");

  // Conditional UI states for Add
  const [addOnBilling, setAddOnBilling] = useState(true);
  const [addBillingType, setAddBillingType] = useState("Prabayar");
  const [addDiscount, setAddDiscount] = useState("");
  const [addTax, setAddTax] = useState(false);
  const [addTaxPercent, setAddTaxPercent] = useState("11");
  const [addSendInvoice, setAddSendInvoice] = useState(false);
  const [addAttachInvoice, setAddAttachInvoice] = useState(false);
  const [addSendExpired, setAddSendExpired] = useState(false);
  const [addSendInvoiceEmail, setAddSendInvoiceEmail] = useState(false);

  // Info modal
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoUser, setInfoUser] = useState<any | null>(null);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editFullname, setEditFullname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPackage, setEditPackage] = useState("");
  const [editSiklus, setEditSiklus] = useState("");

  // Conditional UI states for Edit
  const [editOnBilling, setEditOnBilling] = useState(true);
  const [editBillingType, setEditBillingType] = useState("Prabayar");
  const [editDiscount, setEditDiscount] = useState("");
  const [editTax, setEditTax] = useState(false);
  const [editTaxPercent, setEditTaxPercent] = useState("11");
  const [editSendInvoice, setEditSendInvoice] = useState(false);
  const [editAttachInvoice, setEditAttachInvoice] = useState(false);
  const [editSendExpired, setEditSendExpired] = useState(false);
  const [editSendInvoiceEmail, setEditSendInvoiceEmail] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);

  const filtered = users.filter(
    (u) =>
      searchTerm === "" ||
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.packages.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInfoClick = (user: any) => {
    setInfoUser(user);
    setInfoOpen(true);
  };

  const handleEditClick = (user: any) => {
    setEditUser(user);
    setEditFullname(user.fullname);
    setEditEmail("");
    setEditUsername("");
    setEditPhone("");
    setEditPassword("");
    setEditAddress("");
    setEditPackage(user.packages);
    setEditSiklus("");

    // Reset conditional edit states
    setEditOnBilling(true);
    setEditBillingType("Prabayar");
    setEditDiscount("");
    setEditTax(false);
    setEditTaxPercent("11");
    setEditSendInvoice(false);
    setEditAttachInvoice(false);
    setEditSendExpired(false);
    setEditSendInvoiceEmail(false);

    setEditOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setDeleteUser(user);
    setDeleteOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addOpen) {
      // Create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: addEmail || `${addUsername}@ais.local`,
        password: addPassword,
      });
      if (authError) {
        alert("Error creating auth user: " + authError.message);
        return;
      }
      const userId = authData?.user?.id;
      if (userId) {
        const { error } = await supabase.from('profiles').insert({
          id: userId,
          username: addUsername,
          full_name: addFullname,
          email: addEmail,
          role: addPackage === 'root' || addPackage === 'admin' ? addPackage : 'client'
        });
        if (error) alert("Error creating profile: " + error.message);
      }
    } else if (editOpen && editUser) {
      // Update profile
      const { error } = await supabase.from('profiles').update({
        full_name: editFullname,
        username: editUsername || undefined,
        email: editEmail || undefined,
        role: editPackage === 'root' || editPackage === 'admin' ? editPackage : 'client'
      }).eq('id', editUser.id);
      
      if (error) alert("Error updating profile: " + error.message);
    }
    setAddOpen(false);
    setEditOpen(false);
    fetchData();
  };

  const confirmDeleteUser = async () => {
    if (!deleteUser) return;
    const { error } = await supabase.from('profiles').delete().eq('id', deleteUser.id);
    if (error) {
      alert("Error deleting user: " + error.message);
    } else {
      setDeleteOpen(false);
      fetchData();
    }
  };

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";
  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";

  // Helper for basic toggle switch
  const renderToggle = (
    label: string,
    checked: boolean,
    toggle: () => void,
  ) => (
    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 cursor-pointer group hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
      <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={toggle}
        />
        <div
          className={`block w-9 h-5 rounded-full transition-colors ${checked ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${checked ? "transform translate-x-4" : ""}`}
        ></div>
      </div>
    </label>
  );

  // Helper for expandable toggle switch (For Add on billing & Add Tax)
  const renderExpandableToggle = (
    label: string,
    checked: boolean,
    toggle: () => void,
    children: React.ReactNode,
  ) => (
    <div
      className={`rounded-xl border transition-all duration-200 ${checked ? "border-[#155b96]/30 bg-blue-50/10 dark:bg-blue-900/10 shadow-sm" : "border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40"}`}
    >
      <label className="flex items-center justify-between p-3.5 cursor-pointer group">
        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">
          {label}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={toggle}
          />
          <div
            className={`block w-9 h-5 rounded-full transition-colors ${checked ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}
          ></div>
          <div
            className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${checked ? "transform translate-x-4" : ""}`}
          ></div>
        </div>
      </label>
      {checked && (
        <div className="p-4 border-t border-[#155b96]/20 bg-white dark:bg-slate-900 rounded-b-xl animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              List Users
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola data pelanggan dan limitasi resource
            </p>
          </div>
          <button
            onClick={() => {
              // Reset all states when opening Add Modal
              setAddFullname("");
              setAddEmail("");
              setAddUsername("");
              setAddPhone("");
              setAddPassword("");
              setAddAddress("");
              setAddPackage("Free");
              setAddSiklus("");
              setAddOnBilling(true);
              setAddBillingType("Prabayar");
              setAddDiscount("");
              setAddTax(false);
              setAddTaxPercent("11");
              setAddSendInvoice(false);
              setAddAttachInvoice(false);
              setAddSendExpired(false);
              setAddSendInvoiceEmail(false);
              setAddOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]"
          >
            <Plus size={16} /> Add User
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
              placeholder="Search user or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 pt-2">
          {filtered.length === 0 ? (
            <EmptyState
              title="Data Kosong"
              message="Tidak ada user ditemukan."
            />
          ) : (
            filtered.map((user, index) => {
              const isExpanded = expandedId === user.id;

              return (
                <div
                  key={user.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : user.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-4 shrink-0 tabular-nums">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">
                        {user.fullname}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Login: {user.lastLogin.split(" ")[0]}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-[#155b96] dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800/50">
                      {user.packages}
                    </span>
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
                          Usage Resources
                        </p>
                        <div className="flex flex-row flex-wrap gap-2">
                          {user.resources.map((res: any, i: number) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
                            >
                              <span
                                className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${res.color}`}
                              >
                                <res.icon size={14} /> {res.label}
                              </span>
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums ml-1">
                                {res.used.toLocaleString()}{" "}
                                <span className="text-slate-400 font-normal">
                                  / {res.limit.toLocaleString()}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex gap-2">
                        <ActionButton
                          variant="view"
                          label="Detail"
                          onClick={() => handleInfoClick(user)}
                          className="flex-1 justify-center"
                        >
                          <Eye size={14} /> Detail
                        </ActionButton>
                        <ActionButton
                          variant="edit"
                          label="Edit"
                          onClick={() => handleEditClick(user)}
                          className="flex-1 justify-center"
                        >
                          <Edit size={14} /> Edit
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          label="Delete"
                          onClick={() => handleDeleteClick(user)}
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
          <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pl-5 pr-2 py-1.5 w-10">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                  />
                </th>
                <th className="pl-2 pr-5 py-1.5 w-12">NO</th>
                <th className="px-5 py-1.5">USER INFO</th>
                <th className="px-5 py-1.5">PACKAGE</th>
                <th className="px-5 py-1.5 min-w-[250px]">RESOURCES</th>
                <th className="px-5 py-1.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="Data Kosong"
                      message="Tidak ada user ditemukan."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                  >
                    <td className="pl-5 pr-2 py-3.5">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                      />
                    </td>
                    <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-100">
                          {user.fullname}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Login: {user.lastLogin}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-[#155b96] dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                        {user.packages}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-row flex-wrap gap-2">
                        {user.resources.map((res: any, i: number) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1.5 p-1.5 pr-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 w-fit"
                          >
                            <span
                              className={`p-1 rounded bg-white dark:bg-slate-900 ${res.color} shadow-sm`}
                            >
                              <res.icon size={13} />
                            </span>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                              {res.used.toLocaleString()}{" "}
                              <span className="text-[10px] font-normal text-slate-400">
                                / {res.limit.toLocaleString()}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          variant="view"
                          label="Detail"
                          onClick={() => handleInfoClick(user)}
                        >
                          <Eye size={14} />
                        </ActionButton>
                        <ActionButton
                          variant="edit"
                          label="Edit"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          label="Delete"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* ─── Add/Edit User Modal Layout (2-Column Layout) ─── */}
      <Modal
        isOpen={addOpen || editOpen}
        onClose={() => {
          setAddOpen(false);
          setEditOpen(false);
          setEditUser(null);
        }}
        title={addOpen ? "Add New User" : "Edit User"}
        maxWidth="xl"
      >
        <form
          className="space-y-6"
          onSubmit={handleSaveUser}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Account Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <User size={16} className="text-[#155b96] dark:text-blue-400" />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Informasi Akun
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Fullname" required />
                  <input
                    type="text"
                    required
                    value={addOpen ? addFullname : editFullname}
                    onChange={(e) =>
                      addOpen
                        ? setAddFullname(e.target.value)
                        : setEditFullname(e.target.value)
                    }
                    placeholder="John Doe"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Email" />
                  <input
                    type="email"
                    value={addOpen ? addEmail : editEmail}
                    onChange={(e) =>
                      addOpen
                        ? setAddEmail(e.target.value)
                        : setEditEmail(e.target.value)
                    }
                    placeholder="who@example.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel label="Username" required />
                  <input
                    type="text"
                    required
                    value={addOpen ? addUsername : editUsername}
                    onChange={(e) =>
                      addOpen
                        ? setAddUsername(e.target.value)
                        : setEditUsername(e.target.value)
                    }
                    placeholder="username"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Phone Number" />
                  <input
                    type="text"
                    value={addOpen ? addPhone : editPhone}
                    onChange={(e) =>
                      addOpen
                        ? setAddPhone(e.target.value)
                        : setEditPhone(e.target.value)
                    }
                    placeholder="08123456789"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Password" required={addOpen} />
                <input
                  type="password"
                  required={addOpen}
                  value={addOpen ? addPassword : editPassword}
                  onChange={(e) =>
                    addOpen
                      ? setAddPassword(e.target.value)
                      : setEditPassword(e.target.value)
                  }
                  placeholder={
                    editOpen ? "Leave blank to keep current" : "Password"
                  }
                  className={inputClasses}
                />
              </div>

              <div>
                <FormLabel label="Address" />
                <textarea
                  value={addOpen ? addAddress : editAddress}
                  onChange={(e) =>
                    addOpen
                      ? setAddAddress(e.target.value)
                      : setEditAddress(e.target.value)
                  }
                  rows={2}
                  placeholder="Full address..."
                  className={inputClasses + " resize-none"}
                />
              </div>
            </div>

            {/* Section 2: Billing & Prefs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <CreditCard
                  size={16}
                  className="text-[#155b96] dark:text-blue-400"
                />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Paket & Tagihan
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <FormLabel label="User Package" required />
                  <select
                    value={addOpen ? addPackage : editPackage}
                    onChange={(e) =>
                      addOpen
                        ? setAddPackage(e.target.value)
                        : setEditPackage(e.target.value)
                    }
                    className={selectClasses}
                  >
                    <option value="Free">Free</option>
                    <option value="Trial">Trial</option>
                    <option value="tes paket">tes paket</option>
                  </select>
                </div>
                <div>
                  <FormLabel label="Siklus Langganan" />
                  <select
                    value={addOpen ? addSiklus : editSiklus}
                    onChange={(e) =>
                      addOpen
                        ? setAddSiklus(e.target.value)
                        : setEditSiklus(e.target.value)
                    }
                    className={selectClasses}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="1">1 Bulan</option>
                    <option value="3">3 Bulan</option>
                    <option value="6">6 Bulan</option>
                    <option value="12">12 Bulan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 mt-6">
                <Bell size={16} className="text-[#155b96] dark:text-blue-400" />
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                  Preferensi Sistem
                </h3>
              </div>

              {/* Toggles & Conditionals */}
              <div className="space-y-3">
                {/* Add on Billing Toggle Block */}
                {renderExpandableToggle(
                  "Add on billing",
                  addOpen ? addOnBilling : editOnBilling,
                  () =>
                    addOpen
                      ? setAddOnBilling(!addOnBilling)
                      : setEditOnBilling(!editOnBilling),
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel label="Tipe Tagihan" required />
                      <select
                        value={addOpen ? addBillingType : editBillingType}
                        onChange={(e) =>
                          addOpen
                            ? setAddBillingType(e.target.value)
                            : setEditBillingType(e.target.value)
                        }
                        className={selectClasses}
                      >
                        <option value="Prabayar">Prabayar</option>
                        <option value="Pascabayar">Pascabayar</option>
                      </select>
                    </div>
                    <div>
                      <FormLabel label="Discount (Rp)" />
                      <input
                        type="number"
                        min="0"
                        value={addOpen ? addDiscount : editDiscount}
                        onChange={(e) =>
                          addOpen
                            ? setAddDiscount(e.target.value)
                            : setEditDiscount(e.target.value)
                        }
                        placeholder="0"
                        className={inputClasses}
                      />
                    </div>
                  </div>,
                )}

                {/* Add Tax Toggle Block */}
                {renderExpandableToggle(
                  "Add Tax",
                  addOpen ? addTax : editTax,
                  () => (addOpen ? setAddTax(!addTax) : setEditTax(!editTax)),
                  <div>
                    <FormLabel label="Percent Of Tax" />
                    <p className="text-[11px] text-amber-500 font-medium mb-1.5 mt-0.5">
                      Gunakan tanda (.) untuk koma
                    </p>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:border-[#155b96] focus-within:ring-2 focus-within:ring-[#155b96]/10 transition-all bg-white dark:bg-slate-800">
                      <input
                        type="number"
                        step="0.1"
                        value={addOpen ? addTaxPercent : editTaxPercent}
                        onChange={(e) =>
                          addOpen
                            ? setAddTaxPercent(e.target.value)
                            : setEditTaxPercent(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 text-[13px] bg-transparent text-slate-700 dark:text-slate-100 outline-none"
                      />
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-l border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-semibold text-[13px]">
                        %
                      </div>
                    </div>
                  </div>,
                )}

                {/* Other Simple Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {renderToggle(
                    "Kirim Invoice (WA)",
                    addOpen ? addSendInvoice : editSendInvoice,
                    () =>
                      addOpen
                        ? setAddSendInvoice(!addSendInvoice)
                        : setEditSendInvoice(!editSendInvoice),
                  )}
                  {renderToggle(
                    "Kirim Invoice (Email)",
                    addOpen ? addSendInvoiceEmail : editSendInvoiceEmail,
                    () =>
                      addOpen
                        ? setAddSendInvoiceEmail(!addSendInvoiceEmail)
                        : setEditSendInvoiceEmail(!editSendInvoiceEmail),
                  )}
                  {renderToggle(
                    "Attach Invoice File",
                    addOpen ? addAttachInvoice : editAttachInvoice,
                    () =>
                      addOpen
                        ? setAddAttachInvoice(!addAttachInvoice)
                        : setEditAttachInvoice(!editAttachInvoice),
                  )}
                  {renderToggle(
                    "Reminder Expired (H-1)",
                    addOpen ? addSendExpired : editSendExpired,
                    () =>
                      addOpen
                        ? setAddSendExpired(!addSendExpired)
                        : setEditSendExpired(!editSendExpired),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-2 w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors active:scale-[0.98]"
            >
              <Save size={16} />{" "}
              {addOpen ? "Simpan User Baru" : "Update Data User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Detail User Modal ─── */}
      <Modal
        isOpen={infoOpen}
        onClose={() => {
          setInfoOpen(false);
          setInfoUser(null);
        }}
        title="Detail Informasi User"
        maxWidth="md"
      >
        {infoUser && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Fullname
                </p>
                <p className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                  {infoUser.fullname}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                  Package
                </p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-[#155b96] dark:text-blue-300">
                  {infoUser.packages}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                Statistik Penggunaan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {infoUser.resources.map((res: any) => {
                  const Icon = res.icon;
                  return (
                    <div
                      key={res.label}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                    >
                      <div
                        className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 ${res.color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-bold">
                          {res.label}
                        </span>
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                          {res.used.toLocaleString()}{" "}
                          <span className="text-slate-400 font-medium">
                            / {res.limit.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                Terakhir Login
              </span>
              <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {infoUser.lastLogin}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInfoOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Delete User Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteUser(null);
        }}
        onConfirm={confirmDeleteUser}
        itemCount={1}
      />
    </div>
  );
}

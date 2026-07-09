import { useState, useRef, useEffect } from "react";
import {
  Save,
  Plus,
  Edit,
  Trash2,
  Key,
  ChevronDown,
  ChevronUp,
  Camera,
  X,
  User as UserIcon,
  Users,
  Upload,
} from "lucide-react";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import EmptyState from "../../../components/EmptyState";
import { useAuthStore } from "../../auth/store/authStore";
import ActionButton from "../../../components/ActionButton";
import { MOCK_SUB_ACCOUNTS, type SubAccount } from "../constants";

import { supabase } from "../../../services/supabase";

/* ─── Tabs ─── */
const TABS = [
  { id: "My Account", icon: UserIcon },
  { id: "Sub Account", icon: Users },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function MyAccount() {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("My Account");

  /* ─── My Account state ─── */
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
      setContact(profile.phone || "");
      setAddress(profile.address || "");
    } else if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ─── Sub Account state ─── */
  const [subAccounts] = useState<SubAccount[]>(MOCK_SUB_ACCOUNTS);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("");
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<SubAccount | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<SubAccount | null>(null);

  /* ─── Mobile expand for Sub Account ─── */
  const [expandedSubId, setExpandedSubId] = useState<number | null>(null);

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";
  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";
  const readonlyClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-[13px] bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none select-none";

  const handleEditClick = (subUser: SubAccount) => {
    setEditUser(subUser);
    setEditUsername(subUser.username);
    setEditRole(subUser.role);
    setEditUserOpen(true);
  };

  const handleDeleteClick = (subUser: SubAccount) => {
    setDeleteUser(subUser);
    setDeleteUserOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* ─── Left sidebar ─── */}
          <div className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
            <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                Account Settings
              </h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                Kelola profil dan sub akun
              </p>
            </div>
            <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible py-2 md:py-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3.5 text-[13px] font-semibold transition-all whitespace-nowrap border-b-[3px] md:border-b-0 md:border-l-[3px] ${
                      isActive
                        ? "border-[#155b96] text-[#155b96] dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? "text-[#155b96] dark:text-blue-400"
                          : "text-slate-400"
                      }
                    />
                    {tab.id}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ─── Content area ─── */}
          <div className="flex-1 min-w-0 p-6 md:p-8 lg:p-10 bg-white dark:bg-slate-900">
            {/* ═══════════════ TAB: My Account ═══════════════ */}
            {activeTab === "My Account" && (
              <div className="max-w-2xl animate-in fade-in duration-300">
                <div className="mb-8">
                  <h3 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                    Profile Information
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    Perbarui foto profil dan detail kontak Anda
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-gradient-to-br from-[#155b96] to-blue-400 flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-white uppercase">
                            {fullName?.[0] || username?.[0] || "U"}
                          </span>
                        )}
                      </div>
                      {/* Hover overlay */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer text-white"
                      >
                        <Camera size={20} />
                      </button>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm"
                        >
                          <Upload size={14} /> Upload New Photo
                        </button>
                        {profilePhoto && (
                          <button
                            type="button"
                            onClick={() => setProfilePhoto(null)}
                            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                          >
                            <X size={14} /> Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        At least 800x800 px recommended. JPG or PNG max 2MB.
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Username */}
                    <div>
                      <FormLabel label="Username" required />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan username"
                        className={inputClasses}
                      />
                    </div>
                    {/* Full Name */}
                    <div>
                      <FormLabel label="Full Name" required />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <FormLabel label="Email Address" required />
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className={readonlyClasses}
                        title="Email tidak dapat diubah dari sini"
                      />
                    </div>
                    {/* Contact */}
                    <div>
                      <FormLabel label="Phone Number" required />
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="(62) 812-3456-7890"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Address */}
                    <div className="sm:col-span-2">
                      <FormLabel label="Address" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Alamat Lengkap"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Account Expiration */}
                    <div>
                      <FormLabel label="Account Expiration" />
                      <div className="relative">
                        <input
                          type="text"
                          value="Lifetime (∞)"
                          readOnly
                          className={readonlyClasses}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Packages */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel label="Current Package Subscription" />
                      <button
                        type="button"
                        className="text-[11px] font-bold text-[#155b96] dark:text-blue-400 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                    <input
                      type="text"
                      value="FREE PACKAGE"
                      readOnly
                      className={readonlyClasses + " font-bold text-slate-600"}
                    />
                  </div>

                  {/* Change Password */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setChangePasswordOpen(true)}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
                    >
                      <Key size={14} className="text-slate-500" /> Change
                      Password
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button 
                    onClick={async () => {
                      if (!user?.id) return;
                      setIsSaving(true);
                      try {
                        const { error } = await supabase
                          .from('profiles')
                          .update({
                            username: username,
                            full_name: fullName,
                            phone: contact,
                            address: address,
                          })
                          .eq('id', user.id);
                        
                        if (error) throw error;
                        
                        alert("Profile updated successfully!");
                        // Refresh the global state
                        const { setAuth } = useAuthStore.getState();
                        await setAuth(null, user); // Hack to trigger profile refetch in store if we didn't pass session
                        
                      } catch (err: any) {
                        alert("Failed to update profile: " + err.message);
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-8 py-2.5 rounded-lg text-[13px] font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════ TAB: Sub Account ═══════════════ */}
            {activeTab === "Sub Account" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                      Sub Accounts Management
                    </h3>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Kelola akses staff dan teknisi Anda
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAddUsername("");
                      setAddPassword("");
                      setAddRole("");
                      setAddUserOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
                  >
                    <Plus size={16} /> Add Sub Account
                  </button>
                </div>

                {subAccounts.length === 0 ? (
                  <EmptyState
                    title="Belum Ada Sub Account"
                    message="Anda belum menambahkan staff atau teknisi."
                  />
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col gap-2 p-4 bg-slate-50/50 dark:bg-slate-800/10">
                      {subAccounts.map((subUser, index) => {
                        const isExpanded = expandedSubId === subUser.id;
                        return (
                          <div
                            key={subUser.id}
                            className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900"
                          >
                            <button
                              onClick={() =>
                                setExpandedSubId(isExpanded ? null : subUser.id)
                              }
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-4 shrink-0 tabular-nums">
                                {index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-[13px] text-slate-800 dark:text-slate-100 truncate block">
                                  {subUser.username}
                                </span>
                              </div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-blue-50 dark:bg-blue-900/30 text-[#155b96] dark:text-blue-400 border-blue-200 dark:border-blue-800/50 shrink-0">
                                {subUser.role}
                              </span>
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
                                <div className="pt-2 flex gap-2">
                                  <ActionButton
                                    variant="edit"
                                    label="Edit"
                                    onClick={() => handleEditClick(subUser)}
                                    className="flex-1 justify-center"
                                  >
                                    <Edit size={14} /> Edit
                                  </ActionButton>
                                  <ActionButton
                                    variant="delete"
                                    label="Delete"
                                    onClick={() => handleDeleteClick(subUser)}
                                    className="flex-1 justify-center"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </ActionButton>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-[13px] whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-b border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="pl-5 pr-2 py-1.5 w-8 text-center">
                              <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                              />
                            </th>
                            <th className="pl-2 pr-5 py-1.5 w-16">NO</th>
                            <th className="px-6 py-1.5">USERNAME</th>
                            <th className="px-6 py-1.5">ROLE</th>
                            <th className="px-6 py-1.5 text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {subAccounts.map((subUser, index) => (
                            <tr
                              key={subUser.id}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors align-middle"
                            >
                              <td className="pl-5 pr-2 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
                                />
                              </td>
                              <td className="pl-2 pr-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                                {subUser.username}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-blue-50 dark:bg-blue-900/30 text-[#155b96] dark:text-blue-400 border-blue-200 dark:border-blue-800/50">
                                  {subUser.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    onClick={() => handleEditClick(subUser)}
                                    title="Edit"
                                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5"
                                  >
                                    <Edit size={14} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(subUser)}
                                    title="Delete"
                                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1.5"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Change Password Modal ─── */}
      <Modal
        isOpen={changePasswordOpen}
        onClose={() => {
          setChangePasswordOpen(false);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
        title="Change Password"
        maxWidth="md"
      >
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (newPassword !== confirmPassword) {
              alert("New password and confirm password do not match!");
              return;
            }
            try {
              const { error } = await supabase.auth.updateUser({
                password: newPassword
              });
              if (error) throw error;
              alert("Password changed successfully!");
              setChangePasswordOpen(false);
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
            } catch (err: any) {
              alert("Failed to change password: " + err.message);
            }
          }}
        >
          <div className="space-y-4">
            <div>
              <FormLabel label="Old Password" required />
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <FormLabel label="New Password" required />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <FormLabel label="Confirm New Password" required />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setChangePasswordOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-all active:scale-[0.98]"
            >
              Simpan Password
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Add New User Modal ─── */}
      <Modal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        title="Add Sub Account"
        maxWidth="md"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Add user:", { addUsername, addPassword, addRole });
            setAddUserOpen(false);
          }}
        >
          <div className="space-y-4">
            <div>
              <FormLabel label="Username" required />
              <input
                type="text"
                required
                value={addUsername}
                onChange={(e) => setAddUsername(e.target.value)}
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
                className={inputClasses}
              />
            </div>
            <div>
              <FormLabel
                label="Role Access"
                required
                tooltip="Pilih hak akses yang akan diberikan pada sub akun ini."
              />
              <select
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
                required
                className={selectClasses}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Operator">Operator</option>
                <option value="Technician">Technician</option>
                <option value="Finance">Finance</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setAddUserOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-all active:scale-[0.98]"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Edit User Modal ─── */}
      <Modal
        isOpen={editUserOpen}
        onClose={() => {
          setEditUserOpen(false);
          setEditUser(null);
        }}
        title="Edit Sub Account"
        maxWidth="md"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Edit user:", editUser?.id, { editUsername, editRole });
            setEditUserOpen(false);
            setEditUser(null);
          }}
        >
          <div className="space-y-4">
            <div>
              <FormLabel label="Username" required />
              <input
                type="text"
                required
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <FormLabel label="Role Access" required />
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                required
                className={selectClasses}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Operator">Operator</option>
                <option value="Technician">Technician</option>
                <option value="Finance">Finance</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => {
                setEditUserOpen(false);
                setEditUser(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-all active:scale-[0.98]"
            >
              Update Akun
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete User Modal ─── */}
      <ConfirmDeleteModal
        isOpen={deleteUserOpen}
        onClose={() => {
          setDeleteUserOpen(false);
          setDeleteUser(null);
        }}
        onConfirm={() => {
          console.log("Delete user:", deleteUser?.id);
          setDeleteUser(null);
        }}
        itemCount={1}
      />
    </div>
  );
}

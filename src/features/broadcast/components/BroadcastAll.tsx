import { useState, useMemo } from "react";
import { Send, Users, Search, MessageSquare, Info, Check } from "lucide-react";
import { MOCK_BROADCAST_USERS } from "../constants";
import { MOCK_WHATSAPP_MESSAGES } from "../../router/constants";

export default function BroadcastAll() {
  const [message, setMessage] = useState("");
  const [via, setVia] = useState<"whatsapp" | "telegram">("whatsapp");
  const [sendToAll, setSendToAll] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const filteredUsers = useMemo(() => {
    return MOCK_BROADCAST_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery),
    );
  }, [searchQuery]);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const isAllFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedUsers.includes(u.id));

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIds = filteredUsers.map((u) => u.id);
      setSelectedUsers((prev) =>
        prev.filter((id) => !filteredIds.includes(id)),
      );
    } else {
      const newIds = filteredUsers
        .map((u) => u.id)
        .filter((id) => !selectedUsers.includes(id));
      setSelectedUsers((prev) => [...prev, ...newIds]);
    }
  };

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
            <MessageSquare
              size={20}
              className="text-[#155b96] dark:text-blue-400"
            />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              Broadcast Pesan
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Kirim informasi, promo, atau pengumuman ke pelanggan Anda.
            </p>
          </div>
        </div>

        {/* Content Layout: 2 Columns on Large Screens */}
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Left Column: Target Recipients */}
          <div className="w-full lg:w-5/12 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
            <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
              Target Penerima
            </h3>

            {/* Segmented Control */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg mb-4">
              <button
                onClick={() => {
                  setSendToAll(true);
                  setSelectedUsers([]);
                }}
                className={`flex-1 py-2 text-[12px] font-semibold rounded-md transition-all ${
                  sendToAll
                    ? "bg-white dark:bg-slate-700 shadow-sm text-[#155b96] dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Semua User
              </button>
              <button
                onClick={() => setSendToAll(false)}
                className={`flex-1 py-2 text-[12px] font-semibold rounded-md transition-all ${
                  !sendToAll
                    ? "bg-white dark:bg-slate-700 shadow-sm text-[#155b96] dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Pilih Spesifik
              </button>
            </div>

            {/* Target Selection Logic */}
            {sendToAll ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 h-[220px] lg:h-[280px]">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-1">
                  <Users
                    size={24}
                    className="text-[#155b96] dark:text-blue-400"
                  />
                </div>
                <h4 className="text-[14px] font-semibold text-slate-800 dark:text-slate-100">
                  Kirim ke Semua Pelanggan
                </h4>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 px-2">
                  Pesan akan dibroadcast ke seluruh user yang terdaftar dalam
                  sistem (Total {MOCK_BROADCAST_USERS.length} user).
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-[220px] lg:h-[280px] animate-in fade-in duration-300">
                <div className="relative mb-3 shrink-0">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Cari nama atau nomor HP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-[12px] outline-none focus:border-[#155b96] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isAllFilteredSelected && filteredUsers.length > 0
                          ? "bg-[#155b96] border-[#155b96]"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#155b96]"
                      }`}
                    >
                      {isAllFilteredSelected && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isAllFilteredSelected}
                      onChange={toggleSelectAllFiltered}
                    />
                    <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300 select-none">
                      Pilih Semua
                    </span>
                  </label>
                  <span className="text-[11px] font-semibold text-[#155b96] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    {selectedUsers.length} Terpilih
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 pb-1">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center text-[12px] text-slate-500 py-6">
                      User tidak ditemukan.
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = selectedUsers.includes(user.id);
                      return (
                        <label
                          key={user.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#155b96] border-[#155b96]"
                                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                            }`}
                          >
                            {isSelected && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => toggleUser(user.id)}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                              {user.phone}
                            </span>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Message Composer */}
          <div className="w-full lg:w-7/12 p-5 flex flex-col">
            <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Isi Pesan</span>
              {sendToAll ? (
                <span className="normal-case text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info size={12} /> Ke {MOCK_BROADCAST_USERS.length} User
                </span>
              ) : (
                <span className="normal-case text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info size={12} /> Ke {selectedUsers.length} User
                </span>
              )}
            </h3>

            <div className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Platform Pengiriman
                </label>
                <select
                  value={via}
                  onChange={(e) =>
                    setVia(e.target.value as "whatsapp" | "telegram")
                  }
                  className={inputClasses}
                >
                  <option value="whatsapp">WhatsApp Gateway</option>
                  <option value="telegram">Telegram Bot</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5 flex justify-between items-end">
                  <span>Teks Broadcast</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Halo, ada promo menarik untuk Anda bulan ini..."
                  className={`${inputClasses} flex-1 resize-none min-h-[150px] lg:min-h-0`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end shrink-0">
              <button
                disabled={!sendToAll && selectedUsers.length === 0}
                onClick={() =>
                  console.log("Broadcast:", {
                    via,
                    message,
                    target: sendToAll ? "All" : selectedUsers,
                  })
                }
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors active:scale-[0.98]"
              >
                <Send size={15} />
                {sendToAll
                  ? "Kirim ke Semua"
                  : `Kirim ke ${selectedUsers.length} User`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
              Riwayat Broadcast
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Log broadcast terakhir dipindahkan ke menu broadcast.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#155b96] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
            {MOCK_WHATSAPP_MESSAGES.length} log
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap table-tight">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-100 font-medium border-y border-slate-200/80 dark:border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pl-5 pr-2 py-1.5 w-10">NO</th>
                <th className="px-5 py-1.5">TARGET</th>
                <th className="px-5 py-1.5">MESSAGE PREVIEW</th>
                <th className="px-5 py-1.5">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_WHATSAPP_MESSAGES.slice(0, 8).map((msg, index) => (
                <tr
                  key={msg.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="pl-5 pr-2 py-3.5 text-slate-500 dark:text-slate-100">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3.5 text-slate-800 dark:text-slate-100 font-medium tabular-nums">
                    {msg.to}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 truncate max-w-md">
                    {msg.message}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-[12px] tabular-nums">
                    {msg.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

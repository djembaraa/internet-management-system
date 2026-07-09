import { useState, useMemo, useEffect } from "react";
import { Send, UserRound, Search, Info, } from "lucide-react";
import { supabase } from "../../../services/supabase";

export default function BroadcastPersonal() {
  const [recipient, setRecipient] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [via, setVia] = useState<"whatsapp" | "telegram">("whatsapp");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles) setUsers(profiles.map(p => ({ id: p.id, name: p.full_name || p.username, phone: '-' })));
    }
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery)
    );
  }, [searchQuery, users]);

  const selectedUser = users.find((u) => u.id === recipient);

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
            <UserRound size={20} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              Kirim Pesan Pribadi
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Kirim pesan, tagihan, atau informasi langsung ke satu pelanggan spesifik.
            </p>
          </div>
        </div>

        {/* Content Layout: 2 Columns on Large Screens */}
        <div className="flex flex-col lg:flex-row flex-1">
          
          {/* Left Column: Target Recipient Selection */}
          <div className="w-full lg:w-5/12 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
            <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Pilih Penerima</span>
              {recipient && (
                <button 
                  onClick={() => setRecipient(null)}
                  className="text-[10px] text-red-500 hover:text-red-600 font-medium normal-case"
                >
                  Reset
                </button>
              )}
            </h3>

            <div className="flex flex-col h-[280px] lg:h-[320px]">
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

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 pb-1">
                {filteredUsers.length === 0 ? (
                  <div className="text-center text-[12px] text-slate-500 py-6">
                    User tidak ditemukan.
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = recipient === user.id;
                    return (
                      <label
                        key={user.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-violet-50/60 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700"
                            : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-violet-600 border-violet-600"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <input
                          type="radio"
                          name="recipient"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => setRecipient(user.id)}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className={`text-[12px] font-semibold truncate ${isSelected ? "text-violet-900 dark:text-violet-100" : "text-slate-800 dark:text-slate-100"}`}>
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
          </div>

          {/* Right Column: Message Composer */}
          <div className="w-full lg:w-7/12 p-5 flex flex-col">
            <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Isi Pesan</span>
              {selectedUser ? (
                <span className="normal-case text-[11px] font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info size={12} /> Ke: {selectedUser.name}
                </span>
              ) : (
                <span className="normal-case text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Info size={12} /> Belum ada penerima
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
                  onChange={(e) => setVia(e.target.value as "whatsapp" | "telegram")}
                  className={inputClasses}
                >
                  <option value="whatsapp">WhatsApp Gateway</option>
                  <option value="telegram">Telegram Bot</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5 flex justify-between items-end">
                  <span>Teks Pesan</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Halo, tagihan internet Anda bulan ini telah terbit..."
                  disabled={!recipient}
                  className={`${inputClasses} flex-1 resize-none min-h-[150px] lg:min-h-0 ${!recipient ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50" : ""}`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end shrink-0">
              <button
                disabled={!recipient || !message.trim()}
                onClick={() =>
                  console.log("Personal Broadcast:", {
                    via,
                    message,
                    recipient: selectedUser,
                  })
                }
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors active:scale-[0.98]"
              >
                <Send size={15} />
                Kirim Pesan Pribadi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

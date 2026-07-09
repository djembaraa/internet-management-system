import { useState } from "react";
import {
  Power,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquareWarning,
  Send,
  CheckCircle2,
} from "lucide-react";
import { MOCK_WHATSAPP_MESSAGES } from "../../router/constants";
import Modal from "../../../components/Modal";
import FormLabel from "../../../components/FormLabel";
import EmptyState from "../../../components/EmptyState";
import ActionButton from "../../../components/ActionButton";

export default function WhatsappGateway() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPhoneBookOpen, setIsPhoneBookOpen] = useState(false);

  // State untuk Modal Detail
  const [selectedMessage, setSelectedMessage] = useState<
    (typeof MOCK_WHATSAPP_MESSAGES)[0] | null
  >(null);

  // Mobile expand
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  const filteredMessages = MOCK_WHATSAPP_MESSAGES.filter(
    (msg) =>
      searchTerm === "" ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.to.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  const selectClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10">
      {/* Alert Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400 shrink-0">
            <MessageSquareWarning size={20} />
          </div>
          <div>
            <p className="text-red-700 dark:text-red-400 font-bold text-[14px]">
              Disconnected from Server
            </p>
            <p className="text-red-600/80 dark:text-red-400/80 font-medium text-[12px] mt-0.5">
              Gagal terhubung ke WA Server, silakan hubungi administrator atau
              restart service.
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all shadow-sm active:scale-[0.98] w-full sm:w-auto shrink-0">
          <Power size={15} /> Shutdown Service
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header - Consistent with Telegram Settings */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
            <Send size={20} className="text-[#155b96] dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
              WhatsApp Notification Settings
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Log riwayat pesan dan pengelolaan notifikasi WhatsApp
            </p>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col">
          {/* Toolbar */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pesan atau nomor WA..."
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 outline-none focus:border-[#155b96] w-full sm:w-64 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden px-6 pb-6 flex flex-col gap-2 pt-4">
            {filteredMessages.length === 0 ? (
              <EmptyState
                title="Log Kosong"
                message="Tidak ada riwayat pesan ditemukan."
              />
            ) : (
              filteredMessages.map((msg, index) => {
                const isExpanded = expandedMobileId === msg.id;
                return (
                  <div
                    key={msg.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900"
                  >
                    <button
                      onClick={() =>
                        setExpandedMobileId(isExpanded ? null : msg.id)
                      }
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-4 shrink-0 tabular-nums mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] text-slate-800 dark:text-slate-100 tabular-nums">
                          {msg.to}
                        </p>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate mt-1 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp
                          size={16}
                          className="text-slate-400 shrink-0 ml-1 mt-0.5"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-slate-400 shrink-0 ml-1 mt-0.5"
                        />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="mb-3 space-y-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">
                              Timestamp
                            </p>
                            <p className="text-[12px] text-slate-700 dark:text-slate-200 font-medium tabular-nums">
                              {msg.timestamp}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
                              Full Message
                            </p>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg text-[12px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex gap-2">
                          <ActionButton
                            variant="info"
                            label="View Log Detail"
                            onClick={() => setSelectedMessage(msg)}
                            className="flex-1 justify-center"
                          >
                            <Info size={14} /> View Log Detail
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
                  <th className="px-5 py-1.5">TARGET (TO)</th>
                  <th className="px-5 py-1.5 w-1/2">MESSAGE PREVIEW</th>
                  <th className="px-5 py-1.5">TIMESTAMP</th>
                  <th className="px-5 py-1.5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        title="Data Kosong"
                        message="Tidak ada riwayat pesan ditemukan."
                      />
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg, index) => (
                    <tr
                      key={msg.id}
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
                      <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                        {msg.to}
                      </td>
                      <td className="px-5 py-3.5">
                        <div
                          className="text-slate-600 dark:text-slate-300 truncate max-w-sm"
                          title={msg.message}
                        >
                          {msg.message}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-[12px] tabular-nums font-medium">
                        {msg.timestamp}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-center">
                          <button
                            title="Detail"
                            onClick={() => setSelectedMessage(msg)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-[#155b96] dark:bg-blue-900/30 dark:text-blue-400 transition-colors flex items-center gap-1.5"
                          >
                            <Info size={14} /> Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            <div>
              Showing 1 to {filteredMessages.length} of{" "}
              {MOCK_WHATSAPP_MESSAGES.length} entries
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
            <button
              onClick={() => setIsPhoneBookOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-6 py-2.5 rounded-lg text-[13px] font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
            >
              <BookOpen size={16} /> Phone Book
            </button>
            <div className="flex items-center w-full sm:w-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-[12px] text-slate-500 dark:text-slate-300">
              Riwayat broadcast dipindahkan ke menu Broadcast.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detail Log Modal ─── */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title="Log Message Detail"
          maxWidth="md"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
                  Target (To)
                </p>
                <p className="text-[14px] font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  {selectedMessage.to}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
                  Status
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle2 size={13} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Delivered
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1">
                Timestamp
              </p>
              <p className="text-[13px] font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                {selectedMessage.timestamp}
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                Full Message
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Phone Book Modal ─── */}
      <Modal
        isOpen={isPhoneBookOpen}
        onClose={() => setIsPhoneBookOpen(false)}
        title="Phone Book: Tambah Kontak"
        maxWidth="sm"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setIsPhoneBookOpen(false);
          }}
        >
          <div className="space-y-4">
            <div>
              <FormLabel
                label="Nama Lengkap"
                required
                tooltip="Nama lengkap untuk identifikasi kontak WhatsApp pelanggan."
              />
              <input
                type="text"
                required
                placeholder="e.g. Budi Susanto"
                className={inputClasses}
              />
            </div>
            <div>
              <FormLabel
                label="Nomor WhatsApp"
                required
                tooltip="Gunakan kode negara tanpa simbol +, contoh: 628123456789"
              />
              <input
                type="text"
                required
                placeholder="628123456789"
                className={inputClasses}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={() => setIsPhoneBookOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors active:scale-[0.98]"
            >
              Simpan Kontak
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

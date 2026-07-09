import { useState } from "react";
import { Wifi, Lock, RotateCcw, Power, AlertTriangle, X } from "lucide-react";

export default function ClientNetwork() {
    const [ssid, setSsid] = useState("AiS-Network-5G");
    const [password, setPassword] = useState("mypassword123");
    const [warningAction, setWarningAction] = useState<"reboot" | "restart" | null>(null);

    const handleConfirm = () => {
        // In production this would call an API
        setWarningAction(null);
    };

    return (
        <>
            <div className="space-y-4">
                {/* WiFi Settings Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="text-[14px] font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Wifi size={16} className="text-[#155b96] dark:text-blue-400" />
                        Pengaturan WiFi
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SSID / WiFi Name */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                <Wifi size={13} />
                                Nama WiFi / SSID
                            </label>
                            <input
                                type="text"
                                value={ssid}
                                onChange={(e) => setSsid(e.target.value)}
                                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-1 focus:ring-[#155b96]/20 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 transition-colors"
                                placeholder="Masukkan nama WiFi baru"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                <Lock size={13} />
                                Password WiFi
                            </label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-1 focus:ring-[#155b96]/20 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 transition-colors"
                                placeholder="Masukkan password baru"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-[#155b96] hover:bg-[#12507e] text-white text-[13px] font-medium rounded-lg transition-colors"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

                {/* Action Buttons Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="text-[14px] font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Power size={16} className="text-[#155b96] dark:text-blue-400" />
                        Kontrol Perangkat
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => setWarningAction("reboot")}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 rounded-lg text-[13px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
                        >
                            <RotateCcw size={15} />
                            Reboot
                        </button>
                        <button
                            type="button"
                            onClick={() => setWarningAction("restart")}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-lg text-[13px] font-semibold hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                        >
                            <Power size={15} />
                            Restart
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning Modal */}
            {warningAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setWarningAction(null)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in">
                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setWarningAction(null)}
                            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={16} className="text-slate-400" />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center">
                                <AlertTriangle size={28} className="text-amber-500" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-center text-[15px] font-bold text-slate-700 dark:text-slate-100 mb-1.5">
                            {warningAction === "reboot" ? "Reboot Perangkat?" : "Restart Perangkat?"}
                        </h3>
                        <p className="text-center text-[13px] text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                            {warningAction === "reboot"
                                ? "Perangkat akan di-reboot. Koneksi internet akan terputus sementara selama proses berlangsung."
                                : "Perangkat akan di-restart. Semua sesi aktif akan terputus dan membutuhkan waktu beberapa menit untuk kembali online."}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setWarningAction(null)}
                                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors ${
                                    warningAction === "reboot"
                                        ? "bg-amber-500 hover:bg-amber-600"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                                Ya, {warningAction === "reboot" ? "Reboot" : "Restart"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

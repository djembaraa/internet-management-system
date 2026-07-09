import { useState } from "react";
import { Cpu, HardDrive, MemoryStick, Database, RotateCcw, Power, Container, Server, Wifi, MessageCircle, X, AlertTriangle } from "lucide-react";
import Modal from "../../../components/Modal";

const RESTART_SERVICES = [
  { 
    key: "wa", 
    label: "WhatsApp", 
    description: "Restart layanan WhatsApp Gateway",
    icon: MessageCircle, 
    color: "bg-green-500 hover:bg-green-600",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800/50 hover:border-green-400 dark:hover:border-green-600"
  },
  { 
    key: "database", 
    label: "Database", 
    description: "Restart layanan database server",
    icon: Database, 
    color: "bg-amber-500 hover:bg-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600"
  },
  { 
    key: "radius", 
    label: "Radius", 
    description: "Restart layanan RADIUS server",
    icon: Wifi, 
    color: "bg-violet-500 hover:bg-violet-600",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200 dark:border-violet-800/50 hover:border-violet-400 dark:hover:border-violet-600"
  },
  { 
    key: "docker", 
    label: "Docker", 
    description: "Restart semua container Docker",
    icon: Container, 
    color: "bg-blue-500 hover:bg-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600"
  },
  { 
    key: "vm", 
    label: "Virtual Machine", 
    description: "Restart virtual machine server",
    icon: Server, 
    color: "bg-rose-500 hover:bg-rose-600",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-600"
  },
] as const;

/* ─── Types ─── */
interface SystemMetric {
  label: string;
  sublabel: string;
  value: number;
  icon: React.ElementType;
}

const METRICS: SystemMetric[] = [
  { label: "CPU", sublabel: "0 CORE", value: 0, icon: Cpu },
  { label: "DISK USAGE", sublabel: "0 / 0", value: 0, icon: HardDrive },
  { label: "MEMORY", sublabel: "0 MB / 0 MB", value: 0, icon: MemoryStick },
  { label: "SWAP", sublabel: "0 MB / 0 MB", value: 0, icon: Database },
];

function MetricCard({ metric }: { metric: SystemMetric }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200/70 dark:border-slate-800 shadow-sm p-3.5 sm:p-5 flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors group">
      
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
            {metric.label}
          </p>
          <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {metric.sublabel}
          </span>
        </div>
        
        <div className="p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-400 group-hover:text-[#155b96] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
          <metric.icon size={16} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-4 sm:mt-5 flex flex-col gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none tracking-tight">
            {metric.value}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            %
          </span>
        </div>
        
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#155b96] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${metric.value}%` }}
          />
        </div>
      </div>
      
    </div>
  );
}

export default function RootDashboard() {
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [restartOpen, setRestartOpen] = useState(false);

  const selectedService = RESTART_SERVICES.find((s) => s.key === confirmAction);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      {/* Docker Process */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100">Docker process</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRestartOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs sm:text-[13px] font-medium bg-red-500 hover:bg-red-600 text-white transition-colors active:scale-[0.98]"
            >
              <RotateCcw size={14} /> Restart
            </button>
            <button
              onClick={() => setConfirmAction("reboot")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs sm:text-[13px] font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors active:scale-[0.98]"
            >
              <Power size={14} /> Reboot
            </button>
          </div>
        </div>

        {/* Terminal-like area */}
        <div className="p-3 sm:p-4">
          <div className="bg-slate-100 dark:bg-slate-950 rounded-lg min-h-[100px] sm:min-h-[120px] p-3 sm:p-4 font-mono text-[11px] sm:text-[12px] text-slate-600 dark:text-green-400">
            <span className="text-slate-400 dark:text-slate-600">$</span> <span className="text-slate-400 dark:text-slate-500">No running processes</span>
          </div>
        </div>
      </div>

      {/* Restart Popup - Compact version */}
      {restartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setRestartOpen(false)}
        >
          <div
            className="w-full sm:w-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Restart Service</span>
              <button 
                onClick={() => setRestartOpen(false)} 
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Warning */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-4 py-2.5 sm:py-2 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-900/15 border-b border-amber-100 dark:border-amber-800/30 text-center">
              <AlertTriangle size={12} className="shrink-0" />
              <span>Hati-hati! Restart akan menghentikan service sementara.</span>
            </div>

            {/* Services - Grid layout with full last row */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 p-3">
              {RESTART_SERVICES.map((svc, index) => (
                <button
                  key={svc.key}
                  onClick={() => { setRestartOpen(false); setConfirmAction(svc.key); }}
                  className={`px-3 py-2 rounded-lg text-[11px] sm:text-[12px] font-medium text-white whitespace-nowrap ${svc.color} transition-colors active:scale-[0.97] ${index === RESTART_SERVICES.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  Restart {svc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal - Consistent styling */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction === "reboot" ? "Konfirmasi Reboot" : `Konfirmasi Restart ${selectedService?.label ?? ""}`}
        maxWidth="sm"
      >
        <div className="space-y-4 sm:space-y-5">
          {/* Visual indicator with icon */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${
              confirmAction === "reboot" 
                ? "bg-amber-100 dark:bg-amber-900/30" 
                : selectedService?.iconBg ?? "bg-red-100 dark:bg-red-900/30"
            }`}>
              {confirmAction === "reboot" ? (
                <Power size={28} className="text-amber-600 dark:text-amber-400" />
              ) : selectedService ? (
                <selectedService.icon size={28} className={selectedService.iconColor} />
              ) : (
                <RotateCcw size={28} className="text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-sm sm:text-[15px] text-center text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
              {confirmAction === "reboot"
                ? "Apakah Anda yakin ingin me-reboot server? Semua layanan akan terhenti sementara."
                : `Apakah Anda yakin ingin me-restart ${selectedService?.label ?? "service ini"}? Layanan akan terhenti sementara selama proses restart.`}
            </p>
          </div>
          
          {/* Action buttons - Mobile optimized */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 pt-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-[13px] font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                confirmAction === "reboot"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : selectedService?.color ?? "bg-red-500 hover:bg-red-600"
              }`}
            >
              {confirmAction === "reboot" ? (
                <>
                  <Power size={14} />
                  Reboot Server
                </>
              ) : (
                <>
                  <RotateCcw size={14} />
                  Restart {selectedService?.label ?? "Service"}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

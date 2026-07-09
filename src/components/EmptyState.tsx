import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "Belum ada data",
  message = "Data yang dicari tidak ditemukan atau belum tersedia.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Inbox size={28} className="text-slate-400 dark:text-slate-100" />
      </div>
      <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-100 mb-1">
        {title}
      </p>
      <p className="text-sm text-slate-400 dark:text-slate-100 max-w-xs">
        {message}
      </p>
    </div>
  );
}
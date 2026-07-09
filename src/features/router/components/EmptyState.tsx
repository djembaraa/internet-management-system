import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({ 
  title = "NOT FOUND!", 
  message = "Data yang Anda cari tidak ditemukan atau belum tersedia." 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-slate-50 p-6 rounded-full mb-4 border-8 border-slate-100">
        <SearchX size={64} className="text-[#155b96]" />
      </div>
      <h3 className="text-3xl font-extrabold text-[#155b96] tracking-tight mb-2 uppercase">
        {title}
      </h3>
      <p className="text-slate-500 max-w-md">
        {message}
      </p>
    </div>
  );
}
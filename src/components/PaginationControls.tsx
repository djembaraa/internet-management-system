interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  itemLabel = "entries",
  onPageChange,
}: PaginationControlsProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const navButtonClasses = (enabled: boolean) =>
    `px-2.5 py-1 border rounded-lg text-[12px] transition-colors ${
      enabled
        ? "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
        : "border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
    }`;

  return (
    <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-slate-500 dark:text-slate-100">
      <div>
        Showing <span className="text-[#155b96] font-medium">{startItem}</span>{" "}
        to <span className="text-[#155b96] font-medium">{endItem}</span> of{" "}
        {totalItems} {itemLabel}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => canGoPrev && onPageChange(1)}
          disabled={!canGoPrev}
          className={navButtonClasses(canGoPrev)}
        >
          &laquo;
        </button>
        <button
          type="button"
          onClick={() => canGoPrev && onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className={navButtonClasses(canGoPrev)}
        >
          &lsaquo;
        </button>
        <button
          type="button"
          className="px-2.5 py-1 border border-[#155b96] bg-[#155b96] text-white rounded-lg text-[12px] font-medium"
        >
          {currentPage}
        </button>
        <button
          type="button"
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={navButtonClasses(canGoNext)}
        >
          &rsaquo;
        </button>
        <button
          type="button"
          onClick={() => canGoNext && onPageChange(totalPages)}
          disabled={!canGoNext}
          className={navButtonClasses(canGoNext)}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

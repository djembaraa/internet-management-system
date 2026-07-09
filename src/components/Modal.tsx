import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useCallback } from "react";

type ModalMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl";

const MAX_WIDTH_MAP: Record<ModalMaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Controls modal width. Defaults to "lg" (max-w-lg). */
  maxWidth?: ModalMaxWidth;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  // Auto-focus the dialog when opened
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"]), input, select, textarea'
    );
    firstFocusable?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full ${MAX_WIDTH_MAP[maxWidth]} overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/80 dark:border-slate-800 transform transition-all animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <h3
            id="modal-title"
            className="text-[16px] font-bold text-slate-800 dark:text-slate-100 tracking-tight"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#155b96]/30"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
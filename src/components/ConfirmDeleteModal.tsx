import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    /** Number of items being deleted */
    itemCount?: number;
    /** Optional name of the specific item being deleted, shown in the description */
    itemName?: string;
}

/**
 * Reusable delete confirmation modal with destructive styling.
 * Red-bordered, warning icon, Cancel + Delete buttons.
 */
export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemCount = 1,
    itemName,
}: ConfirmDeleteModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Esc to close
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Focus trap
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key !== "Tab" || !dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
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
    }, []);

    // Auto-focus cancel button on open
    useEffect(() => {
        if (!isOpen || !dialogRef.current) return;
        const cancelBtn = dialogRef.current.querySelector<HTMLElement>(
            "[data-cancel-btn]"
        );
        cancelBtn?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
        >
            <div
                ref={dialogRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-desc"
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-red-300 dark:border-red-500/40"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                {/* Close button */}
                <div className="flex justify-end px-4 pt-4">
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                        aria-label="Close confirmation"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 text-center">
                    {/* Warning icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                            <AlertTriangle
                                size={28}
                                className="text-red-500 dark:text-red-400"
                            />
                        </div>
                    </div>

                    <h3
                        id="delete-modal-title"
                        className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2"
                    >
                        Are you sure?
                    </h3>
                    <p
                        id="delete-modal-desc"
                        className="text-sm text-slate-500 dark:text-slate-100 mb-6 leading-relaxed"
                    >
                        {itemName ? (
                            <>
                                Do you really want to remove{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-100">
                                    {itemName}
                                </span>
                                ? This action cannot be undone.
                            </>
                        ) : (
                            <>Do you really want to remove {itemCount} item{itemCount !== 1 ? "s" : ""}? What you've done cannot be undone.</>
                        )}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-center gap-3">
                        <button
                            data-cancel-btn
                            onClick={onClose}
                            className="px-6 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/40"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-6 py-2.5 text-[13px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/40"
                        >
                            Delete {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

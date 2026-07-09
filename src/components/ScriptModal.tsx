import { useState, useEffect, useRef, useCallback } from "react";
import { X, Copy, Check } from "lucide-react";

interface ScriptModalProps {
    isOpen: boolean;
    onClose: () => void;
    routerName: string;
    /** Script content keyed by version label, e.g. { v6: "...", v7: "..." } */
    scripts: Record<string, string>;
}

/**
 * Wide modal for viewing/copying router setup scripts.
 * Supports version tabs (v6/v7), a Copy button, and a dark code block.
 */
export default function ScriptModal({
    isOpen,
    onClose,
    routerName,
    scripts,
}: ScriptModalProps) {
    const versions = Object.keys(scripts);
    const [activeTab, setActiveTab] = useState(versions[0] || "v6");
    const [copied, setCopied] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Reset tab and copy state when the modal opens.
    useEffect(() => {
        if (isOpen) {
            setActiveTab(versions[0] || "v6");
            setCopied(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(scripts[activeTab] || "");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const ta = document.createElement("textarea");
            ta.value = scripts[activeTab] || "";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="script-modal-title"
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/60 dark:border-slate-700/60"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                {/* Header with tabs + close */}
                <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Version tabs */}
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            {versions.map((v) => (
                                <button
                                    key={v}
                                    onClick={() => {
                                        setActiveTab(v);
                                        setCopied(false);
                                    }}
                                    className={`px-4 py-1.5 text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${activeTab === v
                                            ? "bg-[#155b96] text-white"
                                            : "text-slate-600 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        <span
                            id="script-modal-title"
                            className="text-[13px] text-slate-500 dark:text-slate-100 hidden sm:inline"
                        >
                            {routerName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Copy button */}
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-emerald-500" /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={14} /> Copy
                                </>
                            )}
                        </button>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                            aria-label="Close script viewer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Script content */}
                <div className="overflow-y-auto flex-1 bg-[#0d1b2a] dark:bg-[#0a1628]">
                    <pre className="p-6 text-[12px] leading-relaxed text-emerald-300/90 font-mono whitespace-pre-wrap break-words">
                        {scripts[activeTab] || "# No script available for this version."}
                    </pre>
                </div>
            </div>
        </div>
    );
}

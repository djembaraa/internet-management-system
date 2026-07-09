/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useEffect } from "react";
import { Columns2 } from "lucide-react";

export interface ColDef {
    key: string;
    label: string;
    /** If true, this column cannot be hidden (e.g. action buttons) */
    fixed?: boolean;
}

interface ColumnToggleProps {
    columns: ColDef[];
    visible: Record<string, boolean>;
    onChange: (visible: Record<string, boolean>) => void;
}

/**
 * Dropdown button that lets users show/hide table columns.
 * Gestalt: Proximity — placed next to Filter in the toolbar cluster.
 */
export default function ColumnToggle({ columns, visible, onChange }: ColumnToggleProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const toggleable = columns.filter((c) => !c.fixed);
    const allVisible = toggleable.every((c) => visible[c.key] !== false);

    const toggle = (key: string) => {
        onChange({ ...visible, [key]: !(visible[key] !== false) });
    };

    const toggleAll = () => {
        const next: Record<string, boolean> = { ...visible };
        toggleable.forEach((c) => { next[c.key] = !allVisible; });
        onChange(next);
    };

    const hiddenCount = toggleable.filter((c) => visible[c.key] === false).length;

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors ${
                    open || hiddenCount > 0
                        ? "border-[#155b96] text-[#155b96] bg-blue-50 dark:bg-blue-950/30"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                title="Show / Hide Columns"
            >
                <Columns2 size={14} />
                <span>Columns</span>
                {hiddenCount > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#155b96] text-white text-[10px] font-bold leading-none">
                        {hiddenCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg w-52 py-2">
                    {/* Header row */}
                    <div className="flex items-center justify-between px-3 pb-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-100">
                            Tampilkan Kolom
                        </span>
                        <button
                            onClick={toggleAll}
                            className="text-[11px] font-semibold text-[#155b96] dark:text-blue-400 hover:underline"
                        >
                            {allVisible ? "Sembunyikan semua" : "Tampilkan semua"}
                        </button>
                    </div>

                    {toggleable.map((col) => {
                        const isVisible = visible[col.key] !== false;
                        return (
                            <label
                                key={col.key}
                                className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={() => toggle(col.key)}
                                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 accent-[#155b96]"
                                />
                                <span className="text-[13px] text-slate-700 dark:text-slate-100 select-none">
                                    {col.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/**
 * Helper – build initial visible state from ColDef list (all visible by default).
 */
export function initVisible(columns: ColDef[]): Record<string, boolean> {
    return Object.fromEntries(columns.map((c) => [c.key, true]));
}

import type { ReactNode } from "react";

interface StatItem {
    label: string;
    value: string | number;
    icon?: ReactNode;
    color?: "blue" | "emerald" | "red" | "amber" | "purple" | "slate";
}

const COLOR_MAP = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
    red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30",
    slate: "text-slate-600 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/50",
};

interface SummaryStatsProps {
    items: StatItem[];
}

// Dynamic column map: mobile always 2-col, sm+ fills exactly N columns
const SM_COLS: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-5",
    6: "grid-cols-3 sm:grid-cols-6",
};

/**
 * Reusable summary stats bar — cards always stretch to fill full container width.
 * Gestalt: Similarity (equal-weight cards) + Uniform Connectedness (shared fill).
 */
export default function SummaryStats({ items }: SummaryStatsProps) {
    const gridCols = SM_COLS[items.length] ?? "grid-cols-2 sm:grid-cols-3";

    return (
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className={`grid ${gridCols} gap-2.5 w-full`}>
                {items.map((item) => {
                    const color = item.color || "blue";
                    return (
                        <div
                            key={item.label}
                            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 w-full ${COLOR_MAP[color]}`}
                        >
                            {item.icon && (
                                <div className="shrink-0 opacity-80">{item.icon}</div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider opacity-70 truncate">
                                    {item.label}
                                </p>
                                <p className="text-[16px] font-bold tabular-nums leading-tight">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

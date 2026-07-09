import type { ReactNode, ButtonHTMLAttributes } from "react";

type ActionVariant =
  | "edit"
  | "delete"
  | "view"
  | "print"
  | "send"
  | "script"
  | "info";

const VARIANT_CLASSES: Record<ActionVariant, string> = {
  edit: "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-300",
  delete:
    "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300",
  view: "text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300",
  print:
    "text-slate-500 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200",
  send: "text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300",
  script:
    "text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-300",
  info: "text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300",
};

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ActionVariant;
  children: ReactNode;
  label?: string;
}

/**
 * Reusable icon-only action button with semantic colors.
 * Each variant has a distinct color by default (not just on hover).
 */
export default function ActionButton({
  variant,
  children,
  label,
  disabled,
  className = "",
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={rest.type ?? "button"}
      className={`p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400/40 ${
        disabled ? "opacity-40 cursor-not-allowed" : VARIANT_CLASSES[variant]
      } ${className}`}
      title={label}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

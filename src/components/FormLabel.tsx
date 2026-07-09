import { Info } from "lucide-react";
import Tooltip from "./Tooltip";

interface FormLabelProps {
  /** The visible label text */
  label: string;
  /** Whether the field is required (shows red asterisk) */
  required?: boolean;
  /** Tooltip helper text — when provided, an ℹ icon appears next to the label */
  tooltip?: string;
  /** HTML `for` attribute linking to an input */
  htmlFor?: string;
}

/**
 * Reusable form label with optional info-icon tooltip.
 * Provides consistent label styling + accessible tooltips across all Add forms.
 */
export default function FormLabel({
  label,
  required,
  tooltip,
  htmlFor,
}: FormLabelProps) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[12px] font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
      </label>
      {tooltip && (
        <Tooltip content={tooltip}>
          <button
            type="button"
            tabIndex={0}
            className="text-slate-400 hover:text-[#155b96] dark:text-slate-500 dark:hover:text-blue-400 transition-all focus:outline-none rounded-full focus:ring-2 focus:ring-[#155b96]/30 flex items-center justify-center"
            aria-label={`Info: ${label}`}
          >
            <Info size={14} strokeWidth={2} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
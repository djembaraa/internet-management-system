import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: "top" | "right" | "bottom";
}

/**
 * Reusable Tooltip component — renders via Portal to escape overflow clipping.
 *
 * Features:
 * - Portal: renders in document.body so it's never clipped by overflow:hidden
 * - Auto-flip: if not enough space above (top), flips to right or bottom
 * - Desktop: shows on hover + focus (keyboard accessible)
 * - Mobile: shows on tap/click, hides on outside tap
 * - Dismiss on Escape key
 * - Dark theme styling
 */
export default function Tooltip({
    content,
    children,
    position = "top",
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [placement, setPlacement] = useState(position);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const calcPosition = useCallback(() => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const MARGIN = 8;
        const TOOLTIP_H = 40; // estimated tooltip height

        // Check if there's enough space above
        const spaceAbove = rect.top;
        const spaceRight = window.innerWidth - rect.right;

        let finalPlacement = position;
        if (position === "top" && spaceAbove < TOOLTIP_H + MARGIN) {
            finalPlacement = spaceRight > 230 ? "right" : "bottom";
        }

        setPlacement(finalPlacement);

        let x: number, y: number;
        switch (finalPlacement) {
            case "right":
                x = rect.right + MARGIN;
                y = rect.top + rect.height / 2;
                break;
            case "bottom":
                x = rect.left + rect.width / 2;
                y = rect.bottom + MARGIN;
                break;
            case "top":
            default:
                x = rect.left + rect.width / 2;
                y = rect.top - MARGIN;
                break;
        }
        setCoords({ x, y });
    }, [position]);

    const show = () => {
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
        calcPosition();
        setVisible(true);
    };
    const hide = () => {
        timeoutRef.current = setTimeout(() => setVisible(false), 120);
    };
    const toggle = () => {
        if (visible) {
            setVisible(false);
        } else {
            calcPosition();
            setVisible(true);
        }
    };

    // Close on outside click (mobile tap-away) + Escape key
    useEffect(() => {
        if (!visible) return;
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setVisible(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [visible]);

    // Recalc on scroll/resize while visible
    useEffect(() => {
        if (!visible) return;
        const update = () => calcPosition();
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [visible, calcPosition]);

    // Placement-specific transform styles
    const getTransformStyle = (): React.CSSProperties => {
        switch (placement) {
            case "right":
                return { left: coords.x, top: coords.y, transform: "translateY(-50%)" };
            case "bottom":
                return { left: coords.x, top: coords.y, transform: "translateX(-50%)" };
            case "top":
            default:
                return { left: coords.x, top: coords.y, transform: "translate(-50%, -100%)" };
        }
    };

    const arrowClasses =
        placement === "top"
            ? "top-full left-1/2 -translate-x-1/2 border-t-slate-800 dark:border-t-slate-700 border-x-transparent border-b-transparent border-[5px]"
            : placement === "right"
                ? "right-full top-1/2 -translate-y-1/2 border-r-slate-800 dark:border-r-slate-700 border-y-transparent border-l-transparent border-[5px]"
                : "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 dark:border-b-slate-700 border-x-transparent border-t-transparent border-[5px]";

    return (
        <div
            ref={wrapperRef}
            className="relative inline-flex items-center"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
            onClick={toggle}
        >
            {children}
            {visible &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className="fixed pointer-events-none"
                        style={{ ...getTransformStyle(), zIndex: 9999 }}
                        role="tooltip"
                    >
                        <div className="bg-slate-800 dark:bg-slate-700 text-white text-[11px] leading-relaxed px-3 py-1.5 rounded-lg shadow-lg max-w-55 whitespace-normal">
                            {content}
                        </div>
                        <div className={`absolute w-0 h-0 ${arrowClasses}`} />
                    </div>,
                    document.body
                )}
        </div>
    );
}

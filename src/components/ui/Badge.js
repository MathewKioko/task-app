import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from "clsx";
export const Badge = ({ variant = "default", className, children, ...props }) => {
    return (_jsx("span", { className: clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", "transition-colors duration-150", {
            "bg-primary/5 text-primary-700 ring-primary/10 dark:bg-primary/10 dark:text-primary-400 dark:ring-primary/20": variant === "default",
            "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20": variant === "success",
            "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20": variant === "warning",
            "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20": variant === "error",
            "bg-neutral-100 text-neutral-700 ring-neutral-300/50 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/50": variant === "neutral",
        }, className), ...props, children: children }));
};

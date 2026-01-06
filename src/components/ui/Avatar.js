import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from "clsx";
export const Avatar = ({ src, alt, fallback, className, ...props }) => {
    return (_jsx("div", { className: clsx("relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full", "bg-neutral-200 dark:bg-neutral-700", className), ...props, children: src ? (_jsx("img", { src: src, alt: alt, className: "h-full w-full object-cover" })) : (_jsx("span", { className: "text-xs font-medium text-neutral-600 dark:text-neutral-300", children: fallback || "?" })) }));
};

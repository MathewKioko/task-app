import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { clsx } from "clsx";
export const Tooltip = ({ content, children, className, ...props }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (_jsxs("div", { className: "relative inline-flex", onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), ...props, children: [children, isVisible && (_jsxs("div", { className: clsx("absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap", "rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg", "dark:bg-neutral-700", className), role: "tooltip", children: [content, _jsx("div", { className: "absolute left-1/2 top-full -translate-x-1/2", children: _jsx("div", { className: "border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-700" }) })] }))] }));
};

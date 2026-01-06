import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
export const Modal = ({ isOpen, onClose, title, children, className, ...props }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": title ? "modal-title" : undefined, children: [_jsx("div", { className: "absolute inset-0 bg-black/50 dark:bg-black/70 transition-opacity", onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { className: clsx("relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg", "dark:bg-neutral-900", "animate-in fade-in-0 zoom-in-95 duration-200", className), ...props, children: [title && (_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h2", { id: "modal-title", className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50", children: title }), _jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 transition-colors duration-150", "aria-label": "Close modal", children: _jsx(X, { className: "h-5 w-5" }) })] })), _jsx("div", { children: children })] })] }));
};

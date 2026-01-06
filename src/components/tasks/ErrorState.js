import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
export const ErrorState = ({ title = "Something went wrong", message = "Please try again later", onRetry, className, ...props }) => {
    return (_jsxs("div", { className: clsx("flex flex-col items-center justify-center py-16 px-4 text-center", className), role: "alert", ...props, children: [_jsx("div", { className: "rounded-xl bg-red-100 p-6 dark:bg-red-900/30", children: _jsx(AlertCircle, { className: "h-12 w-12 text-error" }) }), _jsx("h3", { className: "mt-6 text-lg font-semibold text-neutral-900 dark:text-neutral-50", children: title }), _jsx("p", { className: "mt-2 text-sm text-neutral-500 dark:text-neutral-400", children: message }), onRetry && (_jsx(Button, { onClick: onRetry, variant: "secondary", className: "mt-6", children: "Try Again" }))] }));
};

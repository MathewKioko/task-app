import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { LayoutDashboard, ListTodo, List, Calendar, Settings, Menu, } from "lucide-react";
const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "tasks", icon: ListTodo, label: "Tasks" },
    { id: "lists", icon: List, label: "Lists" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "settings", icon: Settings, label: "Settings" },
];
export const Sidebar = ({ isCollapsed = false, onToggleCollapse, currentNav = "tasks", onNavChange, className, ...props }) => {
    return (_jsxs("aside", { className: clsx("flex flex-col border-r bg-white dark:bg-neutral-900", "border-neutral-200 dark:border-neutral-800", "transition-all duration-300 ease-in-out", isCollapsed ? "w-[72px]" : "w-64", className), ...props, children: [_jsx("div", { className: "flex h-16 items-center border-b border-neutral-200 px-4 dark:border-neutral-800", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-600 shadow-sm", children: _jsx(ListTodo, { className: "h-5 w-5 text-white", strokeWidth: 2.5 }) }), !isCollapsed && (_jsx("span", { className: "text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", children: "Tasks" }))] }) }), _jsx("nav", { className: "flex-1 space-y-1 p-3", "aria-label": "Main navigation", children: navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentNav === item.id;
                    return (_jsxs("button", { onClick: () => onNavChange?.(item.id), className: clsx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900", isActive
                            ? "bg-primary/10 text-primary shadow-sm dark:bg-primary/20"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.98] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"), "aria-current": isActive ? "page" : undefined, children: [_jsx(Icon, { className: clsx("h-5 w-5 shrink-0", isActive ? "stroke-[2.5px]" : "") }), !isCollapsed && _jsx("span", { children: item.label })] }, item.id));
                }) }), _jsx("div", { className: "border-t border-neutral-200 p-3 dark:border-neutral-800", children: _jsxs("button", { onClick: onToggleCollapse, className: "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 active:scale-[0.98]", "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar", children: [_jsx(Menu, { className: "h-5 w-5 shrink-0" }), !isCollapsed && _jsx("span", { children: "Collapse" })] }) })] }));
};

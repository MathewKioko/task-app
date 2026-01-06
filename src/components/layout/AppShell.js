import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { clsx } from "clsx";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
export const AppShell = ({ children, user, currentTheme = "light", onThemeToggle, currentNav = "tasks", onNavChange, onAddTask, onSearch, className, ...props }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    return (_jsxs("div", { className: clsx("flex h-screen overflow-hidden", className), ...props, children: [_jsx(Sidebar, { isCollapsed: isSidebarCollapsed, onToggleCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed), currentNav: currentNav, onNavChange: onNavChange }), _jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [_jsx(Header, { user: user, currentTheme: currentTheme, onThemeToggle: onThemeToggle, onAddTask: onAddTask, onSearch: onSearch }), _jsx("main", { className: "flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-900", children: children })] })] }));
};

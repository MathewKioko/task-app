import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Checkbox } from "../ui/Checkbox";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
export const SettingsPage = ({ className, currentTheme = "light", onThemeToggle, ...props }) => {
    // Local state for settings
    const [defaultPriority, setDefaultPriority] = useState("medium");
    const [startWeekOn, setStartWeekOn] = useState("monday");
    const [enableAnimations, setEnableAnimations] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [notifications, setNotifications] = useState(true);
    // Confirmation dialog state
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    // Priority options
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];
    // Week start options
    const weekStartOptions = [
        { value: "monday", label: "Monday" },
        { value: "sunday", label: "Sunday" },
    ];
    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("task-app-settings");
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                setDefaultPriority(settings.defaultPriority || "medium");
                setStartWeekOn(settings.startWeekOn || "monday");
                setEnableAnimations(settings.enableAnimations !== false);
                setAutoSave(settings.autoSave !== false);
                setNotifications(settings.notifications !== false);
            }
            catch (error) {
                console.error("Failed to load settings:", error);
            }
        }
    }, []);
    // Save settings to localStorage
    const saveSettings = () => {
        const settings = {
            defaultPriority,
            startWeekOn,
            enableAnimations,
            autoSave,
            notifications,
        };
        localStorage.setItem("task-app-settings", JSON.stringify(settings));
    };
    // Handle setting changes
    const handlePriorityChange = (value) => {
        setDefaultPriority(value);
        saveSettings();
    };
    const handleWeekStartChange = (value) => {
        setStartWeekOn(value);
        saveSettings();
    };
    const handleAnimationsChange = (event) => {
        setEnableAnimations(event.target.checked);
        saveSettings();
    };
    const handleAutoSaveChange = (event) => {
        setAutoSave(event.target.checked);
        saveSettings();
    };
    const handleNotificationsChange = (event) => {
        setNotifications(event.target.checked);
        saveSettings();
    };
    // Handle clear data
    const handleClearData = () => {
        // Clear all localStorage data
        localStorage.clear();
        // Reload the page to reset all state
        window.location.reload();
    };
    // Handle export data
    const handleExportData = () => {
        // Get all data from localStorage
        const tasks = localStorage.getItem("tasks");
        const lists = localStorage.getItem("lists");
        const settings = localStorage.getItem("task-app-settings");
        // Create export object
        const exportData = {
            tasks: tasks ? JSON.parse(tasks) : [],
            lists: lists ? JSON.parse(lists) : [],
            settings: settings ? JSON.parse(settings) : {},
            exportDate: new Date().toISOString(),
            version: "1.0.0"
        };
        // Create download
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `task-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        // Clean up
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: clsx("flex flex-col h-full", className), ...props, children: [_jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsx("h1", { className: "text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", children: "Settings" }) }), _jsx("div", { className: "flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "General" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2", children: "Default Task Priority" }), _jsx(Dropdown, { options: priorityOptions, value: defaultPriority, onChange: handlePriorityChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2", children: "Start Week On" }), _jsx(Dropdown, { options: weekStartOptions, value: startWeekOn, onChange: handleWeekStartChange })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "Appearance" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Theme" }), _jsxs("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: ["Current: ", currentTheme === "light" ? "Light" : "Dark"] })] }), _jsx(Button, { onClick: onThemeToggle, variant: "secondary", children: "Toggle Theme" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Enable Animations" }), _jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Smooth transitions and hover effects" })] }), _jsx(Checkbox, { checked: enableAnimations, onChange: handleAnimationsChange })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "Behavior" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Auto Save" }), _jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Automatically save changes as you work" })] }), _jsx(Checkbox, { checked: autoSave, onChange: handleAutoSaveChange })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Desktop Notifications" }), _jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Show notifications for task reminders" })] }), _jsx(Checkbox, { checked: notifications, onChange: handleNotificationsChange })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "Data Management" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Clear All Data" }), _jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Remove all tasks, lists, and settings" })] }), _jsx(Button, { variant: "destructive", size: "sm", onClick: () => setShowClearDialog(true), children: "Clear Data" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Export Data" }), _jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: "Download your tasks and lists as JSON" })] }), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => setShowExportDialog(true), children: "Export" })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "App Information" }), _jsxs("div", { className: "space-y-2 text-sm text-neutral-600 dark:text-neutral-400", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Version" }), _jsx("span", { children: "1.0.0" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Storage" }), _jsx("span", { children: "Local Storage" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Last Updated" }), _jsx("span", { children: new Date().toLocaleDateString() })] })] })] })] }) }), _jsx(ConfirmationDialog, { isOpen: showClearDialog, onClose: () => setShowClearDialog(false), onConfirm: handleClearData, title: "Clear All Data", message: "This will permanently delete all your tasks, lists, and settings. This action cannot be undone.", confirmText: "Clear All Data", cancelText: "Cancel", variant: "danger" }), _jsx(ConfirmationDialog, { isOpen: showExportDialog, onClose: () => setShowExportDialog(false), onConfirm: handleExportData, title: "Export Data", message: "Your data will be exported as a JSON file. This includes all tasks, lists, and settings.", confirmText: "Export Data", cancelText: "Cancel", variant: "info" })] }));
};

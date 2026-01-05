import { type HTMLAttributes, useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Checkbox } from "../ui/Checkbox";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import type { ThemeMode } from "../../types";

export interface SettingsPageProps extends HTMLAttributes<HTMLDivElement> {
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
}

export const SettingsPage = ({
  className,
  currentTheme = "light",
  onThemeToggle,
  ...props
}: SettingsPageProps) => {
  // Local state for settings
  const [defaultPriority, setDefaultPriority] = useState<"low" | "medium" | "high">("medium");
  const [startWeekOn, setStartWeekOn] = useState<"monday" | "sunday">("monday");
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
      } catch (error) {
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
  const handlePriorityChange = (value: string) => {
    setDefaultPriority(value as "low" | "medium" | "high");
    saveSettings();
  };

  const handleWeekStartChange = (value: string) => {
    setStartWeekOn(value as "monday" | "sunday");
    saveSettings();
  };

  const handleAnimationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnableAnimations(event.target.checked);
    saveSettings();
  };

  const handleAutoSaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSave(event.target.checked);
    saveSettings();
  };

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className={clsx("flex flex-col h-full", className)} {...props}>
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              General
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Default Task Priority
                </label>
                <Dropdown
                  options={priorityOptions}
                  value={defaultPriority}
                  onChange={handlePriorityChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Start Week On
                </label>
                <Dropdown
                  options={weekStartOptions}
                  value={startWeekOn}
                  onChange={handleWeekStartChange}
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Theme
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Current: {currentTheme === "light" ? "Light" : "Dark"}
                  </p>
                </div>
                <Button onClick={onThemeToggle} variant="secondary">
                  Toggle Theme
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Enable Animations
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Smooth transitions and hover effects
                  </p>
                </div>
                <Checkbox
                  checked={enableAnimations}
                  onChange={handleAnimationsChange}
                />
              </div>
            </div>
          </div>

          {/* Behavior Settings */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Behavior
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Auto Save
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Automatically save changes as you work
                  </p>
                </div>
                <Checkbox
                  checked={autoSave}
                  onChange={handleAutoSaveChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Desktop Notifications
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Show notifications for task reminders
                  </p>
                </div>
                <Checkbox
                  checked={notifications}
                  onChange={handleNotificationsChange}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Clear All Data
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Remove all tasks, lists, and settings
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowClearDialog(true)}
                >
                  Clear Data
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Export Data
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Download your tasks and lists as JSON
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowExportDialog(true)}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              App Information
            </h2>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Storage</span>
                <span>Local Storage</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="This will permanently delete all your tasks, lists, and settings. This action cannot be undone."
        confirmText="Clear All Data"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onConfirm={handleExportData}
        title="Export Data"
        message="Your data will be exported as a JSON file. This includes all tasks, lists, and settings."
        confirmText="Export Data"
        cancelText="Cancel"
        variant="info"
      />
    </div>
  );
};
import { useState, useEffect, useCallback } from "react";
import { AppShell } from "./components/layout/AppShell";
import { TasksPage } from "./components/tasks/TasksPage";
import type { NavId, ThemeMode } from "./types";

function App() {
  const [currentNav, setCurrentNav] = useState<NavId>("tasks");
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("light");
  const [searchQuery, setSearchQuery] = useState("");

  // Theme toggle handler
  const handleThemeToggle = useCallback(() => {
    setCurrentTheme(prev => prev === "light" ? "dark" : "light");
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currentTheme]);

  return (
    <AppShell
      currentNav={currentNav}
      onNavChange={setCurrentNav}
      currentTheme={currentTheme}
      onThemeToggle={handleThemeToggle}
      onSearch={setSearchQuery}
    >
      {currentNav === "tasks" && (
        <TasksPage />
      )}
      {currentNav === "dashboard" && (
        <DashboardPlaceholder currentTheme={currentTheme} />
      )}
      {currentNav === "lists" && (
        <ListsPlaceholder currentTheme={currentTheme} />
      )}
      {currentNav === "calendar" && (
        <CalendarPlaceholder currentTheme={currentTheme} />
      )}
      {currentNav === "settings" && (
        <SettingsPlaceholder currentTheme={currentTheme} />
      )}
    </AppShell>
  );
}

// Placeholder components for other pages
function DashboardPlaceholder({ currentTheme }: { currentTheme: ThemeMode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Dashboard
        </h1>
      </div>
      <div className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Tasks" value="12" currentTheme={currentTheme} />
          <StatCard title="Completed" value="5" currentTheme={currentTheme} />
          <StatCard title="Pending" value="7" currentTheme={currentTheme} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, currentTheme }: { title: string; value: string; currentTheme: ThemeMode }) {
  return (
    <div className={`rounded-xl border p-6 ${currentTheme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}>
      <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50">{value}</p>
    </div>
  );
}

function ListsPlaceholder({ currentTheme }: { currentTheme: ThemeMode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Lists
        </h1>
      </div>
      <div className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-950">
        <p className="text-neutral-500 dark:text-neutral-400">Your task lists will appear here.</p>
      </div>
    </div>
  );
}

function CalendarPlaceholder({ currentTheme }: { currentTheme: ThemeMode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Calendar
        </h1>
      </div>
      <div className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-950">
        <p className="text-neutral-500 dark:text-neutral-400">Calendar view coming soon.</p>
      </div>
    </div>
  );
}

function SettingsPlaceholder({ currentTheme }: { currentTheme: ThemeMode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Settings
        </h1>
      </div>
      <div className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-950">
        <p className="text-neutral-500 dark:text-neutral-400">Settings panel coming soon.</p>
      </div>
    </div>
  );
}

export default App;


import { useState, useEffect, useCallback } from "react";
import { AppShell } from "./components/layout/AppShell";
import { TasksPage } from "./components/tasks/TasksPage";
import { ListsPage } from "./components/lists/ListsPage";
import { CalendarPage } from "./components/calendar/CalendarPage";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { SettingsPage } from "./components/settings/SettingsPage";
import type { NavId, ThemeMode } from "./types";

function App() {
  const [currentNav, setCurrentNav] = useState<NavId>("tasks");
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

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

  // Handler for add task from Dashboard or Calendar
  const handleAddTask = useCallback(() => {
    setCurrentNav("tasks");
    setShouldOpenModal(true);
  }, []);

  // Reset shouldOpenModal when we're not on tasks page
  useEffect(() => {
    if (currentNav !== "tasks") {
      setShouldOpenModal(false);
    }
  }, [currentNav]);

  return (
    <AppShell
      currentNav={currentNav}
      onNavChange={setCurrentNav}
      currentTheme={currentTheme}
      onThemeToggle={handleThemeToggle}
      onSearch={setSearchQuery}
    >
      {currentNav === "tasks" && (
        <TasksPage
          searchQuery={searchQuery}
          autoOpenModal={shouldOpenModal}
          onAddTask={() => setShouldOpenModal(true)}
        />
      )}

      {currentNav === "dashboard" && (
        <DashboardPage onAddTask={handleAddTask} />
      )}
      {currentNav === "lists" && (
        <ListsPage />
      )}
      {currentNav === "calendar" && (
        <CalendarPage onAddTask={handleAddTask} />
      )}
      {currentNav === "settings" && (
        <SettingsPage currentTheme={currentTheme} onThemeToggle={handleThemeToggle} />
      )}
    </AppShell>
  );
}


export default App;

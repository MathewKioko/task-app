import { type ReactNode, type HTMLAttributes, useState } from "react";
import { clsx } from "clsx";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { User, ThemeMode, NavId } from "../../types";

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  user?: User;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
  currentNav?: NavId;
  onNavChange?: (id: NavId) => void;
  onAddTask?: () => void;
  onSearch?: (query: string) => void;
}

export const AppShell = ({
  children,
  user,
  currentTheme = "light",
  onThemeToggle,
  currentNav = "tasks",
  onNavChange,
  onAddTask,
  onSearch,
  className,
  ...props
}: AppShellProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div
      className={clsx("flex h-screen overflow-hidden", className)}
      {...props}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentNav={currentNav}
        onNavChange={onNavChange}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          currentTheme={currentTheme}
          onThemeToggle={onThemeToggle}
          onAddTask={onAddTask}
          onSearch={onSearch}
        />

        <main className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  listId: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface List {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type NavId =
  | "dashboard"
  | "tasks"
  | "lists"
  | "calendar"
  | "settings";

export type ThemeMode = "light" | "dark";

// Component Props Types
export type ListsPageProps = {
  className?: string;
  onAddList?: () => void;
};

export type CalendarPageProps = {
  className?: string;
  onAddTask?: () => void;
};

export type DashboardPageProps = {
  className?: string;
  onAddTask?: () => void;
};

export type SettingsPageProps = {
  className?: string;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
};

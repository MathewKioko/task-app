import { type HTMLAttributes } from "react";
import { clsx } from "clsx";
import { Search, Sun, Moon } from "lucide-react";
import { Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";
import type { User, ThemeMode } from "../../types";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  user?: User;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
  onAddTask?: () => void;
  onSearch?: (query: string) => void;
}

export const Header = ({
  user,
  currentTheme = "light",
  onThemeToggle,
  onAddTask,
  onSearch,
  className,
  ...props
}: HeaderProps) => {
  return (
    <header
      className={clsx(
        "flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6",
        "border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/80",
        "sticky top-0 z-10 transition-all duration-200",
        className,
      )}
      {...props}
    >
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-10 h-9 bg-neutral-50 dark:bg-neutral-850 border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 focus-visible:bg-white dark:focus-visible:bg-neutral-900 transition-all duration-200"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onThemeToggle}
          className="rounded-lg p-2 text-neutral-500 transition-all hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          aria-label="Toggle theme"
        >
          {currentTheme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        <div className="ml-1">
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            fallback={user?.name?.charAt(0).toUpperCase()}
          />
        </div>
      </div>
    </header>
  );
};

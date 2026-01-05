import { type HTMLAttributes } from "react";
import { clsx } from "clsx";
import { ListTodo, Search } from "lucide-react";
import { Button } from "../ui/Button";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "no-tasks" | "no-results";
  onAction?: () => void;
}

export const EmptyState = ({
  variant = "no-tasks",
  onAction,
  className,
  ...props
}: EmptyStateProps) => {
  const content = {
    "no-tasks": {
      icon: ListTodo,
      title: "No tasks yet",
      description: "Get started by creating your first task",
      actionLabel: "Create Task",
    },
    "no-results": {
      icon: Search,
      title: "No results found",
      description: "Try adjusting your search",
      actionLabel: null,
    },
  };

  const { icon: Icon, title, description, actionLabel } = content[variant];

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-20 px-4 text-center",
        className,
      )}
      {...props}
    >
      <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 shadow-inner dark:from-neutral-850 dark:to-neutral-900">
        <Icon className="h-14 w-14 text-neutral-300 dark:text-neutral-600" strokeWidth={1.5} />
      </div>
      <h3 className="mt-8 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      <p className="mt-2.5 max-w-sm text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-8" size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

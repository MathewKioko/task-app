import { useState } from "react";
import { clsx } from "clsx";
import { Trash2, Edit2, Calendar, Tag } from "lucide-react";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { type Task } from "../../types";
import { getLists } from "../../api/tasks";

export interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onEdit, onToggle, onDelete }: TaskItemProps) => {
  const [listName, setListName] = useState<string | null>(null);

  // Fetch list name for display
  const fetchListName = async () => {
    try {
      const lists = await getLists();
      const list = lists.find((l) => l.id === task.listId);
      setListName(list?.name || "Default");
    } catch (error) {
      console.error("Failed to fetch list:", error);
      setListName("Default");
    }
  };

  // Fetch list name on mount
  fetchListName();

  const list = listName;

  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    low: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
    medium: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
    high: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  };

  return (
    <div
      className={clsx(
        "group flex items-center gap-4 rounded-xl border bg-white p-4 transition-all duration-200",
        "dark:bg-neutral-900 dark:border-neutral-800",
        task.completed
          ? "bg-neutral-50/80 opacity-75 dark:bg-neutral-850/50"
          : "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
        "shadow-xs",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        className="shrink-0"
      />

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2.5">
          <h3
            className={clsx(
              "truncate text-[15px] font-medium leading-tight",
              task.completed
                ? "text-neutral-400 line-through dark:text-neutral-500"
                : "text-neutral-900 dark:text-neutral-50",
            )}
          >
            {task.title}
          </h3>

          {/* Priority badge */}
          <span
            className={clsx(
              "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
              priorityColors[task.priority],
            )}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          {/* List */}
          {list && (
            <span className="flex items-center gap-1.5 font-medium">
              <Tag className="h-3.5 w-3.5" strokeWidth={2} />
              {list}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className={clsx(
          "flex items-center gap-0.5 transition-all duration-200",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Edit task"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 p-0 text-neutral-500 hover:bg-red-50 hover:text-error dark:hover:bg-red-500/10"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};


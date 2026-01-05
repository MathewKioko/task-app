import { clsx } from "clsx";
import { TaskItem } from "./TaskItem";
import type { Task } from "../../types";

export interface TaskListProps {
  tasks: Task[];
  onEditTask?: (taskId: string) => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

export const TaskList = ({
  tasks,
  onEditTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) => {
  // Tasks are already filtered and sorted by TasksPage
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div
      className={clsx(
        "divide-y divide-neutral-200 dark:divide-neutral-800",
      )}
    >
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div>
          <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active ({activeTasks.length})
            </h2>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => onEditTask?.(task.id)}
                onToggle={onToggleTask || (() => {})}
                onDelete={onDeleteTask || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Completed ({completedTasks.length})
            </h2>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => onEditTask?.(task.id)}
                onToggle={onToggleTask || (() => {})}
                onDelete={onDeleteTask || (() => {})}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


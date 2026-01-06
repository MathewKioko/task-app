import { type HTMLAttributes, useState, useCallback, useMemo, useEffect } from "react";
import { clsx } from "clsx";
import { TaskList } from "./TaskList";
import { TaskModal } from "./TaskModal";
import { EmptyState } from "./EmptyState";
import { useTasks, useLists, useTaskActions } from "../../features/tasks/selectors";

export interface TasksPageProps extends HTMLAttributes<HTMLDivElement> {
  onEditTask?: (taskId: string) => void;
  onAddTask?: () => void;
  searchQuery?: string;
  autoOpenModal?: boolean;
}

export const TasksPage = ({
  className,
  onEditTask,
  onAddTask,
  searchQuery,
  autoOpenModal,
  ...props
}: TasksPageProps) => {
  // Use Zustand store
  const tasks = useTasks();
  const lists = useLists();
  const { updateTask, deleteTask } = useTaskActions();

  // State for UI
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [listId, setListId] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "none">("none");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const effectiveSearchQuery = searchQuery || localSearchQuery;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>(undefined);

  // Auto-open modal when component mounts with autoOpenModal prop
  useEffect(() => {
    if (autoOpenModal && !isModalOpen) {
      handleOpenModal();
    }
  }, [autoOpenModal, isModalOpen]);

  // Modal handlers
  const handleOpenModal = useCallback((taskId?: string) => {
    setEditingTaskId(taskId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTaskId(undefined);
  }, []);

  const handleTaskSaved = useCallback(() => {
    // Tasks are automatically updated via Zustand store
    handleCloseModal();
  }, [handleCloseModal]);

  // Task action handlers
  const handleToggleTask = useCallback(async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      await updateTask(id, { completed: !task.completed });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  }, [tasks, updateTask]);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }, [deleteTask]);


  // Apply filters and sorting to tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = [...tasks];

    // Filter by completion status
    switch (filter) {
      case "active":
        filteredTasks = filteredTasks.filter((task) => !task.completed);
        break;
      case "completed":
        filteredTasks = filteredTasks.filter((task) => task.completed);
        break;
      default:
        break;
    }

    // Filter by list
    if (listId) {
      filteredTasks = filteredTasks.filter((task) => task.listId === listId);
    }

    // Search by title
    if (effectiveSearchQuery) {
      const query = effectiveSearchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    // Sort
    const sortedTasks = [...filteredTasks];
    switch (sortBy) {
      case "dueDate":
        sortedTasks.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "priority":
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        sortedTasks.sort(
          (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );
        break;
      default:
        break;
    }

    return sortedTasks;
  }, [tasks, filter, listId, sortBy, effectiveSearchQuery]);


  const hasNoTasks = filteredAndSortedTasks.length === 0;

  return (
    <div className={clsx("flex flex-col h-full", className)} {...props}>
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          My Tasks
        </h1>
      </div>

      {/* Filters Toolbar */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex flex-wrap items-center gap-4">
          {/* Add Task Button */}
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Add Task
          </button>
          
          {/* Filter Tabs */}
          <div className="flex rounded-lg bg-neutral-100 p-1 shadow-inner dark:bg-neutral-850">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                  filter === f
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={clsx(
              "h-9 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium shadow-xs",
              "dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              "transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600",
            )}
          >
            <option value="none">No sorting</option>
            <option value="dueDate">Sort by due date</option>
            <option value="priority">Sort by priority</option>
          </select>

          {/* List Filter */}
          <select
            value={listId || ""}
            onChange={(e) => setListId(e.target.value || undefined)}
            className={clsx(
              "h-9 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium shadow-xs",
              "dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              "transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600",
            )}
          >
            <option value="">All lists</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={effectiveSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className={clsx(
              "h-9 flex-1 min-w-[200px] max-w-xs rounded-lg border bg-neutral-50 px-3.5 py-1.5 text-sm shadow-xs",
              "dark:bg-neutral-850 dark:text-neutral-50 dark:border-neutral-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-white dark:focus-visible:bg-neutral-900",
              "transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600",
              "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50">
        {hasNoTasks ? (
          <EmptyState
            variant="no-tasks"
            onAction={onAddTask || (() => handleOpenModal())}
          />
        ) : (
          <TaskList
            tasks={filteredAndSortedTasks}
            onEditTask={(taskId) => handleOpenModal(taskId)}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskId={editingTaskId}
        task={tasks.find(t => t.id === editingTaskId)}
        mode={editingTaskId ? "edit" : "create"}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};


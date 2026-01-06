import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useEffect } from "react";
import { clsx } from "clsx";
import { TaskList } from "./TaskList";
import { TaskModal } from "./TaskModal";
import { EmptyState } from "./EmptyState";
import { useTasks, useLists, useTaskActions } from "../../features/tasks/selectors";
export const TasksPage = ({ className, onEditTask, onAddTask, searchQuery, autoOpenModal, ...props }) => {
    // Use Zustand store
    const tasks = useTasks();
    const lists = useLists();
    const { updateTask, deleteTask } = useTaskActions();
    // State for UI
    const [filter, setFilter] = useState("all");
    const [listId, setListId] = useState(undefined);
    const [sortBy, setSortBy] = useState("none");
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const effectiveSearchQuery = searchQuery || localSearchQuery;
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(undefined);
    // Auto-open modal when component mounts with autoOpenModal prop
    useEffect(() => {
        if (autoOpenModal && !isModalOpen) {
            handleOpenModal();
        }
    }, [autoOpenModal, isModalOpen]);
    // Modal handlers
    const handleOpenModal = useCallback((taskId) => {
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
    const handleToggleTask = useCallback(async (id) => {
        try {
            const task = tasks.find(t => t.id === id);
            if (!task)
                return;
            await updateTask(id, { completed: !task.completed });
        }
        catch (error) {
            console.error("Failed to toggle task:", error);
        }
    }, [tasks, updateTask]);
    const handleDeleteTask = useCallback(async (id) => {
        try {
            await deleteTask(id);
        }
        catch (error) {
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
            filteredTasks = filteredTasks.filter((task) => task.title.toLowerCase().includes(query));
        }
        // Sort
        const sortedTasks = [...filteredTasks];
        switch (sortBy) {
            case "dueDate":
                sortedTasks.sort((a, b) => {
                    if (!a.dueDate && !b.dueDate)
                        return 0;
                    if (!a.dueDate)
                        return 1;
                    if (!b.dueDate)
                        return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                });
                break;
            case "priority":
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            default:
                break;
        }
        return sortedTasks;
    }, [tasks, filter, listId, sortBy, effectiveSearchQuery]);
    const hasNoTasks = filteredAndSortedTasks.length === 0;
    return (_jsxs("div", { className: clsx("flex flex-col h-full", className), ...props, children: [_jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsx("h1", { className: "text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", children: "My Tasks" }) }), _jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsx("button", { onClick: () => handleOpenModal(), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors", children: "Add Task" }), _jsx("div", { className: "flex rounded-lg bg-neutral-100 p-1 shadow-inner dark:bg-neutral-850", children: ["all", "active", "completed"].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: clsx("px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200", filter === f
                                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50"
                                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"), children: f.charAt(0).toUpperCase() + f.slice(1) }, f))) }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: clsx("h-9 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium shadow-xs", "dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-700", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary", "transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600"), children: [_jsx("option", { value: "none", children: "No sorting" }), _jsx("option", { value: "dueDate", children: "Sort by due date" }), _jsx("option", { value: "priority", children: "Sort by priority" })] }), _jsxs("select", { value: listId || "", onChange: (e) => setListId(e.target.value || undefined), className: clsx("h-9 rounded-lg border bg-white px-3 py-1.5 text-sm font-medium shadow-xs", "dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-700", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary", "transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600"), children: [_jsx("option", { value: "", children: "All lists" }), lists.map((list) => (_jsx("option", { value: list.id, children: list.name }, list.id)))] }), _jsx("input", { type: "text", placeholder: "Search tasks...", value: effectiveSearchQuery, onChange: (e) => setLocalSearchQuery(e.target.value), className: clsx("h-9 flex-1 min-w-[200px] max-w-xs rounded-lg border bg-neutral-50 px-3.5 py-1.5 text-sm shadow-xs", "dark:bg-neutral-850 dark:text-neutral-50 dark:border-neutral-700", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-white dark:focus-visible:bg-neutral-900", "transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600", "placeholder:text-neutral-400 dark:placeholder:text-neutral-500") })] }) }), _jsx("div", { className: "flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50", children: hasNoTasks ? (_jsx(EmptyState, { variant: "no-tasks", onAction: onAddTask || (() => handleOpenModal()) })) : (_jsx(TaskList, { tasks: filteredAndSortedTasks, onEditTask: (taskId) => handleOpenModal(taskId), onToggleTask: handleToggleTask, onDeleteTask: handleDeleteTask })) }), _jsx(TaskModal, { isOpen: isModalOpen, onClose: handleCloseModal, taskId: editingTaskId, task: tasks.find(t => t.id === editingTaskId), mode: editingTaskId ? "edit" : "create", onTaskSaved: handleTaskSaved })] }));
};

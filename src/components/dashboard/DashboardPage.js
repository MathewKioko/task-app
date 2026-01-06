import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { format, isToday, parseISO } from "date-fns";
import { useTasks, useLists } from "../../features/tasks/selectors";
export const DashboardPage = ({ className, onAddTask, ...props }) => {
    // Use Zustand store
    const tasks = useTasks();
    const lists = useLists();
    // Compute statistics
    const stats = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const activeTasks = totalTasks - completedTasks;
        // Overdue tasks (tasks with due date in the past and not completed)
        const overdueTasks = tasks.filter(t => t.dueDate && !t.completed && parseISO(t.dueDate) < new Date()).length;
        // Tasks due today
        const tasksDueToday = tasks.filter(t => t.dueDate && !t.completed && isToday(parseISO(t.dueDate))).length;
        // Tasks by priority
        const tasksByPriority = {
            high: tasks.filter(t => t.priority === "high" && !t.completed).length,
            medium: tasks.filter(t => t.priority === "medium" && !t.completed).length,
            low: tasks.filter(t => t.priority === "low" && !t.completed).length,
        };
        // Tasks by list
        const tasksByList = lists.map(list => {
            const listTasks = tasks.filter(t => t.listId === list.id && !t.completed);
            return {
                ...list,
                taskCount: listTasks.length,
                completedCount: tasks.filter(t => t.listId === list.id && t.completed).length,
            };
        });
        // Recent activity (last 5 tasks created)
        const recentTasks = [...tasks]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
        return {
            totalTasks,
            completedTasks,
            activeTasks,
            overdueTasks,
            tasksDueToday,
            tasksByPriority,
            tasksByList,
            recentTasks,
        };
    }, [tasks, lists]);
    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "text-red-600 dark:text-red-400";
            case "medium": return "text-yellow-600 dark:text-yellow-400";
            case "low": return "text-green-600 dark:text-green-400";
            default: return "text-gray-600 dark:text-gray-400";
        }
    };
    return (_jsxs("div", { className: clsx("flex flex-col h-full", className), ...props, children: [_jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", children: "Dashboard" }), _jsx(Button, { onClick: onAddTask, size: "md", children: _jsx("span", { children: "Add Task" }) })] }) }), _jsx("div", { className: "flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [_jsx(StatCard, { title: "Total Tasks", value: stats.totalTasks, icon: "\uD83D\uDCCB", color: "text-blue-600 dark:text-blue-400" }), _jsx(StatCard, { title: "Active Tasks", value: stats.activeTasks, icon: "\u23F3", color: "text-orange-600 dark:text-orange-400" }), _jsx(StatCard, { title: "Completed", value: stats.completedTasks, icon: "\u2705", color: "text-green-600 dark:text-green-400" }), _jsx(StatCard, { title: "Overdue", value: stats.overdueTasks, icon: "\u26A0\uFE0F", color: "text-red-600 dark:text-red-400" }), _jsx(StatCard, { title: "Due Today", value: stats.tasksDueToday, icon: "\uD83D\uDCC5", color: "text-purple-600 dark:text-purple-400" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "Tasks by Priority" }), _jsx("div", { className: "space-y-3", children: Object.entries(stats.tasksByPriority).map(([priority, count]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: clsx("text-lg", getPriorityColor(priority)), children: priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢" }), _jsx("span", { className: "capitalize font-medium text-neutral-700 dark:text-neutral-300", children: priority })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2", children: _jsx("div", { className: clsx("h-2 rounded-full", getPriorityColor(priority).replace("text-", "bg-")), style: {
                                                                        width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%`
                                                                    } }) }), _jsx("span", { className: "text-sm font-medium text-neutral-600 dark:text-neutral-400", children: count })] })] }, priority))) })] }), _jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "Lists Overview" }), _jsx("div", { className: "space-y-3", children: stats.tasksByList.map((list) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-neutral-900 dark:text-neutral-50", children: list.name }), _jsxs("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: [list.taskCount, " active \u2022 ", list.completedCount, " completed"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-lg font-bold text-neutral-900 dark:text-neutral-50", children: list.taskCount + list.completedCount }), _jsx("div", { className: "text-xs text-neutral-500 dark:text-neutral-400", children: "total" })] })] }, list.id))) })] })] }), _jsxs("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4", children: "Recent Activity" }), stats.recentTasks.length === 0 ? (_jsx("div", { className: "text-center py-8 text-neutral-500 dark:text-neutral-400", children: "No recent tasks. Create your first task to get started!" })) : (_jsx("div", { className: "space-y-3", children: stats.recentTasks.map((task) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: clsx("h-3 w-3 rounded-full", task.priority === "high" ? "bg-red-500" :
                                                            task.priority === "medium" ? "bg-yellow-500" : "bg-green-500") }), _jsxs("div", { children: [_jsx("h4", { className: clsx("font-medium", task.completed && "line-through opacity-50"), children: task.title }), _jsxs("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: [task.completed ? "Completed" : "Created", " \u2022 ", format(new Date(task.createdAt), "MMM d, yyyy")] })] })] }), _jsx("div", { className: "text-right", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200", children: task.completed ? "Done" : "Active" }) })] }, task.id))) }))] })] }) })] }));
};
const StatCard = ({ title, value, icon, color }) => {
    return (_jsx("div", { className: "bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-500 dark:text-neutral-400", children: title }), _jsx("p", { className: clsx("text-2xl font-bold mt-1", color), children: value })] }), _jsx("div", { className: "text-4xl opacity-80", children: icon })] }) }));
};

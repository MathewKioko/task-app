import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useTasks, useLists } from "../../features/tasks/selectors";
export const CalendarPage = ({ className, onAddTask, ...props }) => {
    // Use Zustand store
    const tasks = useTasks();
    const lists = useLists();
    // State for UI
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Calendar calculations
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    // Get all days in the current month view
    const calendarDays = useMemo(() => {
        const days = [];
        let day = new Date(startDate);
        while (day <= endDate) {
            days.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }
        return days;
    }, [startDate, endDate]);
    // Group tasks by date
    const tasksByDate = useMemo(() => {
        const grouped = new Map();
        tasks.forEach(task => {
            if (task.dueDate) {
                const dateKey = new Date(task.dueDate).toDateString();
                if (!grouped.has(dateKey)) {
                    grouped.set(dateKey, []);
                }
                grouped.get(dateKey).push(task);
            }
        });
        return grouped;
    }, [tasks]);
    // Get tasks for a specific date
    const getTasksForDate = useCallback((date) => {
        const dateKey = date.toDateString();
        return tasksByDate.get(dateKey) || [];
    }, [tasksByDate]);
    // Get list name for a task
    const getListName = useCallback((listId) => {
        const list = lists.find(l => l.id === listId);
        return list?.name || "Unknown";
    }, [lists]);
    // Priority color mapping
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-red-500";
            case "medium": return "bg-yellow-500";
            case "low": return "bg-green-500";
            default: return "bg-gray-500";
        }
    };
    // Navigate months
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    // Handle day click
    const handleDayClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };
    // Handle task click
    const handleTaskClick = () => {
        setIsModalOpen(true);
    };
    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };
    return (_jsxs("div", { className: clsx("flex flex-col h-full", className), ...props, children: [_jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", children: "Calendar" }), _jsx(Button, { onClick: onAddTask, size: "md", children: _jsx("span", { children: "Add Task" }) })] }) }), _jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", onClick: handlePrevMonth, size: "sm", children: "Previous" }), _jsx("h2", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50", children: currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }), _jsx(Button, { variant: "ghost", onClick: handleNextMonth, size: "sm", children: "Next" })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("div", { className: "flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400", children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-red-500" }), "High"] }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-yellow-500" }), "Medium"] }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-green-500" }), "Low"] })] }) })] }) }), _jsx("div", { className: "flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (_jsx("div", { className: "p-2 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: calendarDays.map((day, index) => {
                                const dayTasks = getTasksForDate(day);
                                const isCurrentMonth = day.getMonth() === monthStart.getMonth() && day.getFullYear() === monthStart.getFullYear();
                                const isTodayDay = day.toDateString() === new Date().toDateString();
                                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                                return (_jsxs("div", { className: clsx("min-h-24 p-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md", !isCurrentMonth && "opacity-50", isTodayDay && "ring-2 ring-primary/20 dark:ring-primary/40", isSelected && "ring-2 ring-primary dark:ring-primary"), onClick: () => handleDayClick(day), children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: clsx("text-sm font-medium", !isCurrentMonth ? "text-neutral-400 dark:text-neutral-600" :
                                                        isTodayDay ? "text-primary font-bold" : "text-neutral-900 dark:text-neutral-50"), children: day.getDate() }), dayTasks.length > 0 && (_jsx("span", { className: "text-xs text-neutral-500 dark:text-neutral-400", children: dayTasks.length }))] }), _jsxs("div", { className: "space-y-1", children: [dayTasks.slice(0, 3).map((task) => (_jsxs("div", { className: clsx("p-1 rounded text-xs truncate", task.completed ? "opacity-50 line-through" : "", "hover:bg-neutral-50 dark:hover:bg-neutral-800"), onClick: (e) => {
                                                        e.stopPropagation();
                                                        handleTaskClick();
                                                    }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: clsx("h-2 w-2 rounded-full", getPriorityColor(task.priority)) }), _jsx("span", { className: "text-neutral-700 dark:text-neutral-300", children: task.title })] }), _jsx("div", { className: "text-xs text-neutral-500 dark:text-neutral-400 ml-4", children: getListName(task.listId) })] }, task.id))), dayTasks.length > 3 && (_jsxs("div", { className: "text-xs text-neutral-500 dark:text-neutral-400 text-center pt-1 border-t border-neutral-200 dark:border-neutral-800", children: ["+", dayTasks.length - 3, " more"] }))] })] }, index));
                            }) })] }) }), _jsx(Modal, { isOpen: isModalOpen, onClose: handleCloseModal, title: selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "Task Details", children: _jsxs("div", { className: "space-y-4", children: [selectedDate && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50", children: ["Tasks for ", selectedDate?.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })] }), _jsx(Button, { onClick: () => onAddTask?.(), size: "sm", children: "Add Task" })] }), getTasksForDate(selectedDate).length === 0 ? (_jsx("div", { className: "text-center py-8 text-neutral-500 dark:text-neutral-400", children: "No tasks scheduled for this day." })) : (_jsx("div", { className: "space-y-3 max-h-64 overflow-y-auto", children: getTasksForDate(selectedDate).map((task) => (_jsxs("div", { className: clsx("p-3 rounded-lg border border-neutral-200 dark:border-neutral-800", "hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: clsx("h-3 w-3 rounded-full", getPriorityColor(task.priority)) }), _jsxs("div", { children: [_jsx("h4", { className: clsx("font-medium", task.completed && "line-through opacity-50"), children: task.title }), _jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400", children: getListName(task.listId) })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [task.completed && (_jsx("span", { className: "px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full", children: "Completed" })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleTaskClick(), children: "View" })] })] }), task.description && (_jsx("p", { className: "mt-2 text-sm text-neutral-600 dark:text-neutral-400", children: task.description }))] }, task.id))) }))] })), _jsx("div", { className: "flex justify-end pt-4", children: _jsx(Button, { onClick: handleCloseModal, children: "Close" }) })] }) })] }));
};

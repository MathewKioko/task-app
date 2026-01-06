import { type HTMLAttributes, useState, useMemo, useCallback } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useTasks, useLists } from "../../features/tasks/selectors";
import type { Task } from "../../types";

export interface CalendarPageProps extends HTMLAttributes<HTMLDivElement> {
  onAddTask?: () => void;
}

export const CalendarPage = ({
  className,
  onAddTask,
  ...props
}: CalendarPageProps) => {
  // Use Zustand store
  const tasks = useTasks();
  const lists = useLists();

  // State for UI
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
    const grouped = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = new Date(task.dueDate).toDateString();
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date) => {
    const dateKey = date.toDateString();
    return tasksByDate.get(dateKey) || [];
  }, [tasksByDate]);

  // Get list name for a task
  const getListName = useCallback((listId: string) => {
    const list = lists.find(l => l.id === listId);
    return list?.name || "Unknown";
  }, [lists]);

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
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
  const handleDayClick = (date: Date) => {
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

  return (
    <div className={clsx("flex flex-col h-full", className)} {...props}>
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Calendar
          </h1>
          <Button onClick={onAddTask} size="md">
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handlePrevMonth} size="sm">
              Previous
            </Button>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="ghost" onClick={handleNextMonth} size="sm">
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                High
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                Medium
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Low
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Week Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentMonth = day.getMonth() === monthStart.getMonth() && day.getFullYear() === monthStart.getFullYear();
              const isTodayDay = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  className={clsx(
                    "min-h-24 p-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                    !isCurrentMonth && "opacity-50",
                    isTodayDay && "ring-2 ring-primary/20 dark:ring-primary/40",
                    isSelected && "ring-2 ring-primary dark:ring-primary"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={clsx(
                        "text-sm font-medium",
                        !isCurrentMonth ? "text-neutral-400 dark:text-neutral-600" :
                        isTodayDay ? "text-primary font-bold" : "text-neutral-900 dark:text-neutral-50"
                      )}
                    >
                      {day.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={clsx(
                          "p-1 rounded text-xs truncate",
                          task.completed ? "opacity-50 line-through" : "",
                          "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className={clsx("h-2 w-2 rounded-full", getPriorityColor(task.priority))}></span>
                          <span className="text-neutral-700 dark:text-neutral-300">{task.title}</span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 ml-4">
                          {getListName(task.listId)}
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center pt-1 border-t border-neutral-200 dark:border-neutral-800">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "Task Details"}
      >
        <div className="space-y-4">
          {selectedDate && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  Tasks for {selectedDate?.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <Button onClick={() => onAddTask?.()} size="sm">
                  Add Task
                </Button>
              </div>
              
              {getTasksForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  No tasks scheduled for this day.
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {getTasksForDate(selectedDate).map((task) => (
                    <div
                      key={task.id}
                      className={clsx(
                        "p-3 rounded-lg border border-neutral-200 dark:border-neutral-800",
                        "hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={clsx("h-3 w-3 rounded-full", getPriorityColor(task.priority))}></span>
                          <div>
                            <h4 className={clsx("font-medium", task.completed && "line-through opacity-50")}>
                              {task.title}
                            </h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {getListName(task.listId)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.completed && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                              Completed
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTaskClick()}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
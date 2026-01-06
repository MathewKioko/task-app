import { type HTMLAttributes, useMemo } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { format, isToday, parseISO } from "date-fns";
import { useTasks, useLists } from "../../features/tasks/selectors";

export interface DashboardPageProps extends HTMLAttributes<HTMLDivElement> {
  onAddTask?: () => void;
}

export const DashboardPage = ({
  className,
  onAddTask,
  ...props
}: DashboardPageProps) => {
  // Use Zustand store
  const tasks = useTasks();
  const lists = useLists();

  // Compute statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    // Overdue tasks (tasks with due date in the past and not completed)
    const overdueTasks = tasks.filter(t => 
      t.dueDate && !t.completed && parseISO(t.dueDate) < new Date()
    ).length;
    
    // Tasks due today
    const tasksDueToday = tasks.filter(t => 
      t.dueDate && !t.completed && isToday(parseISO(t.dueDate))
    ).length;

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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "low": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className={clsx("flex flex-col h-full", className)} {...props}>
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Dashboard
          </h1>
          <Button onClick={onAddTask} size="md">
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon="📋"
              color="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              title="Active Tasks"
              value={stats.activeTasks}
              icon="⏳"
              color="text-orange-600 dark:text-orange-400"
            />
            <StatCard
              title="Completed"
              value={stats.completedTasks}
              icon="✅"
              color="text-green-600 dark:text-green-400"
            />
            <StatCard
              title="Overdue"
              value={stats.overdueTasks}
              icon="⚠️"
              color="text-red-600 dark:text-red-400"
            />
            <StatCard
              title="Due Today"
              value={stats.tasksDueToday}
              icon="📅"
              color="text-purple-600 dark:text-purple-400"
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Tasks by Priority
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={clsx("text-lg", getPriorityColor(priority))}>
                        {priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢"}
                      </span>
                      <span className="capitalize font-medium text-neutral-700 dark:text-neutral-300">
                        {priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className={clsx(
                            "h-2 rounded-full",
                            getPriorityColor(priority).replace("text-", "bg-")
                          )}
                          style={{
                            width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lists Overview */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Lists Overview
              </h3>
              <div className="space-y-3">
                {stats.tasksByList.map((list) => (
                  <div key={list.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                        {list.name}
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {list.taskCount} active • {list.completedCount} completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                        {list.taskCount + list.completedCount}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Recent Activity
            </h3>
            {stats.recentTasks.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                No recent tasks. Create your first task to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={clsx("h-3 w-3 rounded-full", 
                        task.priority === "high" ? "bg-red-500" : 
                        task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                      )}></span>
                      <div>
                        <h4 className={clsx("font-medium", task.completed && "line-through opacity-50")}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {task.completed ? "Completed" : "Created"} • {format(new Date(task.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {task.completed ? "Done" : "Active"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          <p className={clsx("text-2xl font-bold mt-1", color)}>
            {value}
          </p>
        </div>
        <div className="text-4xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};
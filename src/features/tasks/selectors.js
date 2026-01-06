import { useTaskStore } from './store';
// Selector hooks - each returns a single value to avoid object creation
export const useTasks = () => useTaskStore((state) => state.tasks);
export const useLists = () => useTaskStore((state) => state.lists);
// Action hooks - use getState() for stable references
export const useTaskActions = () => {
    const store = useTaskStore.getState();
    return {
        addTask: store.addTask,
        updateTask: store.updateTask,
        deleteTask: store.deleteTask,
        toggleTaskComplete: store.toggleTaskComplete,
    };
};
export const useListActions = () => {
    const store = useTaskStore.getState();
    return {
        addList: store.addList,
        updateList: store.updateList,
        deleteList: store.deleteList,
    };
};
// Selector methods - these read from the store but don't cause re-renders
export const useTaskSelectors = () => {
    const store = useTaskStore.getState();
    return {
        getAllTasks: () => store.tasks,
        getCompletedTasks: () => store.tasks.filter((t) => t.completed),
        getActiveTasks: () => store.tasks.filter((t) => !t.completed),
        getTasksByList: (listId) => store.tasks.filter((t) => t.listId === listId),
        searchTasksByTitle: (query) => store.tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
        getTasksSortedByDueDate: () => [...store.tasks].sort((a, b) => {
            if (!a.dueDate && !b.dueDate)
                return 0;
            if (!a.dueDate)
                return 1;
            if (!b.dueDate)
                return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }),
        getTasksSortedByPriority: () => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return [...store.tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        },
    };
};

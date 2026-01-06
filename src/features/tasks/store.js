import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
const STORAGE_KEY = 'task-store';
const DEFAULT_LIST_ID = 'default-list';
const CURRENT_VERSION = 1;
const getCurrentTimestamp = () => new Date().toISOString();
export const useTaskStore = create()(persist(immer((set, get) => ({
    tasks: [],
    lists: [
        {
            id: DEFAULT_LIST_ID,
            name: 'My Tasks',
            createdAt: getCurrentTimestamp(),
        },
    ],
    addTask: (taskData) => {
        const newTask = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: getCurrentTimestamp(),
        };
        set((state) => {
            state.tasks.push(newTask);
        });
    },
    updateTask: (id, updates) => {
        set((state) => {
            const taskIndex = state.tasks.findIndex((t) => t.id === id);
            if (taskIndex !== -1) {
                Object.assign(state.tasks[taskIndex], updates);
            }
        });
    },
    deleteTask: (id) => {
        set((state) => {
            state.tasks = state.tasks.filter((t) => t.id !== id);
        });
    },
    toggleTaskComplete: (id) => {
        set((state) => {
            const task = state.tasks.find((t) => t.id === id);
            if (task) {
                task.completed = !task.completed;
            }
        });
    },
    addList: (listData) => {
        const newList = {
            ...listData,
            id: crypto.randomUUID(),
            createdAt: getCurrentTimestamp(),
        };
        set((state) => {
            state.lists.push(newList);
        });
    },
    updateList: (id, updates) => {
        set((state) => {
            const listIndex = state.lists.findIndex((l) => l.id === id);
            if (listIndex !== -1) {
                Object.assign(state.lists[listIndex], updates);
            }
        });
    },
    deleteList: (id) => {
        set((state) => {
            if (id === DEFAULT_LIST_ID) {
                return;
            }
            state.lists = state.lists.filter((l) => l.id !== id);
            state.tasks = state.tasks.filter((t) => t.listId !== id);
        });
    },
    // Selectors
    getAllTasks: () => get().tasks,
    getCompletedTasks: () => get().tasks.filter((task) => task.completed),
    getActiveTasks: () => get().tasks.filter((task) => !task.completed),
    getTasksByList: (listId) => get().tasks.filter((task) => task.listId === listId),
    searchTasksByTitle: (query) => get().tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())),
    getTasksSortedByDueDate: () => [...get().tasks].sort((a, b) => {
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
        return [...get().tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    },
})), {
    name: STORAGE_KEY,
    storage: createJSONStorage(() => ({
        getItem: (_name) => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored || null;
            }
            catch {
                return null;
            }
        },
        setItem: (_name, value) => {
            try {
                localStorage.setItem(STORAGE_KEY, value);
            }
            catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        },
        removeItem: (_name) => {
            localStorage.removeItem(STORAGE_KEY);
        },
    })),
    version: CURRENT_VERSION,
    partialize: (state) => ({
        tasks: state.tasks,
        lists: state.lists,
    }),
}));

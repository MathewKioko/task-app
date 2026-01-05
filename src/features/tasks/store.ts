import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Task, List } from '../../types'

const STORAGE_KEY = 'task-store'
const DEFAULT_LIST_ID = 'default-list'
const CURRENT_VERSION = 1
const getCurrentTimestamp = (): string => new Date().toISOString()

type TaskStore = {
  // State
  tasks: Task[]
  lists: List[]

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void

  addList: (list: Omit<List, 'id' | 'createdAt'>) => void
  updateList: (id: string, updates: Partial<Omit<List, 'id' | 'createdAt'>>) => void
  deleteList: (id: string) => void

  // Selectors (for UI compatibility)
  getAllTasks: () => Task[]
  getCompletedTasks: () => Task[]
  getActiveTasks: () => Task[]
  getTasksByList: (listId: string) => Task[]
  searchTasksByTitle: (query: string) => Task[]
  getTasksSortedByDueDate: () => Task[]
  getTasksSortedByPriority: () => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    immer((set, get) => ({
      tasks: [],
      lists: [
        {
          id: DEFAULT_LIST_ID,
          name: 'My Tasks',
          createdAt: getCurrentTimestamp(),
        },
      ],

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: getCurrentTimestamp(),
        }
        set((state) => {
          state.tasks.push(newTask)
        })
      },

      updateTask: (id, updates) => {
        set((state) => {
          const taskIndex = state.tasks.findIndex((t: Task) => t.id === id)
          if (taskIndex !== -1) {
            Object.assign(state.tasks[taskIndex], updates)
          }
        })
      },

      deleteTask: (id) => {
        set((state) => {
          state.tasks = state.tasks.filter((t: Task) => t.id !== id)
        })
      },

      toggleTaskComplete: (id) => {
        set((state) => {
          const task = state.tasks.find((t: Task) => t.id === id)
          if (task) {
            task.completed = !task.completed
          }
        })
      },

      addList: (listData) => {
        const newList: List = {
          ...listData,
          id: crypto.randomUUID(),
          createdAt: getCurrentTimestamp(),
        }
        set((state) => {
          state.lists.push(newList)
        })
      },

      updateList: (id, updates) => {
        set((state) => {
          const listIndex = state.lists.findIndex((l: List) => l.id === id)
          if (listIndex !== -1) {
            Object.assign(state.lists[listIndex], updates)
          }
        })
      },

      deleteList: (id) => {
        set((state) => {
          if (id === DEFAULT_LIST_ID) {
            return
          }
          state.lists = state.lists.filter((l: List) => l.id !== id)
          state.tasks = state.tasks.filter((t: Task) => t.listId !== id)
        })
      },

      // Selectors
      getAllTasks: () => get().tasks,
      getCompletedTasks: () => get().tasks.filter((task: Task) => task.completed),
      getActiveTasks: () => get().tasks.filter((task: Task) => !task.completed),
      getTasksByList: (listId: string) => get().tasks.filter((task: Task) => task.listId === listId),
      searchTasksByTitle: (query: string) =>
        get().tasks.filter((task: Task) => task.title.toLowerCase().includes(query.toLowerCase())),
      getTasksSortedByDueDate: () =>
        [...get().tasks].sort((a: Task, b: Task) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }),
      getTasksSortedByPriority: () => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return [...get().tasks].sort(
          (a: Task, b: Task) => priorityOrder[b.priority] - priorityOrder[a.priority]
        )
      },
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (_name: string): string | null => {
          try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored || null
          } catch {
            return null
          }
        },
        setItem: (_name: string, value: string): void => {
          try {
            localStorage.setItem(STORAGE_KEY, value)
          } catch (error) {
            console.error('Failed to save to localStorage:', error)
          }
        },
        removeItem: (_name: string): void => {
          localStorage.removeItem(STORAGE_KEY)
        },
      })),
      version: CURRENT_VERSION,
      partialize: (state) => ({
        tasks: state.tasks,
        lists: state.lists,
      }),
    }
  )
)



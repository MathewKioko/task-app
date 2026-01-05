import type { Task } from '../../types'
import { useTaskStore } from './store'

// Selector hooks - each returns a single value to avoid object creation
export const useTasks = () => useTaskStore((state) => state.tasks)
export const useLists = () => useTaskStore((state) => state.lists)

// Action hooks - use getState() for stable references
export const useTaskActions = () => {
  const store = useTaskStore.getState()
  return {
    addTask: store.addTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    toggleTaskComplete: store.toggleTaskComplete,
  }
}

export const useListActions = () => {
  const store = useTaskStore.getState()
  return {
    addList: store.addList,
    updateList: store.updateList,
    deleteList: store.deleteList,
  }
}

// Selector methods - these read from the store but don't cause re-renders
export const useTaskSelectors = () => {
  const store = useTaskStore.getState()
  return {
    getAllTasks: () => store.tasks,
    getCompletedTasks: () => store.tasks.filter((t: Task) => t.completed),
    getActiveTasks: () => store.tasks.filter((t: Task) => !t.completed),
    getTasksByList: (listId: string) => store.tasks.filter((t: Task) => t.listId === listId),
    searchTasksByTitle: (query: string) =>
      store.tasks.filter((t: Task) => t.title.toLowerCase().includes(query.toLowerCase())),
    getTasksSortedByDueDate: () =>
      [...store.tasks].sort((a: Task, b: Task) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }),
    getTasksSortedByPriority: () => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return [...store.tasks].sort(
        (a: Task, b: Task) => priorityOrder[b.priority] - priorityOrder[a.priority]
      )
    },
  }
}


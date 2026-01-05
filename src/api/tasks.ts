import type { Task, List } from "../types";

const API_URL = "http://localhost:4000";
const USE_LOCAL_STORAGE = true; // Set to false when backend is available

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get current timestamp
function getTimestamp(): string {
  return new Date().toISOString();
}

// LocalStorage keys
const TASKS_KEY = 'tasks_app_tasks';
const LISTS_KEY = 'tasks_app_lists';

// Initialize localStorage with default data if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(TASKS_KEY)) {
    const defaultTasks: Task[] = [
      {
        id: generateId(),
        title: 'Welcome to Tasks App!',
        description: 'This is a sample task. You can edit or delete it.',
        priority: 'medium',
        listId: 'default-list',
        completed: false,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        createdAt: getTimestamp(),
      },
      {
        id: generateId(),
        title: 'Try creating a new task',
        description: 'Click the "Add Task" button to create your own tasks.',
        priority: 'low',
        listId: 'default-list',
        completed: false,
        createdAt: getTimestamp(),
      },
      {
        id: generateId(),
        title: 'Complete this task',
        description: 'Click the checkbox to mark it as done.',
        priority: 'high',
        listId: 'default-list',
        completed: true,
        createdAt: getTimestamp(),
      },
    ];
    localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
  }

  if (!localStorage.getItem(LISTS_KEY)) {
    const defaultLists: List[] = [
      {
        id: 'default-list',
        name: 'My Tasks',
        createdAt: getTimestamp(),
      },
      {
        id: generateId(),
        name: 'Personal',
        createdAt: getTimestamp(),
      },
      {
        id: generateId(),
        name: 'Work',
        createdAt: getTimestamp(),
      },
    ];
    localStorage.setItem(LISTS_KEY, JSON.stringify(defaultLists));
  }
}

// LocalStorage implementations
function getTasksFromStorage(): Task[] {
  initializeLocalStorage();
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
}

function saveTasksToStorage(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function getListsFromStorage(): List[] {
  initializeLocalStorage();
  const lists = localStorage.getItem(LISTS_KEY);
  return lists ? JSON.parse(lists) : [];
}

function saveListsToStorage(lists: List[]): void {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}

// API functions with localStorage fallback
export async function getTasks(): Promise<Task[]> {
  if (USE_LOCAL_STORAGE) {
    return getTasksFromStorage();
  }
  
  try {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  } catch (error) {
    console.warn('Backend not available, falling back to localStorage');
    return getTasksFromStorage();
  }
}

export async function createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  if (USE_LOCAL_STORAGE) {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: getTimestamp(),
    };
    const tasks = getTasksFromStorage();
    tasks.unshift(newTask);
    saveTasksToStorage(tasks);
    return newTask;
  }
  
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  } catch (error) {
    console.warn('Backend not available, falling back to localStorage');
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: getTimestamp(),
    };
    const tasks = getTasksFromStorage();
    tasks.unshift(newTask);
    saveTasksToStorage(tasks);
    return newTask;
  }
}

export async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
  if (USE_LOCAL_STORAGE) {
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    saveTasksToStorage(tasks);
    return updatedTask;
  }
  
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  } catch (error) {
    console.warn('Backend not available, falling back to localStorage');
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    saveTasksToStorage(tasks);
    return updatedTask;
  }
}

export async function deleteTask(id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const tasks = getTasksFromStorage();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasksToStorage(filtered);
    return;
  }
  
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error('Failed to delete task');
  } catch (error) {
    console.warn('Backend not available, falling back to localStorage');
    const tasks = getTasksFromStorage();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasksToStorage(filtered);
  }
}

export async function getLists(): Promise<List[]> {
  if (USE_LOCAL_STORAGE) {
    return getListsFromStorage();
  }
  
  try {
    const res = await fetch(`${API_URL}/lists`);
    if (!res.ok) throw new Error('Failed to fetch lists');
    return res.json();
  } catch (error) {
    console.warn('Backend not available, falling back to localStorage');
    return getListsFromStorage();
  }
}

export async function createList(listData: Omit<List, 'id' | 'createdAt'>): Promise<List> {
  if (USE_LOCAL_STORAGE) {
    const newList: List = {
      ...listData,
      id: generateId(),
      createdAt: getTimestamp(),
    };
    const lists = getListsFromStorage();
    lists.push(newList);
    saveListsToStorage(lists);
    return newList;
  }
  
  try {
    const res = await fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listData),
    });
    if (!res.ok) throw new Error('Failed to create list');
    return res.json();
  } catch (error) {
    console.warn('Backend not available, falling back to localStorage');
    const newList: List = {
      ...listData,
      id: generateId(),
      createdAt: getTimestamp(),
    };
    const lists = getListsFromStorage();
    lists.push(newList);
    saveListsToStorage(lists);
    return newList;
  }
}

// Initialize with sample data on load
initializeLocalStorage();

export async function toggleTask(id: string): Promise<Task> {
  const tasks = await getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) throw new Error("Task not found");

  return updateTask(id, { completed: !task.completed });
}

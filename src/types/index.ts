export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  listId: string
  createdAt: string
}

export interface List {
  id: string
  name: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type NavId = string

export interface NavItem {
  id: NavId
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

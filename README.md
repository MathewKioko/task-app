# Task Management UI Components

A production-ready, SaaS-grade task management UI system built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ **Clean SaaS Aesthetic** - Professional, minimal design similar to Linear/Notion/Todoist
- 🌓 **Dark & Light Mode** - Full dark mode support using Tailwind's class strategy
- 📱 **Fully Responsive** - Mobile-first design that works on all screen sizes
- ♿ **Accessibility First** - Semantic HTML, ARIA labels, keyboard navigation
- 🎨 **Consistent Design System** - Custom color palette, typography scale, spacing
- 🧩 **Modular Components** - Reusable, well-organized component architecture

## Component Library

### Layout Components
- **AppShell** - Main application wrapper with sidebar and header
- **Sidebar** - Collapsible navigation sidebar with active states
- **Header** - Top bar with search, actions, and theme toggle

### UI Components
- **Button** - Primary, secondary, ghost, and destructive variants
- **Input** - Text input with error states
- **Textarea** - Multi-line text input
- **Checkbox** - Custom styled checkbox
- **Badge** - Status and category badges
- **Avatar** - User avatar with fallback
- **Tooltip** - Hover tooltips
- **Modal** - Accessible dialog with backdrop
- **Dropdown** - Select menu with keyboard navigation

### Task Components
- **TasksPage** - Complete tasks page with header
- **TaskList** - List of tasks with active/completed sections
- **TaskItem** - Individual task row with hover actions
- **TaskModal** - Task creation/editing modal form
- **EmptyState** - Empty task list and no results states
- **LoadingSkeleton** - Loading placeholder
- **ErrorState** - Error display with retry

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

### Basic Example

```tsx
import { AppShell, TasksPage } from './components';

function App() {
  return (
    <AppShell>
      <TasksPage />
    </AppShell>
  );
}
```

### With Props

```tsx
import { AppShell, TasksPage, TaskModal } from './components';
import { useState } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <AppShell
      user={{ id: '1', name: 'John Doe', email: 'john@example.com' }}
      currentTheme="light"
      onThemeToggle={() => {/* toggle theme */}}
      onAddTask={() => setIsModalOpen(true)}
    >
      <TasksPage
        tasks={[/* your tasks */]}
        onTaskToggle={(id) => {/* handle toggle */}}
        onTaskEdit={(id) => {/* handle edit */}}
        onTaskDelete={(id) => {/* handle delete */}}
      />
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {/* handle submit */}}
      />
    </AppShell>
  );
}
```

## Dark Mode

Dark mode is enabled via the `dark` class on the root element:

```tsx
// Add 'dark' class to enable dark mode
document.documentElement.classList.add('dark');

// Remove 'dark' class to disable dark mode
document.documentElement.classList.remove('dark');
```

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Modal.tsx
│   │   └── Dropdown.tsx
│   ├── tasks/
│   │   ├── TasksPage.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── ErrorState.tsx
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   └── formatters.ts
└── App.tsx
```

## Design Tokens

The project uses a custom Tailwind theme with:

- **Primary Color**: Blue (#2563eb)
- **Neutral Palette**: Gray scale for backgrounds and text
- **Semantic Colors**: Success (green), Warning (amber), Error (red)
- **Typography**: Inter font family
- **Spacing**: 4px/8px base grid
- **Border Radius**: Consistent rounded corners
- **Shadows**: Subtle elevation levels

## Notes

- **UI Only**: This is a pure UI component library with no business logic or state management
- **No Mock Data**: Components receive data via props
- **Type Safe**: Full TypeScript support with exported interfaces
- **Extensible**: Easy to customize and extend with your own logic

## License

MIT
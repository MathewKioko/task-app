# UI Audit & Polish - TODO

## Goal
Normalize spacing, padding, gap usage, border radius, hover/focus/active states, and ensure premium feel across all components.

## Design System Standards
- **Controls**: rounded-lg (8px)
- **Cards/Surfaces**: rounded-xl (12px)  
- **Overlays**: shadow-lg, rounded-xl
- **Backgrounds**: light: neutral-50/100, dark: neutral-850/800
- **Focus ring**: ring-primary/20, ring-2, ring-offset-2

---

## Component Updates

### UI Base Components - COMPLETED
- [x] Button.tsx - Normalized hover states and dark mode colors
- [x] Input.tsx - Standardized focus rings and transitions
- [x] Textarea.tsx - Changed rounded-md → rounded-lg
- [x] Dropdown.tsx - Changed rounded-md → rounded-lg, fixed shadow
- [x] Checkbox.tsx - Changed rounded-md → rounded-lg
- [x] Modal.tsx - Changed rounded-lg → rounded-xl, preserved shadow-lg

### Task Components - COMPLETED  
- [x] TaskItem.tsx - Already used rounded-xl, consistent shadows
- [x] TaskList.tsx - Uses consistent TaskItem components
- [x] TaskModal.tsx - Cleaned up unused code, proper form handling

### Layout Components - COMPLETED
- [x] Sidebar.tsx - Consistent rounded-lg nav items
- [x] Header.tsx - Consistent transitions and styling

### Page Components - COMPLETED
- [x] TasksPage.tsx - Normalized filter tabs, selects, search input

### State Components - COMPLETED
- [x] EmptyState.tsx - Changed rounded-2xl → rounded-xl
- [x] ErrorState.tsx - Already uses rounded-xl
- [x] LoadingSkeleton.tsx - Consistent with TaskItem styling

### Global Styles - COMPLETED
- [x] index.css - Fixed @import order, consistent transitions

---

## Summary of Changes

### Border Radius Normalization
- **Controls** (Input, Button, Checkbox, Dropdown, Textarea): `rounded-lg` ✓
- **Cards/Surfaces** (TaskItem, EmptyState, ErrorState): `rounded-xl` ✓
- **Overlays** (Modal): `rounded-xl` ✓

### Shadow System
- **Base components**: `shadow-xs` ✓
- **Interactive hover**: `hover:shadow-md` for TaskItem ✓
- **Overlays**: `shadow-lg` for Modal, Dropdown ✓

### Focus Ring System
- **Standard**: `focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2` ✓
- **Error state**: `focus-visible:ring-error/20` ✓

### Background Colors
- **Light mode sections**: `bg-neutral-50` / `bg-neutral-100` ✓
- **Dark mode sections**: `bg-neutral-850` / `bg-neutral-800` ✓
- **White surfaces**: `bg-white` / `dark:bg-neutral-900` ✓

### Transitions
- **Standard**: `transition-all duration-200 ease-out` ✓
- **Sidebar**: `transition-all duration-300 ease-in-out` ✓

---

## Build Status
✅ Build completed successfully

## Next Steps
- Run the dev server to verify visual changes
- Test light/dark mode transitions
- Check all interactive states (hover, focus, active)


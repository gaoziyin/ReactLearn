# 10.1 Project: Task Manager

Build a full-featured task management application.

---

## 🎯 Project Goals

- Complete CRUD operations
- State management with Zustand
- Drag & drop reordering
- Local storage persistence
- Responsive design

---

## 📋 Features

- [ ] Create, edit, delete tasks
- [ ] Mark tasks complete
- [ ] Filter by status
- [ ] Drag to reorder
- [ ] Dark mode
- [ ] Persist to localStorage

---

## 🛠️ Tech Stack

- React 19
- TypeScript
- Zustand (state)
- dnd-kit (drag & drop)
- Tailwind CSS (styling)

---

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── FilterBar.tsx
│   ├── store/
│   │   └── taskStore.ts
│   ├── types/
│   │   └── task.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 💻 Step 1: Define Types

```tsx
// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';
```

---

## 💻 Step 2: Create Store

```tsx
// src/store/taskStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskFilter } from '../types/task';

interface TaskStore {
  tasks: Task[];
  filter: TaskFilter;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      filter: 'all',
      
      addTask: (taskData) => set((state) => ({
        tasks: [...state.tasks, {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }],
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      })),
      
      setFilter: (filter) => set({ filter }),
      
      reorderTasks: (startIndex, endIndex) => set((state) => {
        const tasks = [...state.tasks];
        const [removed] = tasks.splice(startIndex, 1);
        tasks.splice(endIndex, 0, removed);
        return { tasks };
      }),
    }),
    { name: 'task-storage' }
  )
);
```

---

## 💻 Step 3: Build Components

See the `examples/` folder for complete component implementations.

---

## ✅ Acceptance Criteria

- [ ] Can add tasks with title and description
- [ ] Can mark tasks as complete
- [ ] Can delete tasks
- [ ] Filter shows correct tasks
- [ ] Tasks persist after refresh
- [ ] Responsive on mobile

---

[← Back to Module 10](../README.md) | [Next: 10.2 E-commerce →](../10.2-ecommerce/)

# 7.2 Zustand

## 📚 Learning Objectives

- Understand Zustand's philosophy
- Create and use Zustand stores
- Implement selectors and middleware
- Handle async operations

---

## 🚀 What is Zustand?

Zustand is a small, fast, and scalable state management solution. It's:
- **Minimal** - No boilerplate
- **Flexible** - No strict patterns
- **TypeScript-first** - Excellent type inference

```bash
npm install zustand
```

---

## 💻 Basic Store

```tsx
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage in component
function Counter() {
  const { count, increment, decrement } = useCounterStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## 📦 Complex Store Example

```tsx
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  
  // Actions
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: TodoStore['filter']) => void;
  
  // Computed (getters)
  filteredTodos: () => Todo[];
}

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  filter: 'all',
  
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, {
      id: Date.now().toString(),
      text,
      completed: false,
    }],
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  
  setFilter: (filter) => set({ filter }),
  
  filteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case 'active': return todos.filter((t) => !t.completed);
      case 'completed': return todos.filter((t) => t.completed);
      default: return todos;
    }
  },
}));
```

---

## 🎯 Selectors (Performance)

```tsx
// BAD: Re-renders on any store change
function BadComponent() {
  const store = useCounterStore(); // Subscribes to everything
  return <span>{store.count}</span>;
}

// GOOD: Only re-renders when count changes
function GoodComponent() {
  const count = useCounterStore((state) => state.count);
  return <span>{count}</span>;
}

// Multiple selectors with shallow comparison
import { shallow } from 'zustand/shallow';

function MultiSelect() {
  const { count, increment } = useCounterStore(
    (state) => ({ count: state.count, increment: state.increment }),
    shallow
  );
  return <button onClick={increment}>{count}</button>;
}
```

---

## 🔌 Middleware

### Persist Middleware
```tsx
import { persist } from 'zustand/middleware';

const useStore = create(
  persist<CounterStore>(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 })),
    }),
    {
      name: 'counter-storage', // localStorage key
    }
  )
);
```

### DevTools Middleware
```tsx
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools<CounterStore>(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 }), false, 'increment'),
    }),
    { name: 'Counter Store' }
  )
);
```

---

## ⚡ Async Actions

```tsx
interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
```

---

## 📝 Summary

- Zustand is minimal and flexible
- Use selectors for performance
- Middleware for persistence/devtools
- Great for simple to medium complexity

---

[← Back to Module 7](../README.md) | [Next: 7.3 Redux Toolkit →](../7.3-redux-toolkit/)

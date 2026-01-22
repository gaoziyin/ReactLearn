# 7.1 State Management Overview

## 📚 Learning Objectives

- Understand when to use different state solutions
- Compare client state vs server state
- Learn the decision framework for choosing state management

---

## 🧠 Types of State

```mermaid
flowchart TB
    State[Application State]
    State --> Local[Local State]
    State --> Global[Global State]
    State --> Server[Server State]
    State --> URL[URL State]
    
    Local --> |useState, useReducer| Components
    Global --> |Context, Zustand, Redux| SharedState[Shared State]
    Server --> |TanStack Query, SWR| RemoteData[Remote Data]
    URL --> |Router params| Navigation
    
    style Local fill:#e3f2fd
    style Global fill:#e8f5e9
    style Server fill:#fff3e0
    style URL fill:#fce4ec
```

---

## 📊 State Types Comparison

| Type | Examples | Solutions |
|------|----------|-----------|
| **Local** | Form inputs, toggles, UI state | `useState`, `useReducer` |
| **Global** | User auth, theme, cart | Context, Zustand, Redux |
| **Server** | API data, cache | TanStack Query, SWR |
| **URL** | Filters, pagination | Router, searchParams |

---

## 🤔 Decision Framework

```mermaid
flowchart TD
    Start[Need State?]
    Start --> Q1{Used in single component?}
    Q1 --> |Yes| useState[Use useState/useReducer]
    Q1 --> |No| Q2{Is it server data?}
    Q2 --> |Yes| TanStack[Use TanStack Query]
    Q2 --> |No| Q3{Shared across 2-3 components?}
    Q3 --> |Yes| Props[Props or Context]
    Q3 --> |No| Q4{Complex state logic?}
    Q4 --> |Yes| Redux[Use Redux Toolkit]
    Q4 --> |No| Zustand[Use Zustand]
    
    style useState fill:#c8e6c9
    style TanStack fill:#fff3e0
    style Props fill:#bbdefb
    style Redux fill:#f8bbd0
    style Zustand fill:#d1c4e9
```

---

## ✅ When to Use Each

### useState / useReducer
```tsx
// Perfect for: Local component state
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### React Context
```tsx
// Perfect for: Theme, auth, localization (rarely changing)
const ThemeContext = createContext<'light' | 'dark'>('light');
```

### Zustand
```tsx
// Perfect for: Simple global state without boilerplate
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Redux Toolkit
```tsx
// Perfect for: Complex apps with strict patterns needed
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});
```

### TanStack Query
```tsx
// Perfect for: Server data with caching
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json()),
});
```

---

## 📝 Summary

- **Local state**: `useState` / `useReducer`
- **Theme/Auth**: React Context
- **Simple global**: Zustand
- **Complex enterprise**: Redux Toolkit
- **Server data**: TanStack Query

---

[← Back to Module 7](../README.md) | [Next: 7.2 Zustand →](../7.2-zustand/)

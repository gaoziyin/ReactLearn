# 2.5 Refs and the DOM

## 📚 Learning Objectives

- Access DOM elements using `useRef`
- Store mutable values without re-renders
- Use React 19's ref as prop feature

---

## 🎣 useRef Hook

```tsx
import { useRef } from 'react';

function TextInput(): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = (): void => {
    inputRef.current?.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}
```

---

## 📦 Common Use Cases

### 1. Focus Management
```tsx
function AutoFocus(): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  return <input ref={inputRef} />;
}
```

### 2. Timer IDs
```tsx
function Timer(): React.ReactElement {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const start = (): void => {
    intervalRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
  };
  
  const stop = (): void => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

---

## 🆕 React 19: Ref as Prop

```tsx
// React 19: ref as regular prop
interface InputProps {
  ref?: React.Ref<HTMLInputElement>;
}

function Input({ ref }: InputProps): React.ReactElement {
  return <input ref={ref} />;
}
```

---

## 📝 Summary

- `useRef` for DOM access and mutable values
- Changes to `ref.current` don't trigger re-renders
- React 19 allows ref as a regular prop

---

[← Previous: 2.4 Forms](../2.4-forms/) | [Next Module: 3 →](../../module-3-advanced-hooks/)

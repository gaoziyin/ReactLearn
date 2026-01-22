# Custom Hooks Exercises

Practice creating reusable custom hooks.

---

## Exercise 1: useForm Hook

Create a generic form handling hook:

```tsx
interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
}

function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  // TODO: Implement this hook
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setValues(prev => ({ ...prev, [name]: value }));
      // Clear error when user types
      setErrors(prev => ({ ...prev, [name]: undefined }));
    };
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    return () => {
      setTouched(prev => ({ ...prev, [name]: true }));
      if (validate) {
        const validationErrors = validate(values);
        setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
      }
    };
  }, [validate, values]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouched(allTouched);

    // Validate all fields
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

// Usage:
function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      if (!values.email.includes('@')) errors.email = 'Invalid email';
      if (values.password.length < 8) errors.password = 'Too short';
      return errors;
    },
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        value={form.values.email}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
      />
      {form.touched.email && form.errors.email && <span>{form.errors.email}</span>}
      
      <input
        type="password"
        value={form.values.password}
        onChange={form.handleChange('password')}
        onBlur={form.handleBlur('password')}
      />
      
      <button disabled={form.isSubmitting}>Submit</button>
    </form>
  );
}
```

</details>

---

## Exercise 2: useIntersectionObserver

Create a hook for detecting when an element enters the viewport:

```tsx
interface UseIntersectionOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

function useIntersectionObserver(
  options?: UseIntersectionOptions
): [React.RefObject<HTMLElement>, boolean] {
  // TODO: Return [ref, isIntersecting]
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useRef, useState, useEffect } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

function useIntersectionObserver<T extends HTMLElement>(
  options: UseIntersectionOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0px' } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return [ref, isIntersecting];
}

// Usage: Lazy load images
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref}>
      {(isVisible || loaded) && (
        <img 
          src={src} 
          alt={alt} 
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
```

</details>

---

## Exercise 3: useOnlineStatus

Create a hook to track online/offline status:

```tsx
function useOnlineStatus(): boolean {
  // TODO: Return true if online, false if offline
  // Should update when status changes
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useSyncExternalStore, useCallback } from 'react';

function useOnlineStatus(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }, []);

  const getSnapshot = useCallback(() => navigator.onLine, []);
  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Usage:
function App() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
}
```

</details>

---

## Exercise 4: useCopyToClipboard

Create a hook to copy text to clipboard:

```tsx
function useCopyToClipboard(): [
  boolean | null, // copied status
  (text: string) => Promise<void> // copy function
] {
  // TODO: Implement
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useState, useCallback } from 'react';

function useCopyToClipboard(): [boolean | null, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState<boolean | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(null), 2000); // Reset after 2s
    } catch (err) {
      setCopied(false);
      console.error('Failed to copy:', err);
    }
  }, []);

  return [copied, copy];
}

// Usage:
function ShareButton({ url }: { url: string }) {
  const [copied, copy] = useCopyToClipboard();

  return (
    <button onClick={() => copy(url)}>
      {copied === true && '✅ Copied!'}
      {copied === false && '❌ Failed'}
      {copied === null && '📋 Copy Link'}
    </button>
  );
}
```

</details>

---

## Challenge: useStateHistory

Create a hook that tracks state history with undo/redo:

```tsx
interface UseStateHistoryReturn<T> {
  state: T;
  setState: (value: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: T[];
  pointer: number;
}

function useStateHistory<T>(initialState: T): UseStateHistoryReturn<T> {
  // TODO: Implement undo/redo functionality
}
```

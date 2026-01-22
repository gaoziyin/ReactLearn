// Custom Hooks Examples
// React 19 with TypeScript

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';

// ===========================================
// Example 1: useLocalStorage
// ===========================================
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue(prev => {
            const newValue = value instanceof Function ? value(prev) : value;
            localStorage.setItem(key, JSON.stringify(newValue));
            return newValue;
        });
    }, [key]);

    return [storedValue, setValue];
}

// Usage:
// const [theme, setTheme] = useLocalStorage('theme', 'light');

// ===========================================
// Example 2: useFetch
// ===========================================
interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> & { refetch: () => void } {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        isLoading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setState({ data, isLoading: false, error: null });
        } catch (error) {
            setState({ data: null, isLoading: false, error: error as Error });
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...state, refetch: fetchData };
}

// Usage:
// const { data, isLoading, error, refetch } = useFetch<User[]>('/api/users');

// ===========================================
// Example 3: useDebounce
// ===========================================
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Usage:
// const [search, setSearch] = useState('');
// const debouncedSearch = useDebounce(search, 300);
// useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);

// ===========================================
// Example 4: useToggle
// ===========================================
export function useToggle(
    initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);

    const setTo = useCallback((newValue: boolean) => {
        setValue(newValue);
    }, []);

    return [value, toggle, setTo];
}

// Usage:
// const [isOpen, toggle, setOpen] = useToggle(false);

// ===========================================
// Example 5: useClickOutside
// ===========================================
export function useClickOutside<T extends HTMLElement>(
    callback: () => void
): React.RefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback]);

    return ref;
}

// Usage:
// const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
// <div ref={dropdownRef}>...</div>

// ===========================================
// Example 6: useMediaQuery
// ===========================================
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            const mediaQuery = window.matchMedia(query);
            mediaQuery.addEventListener('change', callback);
            return () => mediaQuery.removeEventListener('change', callback);
        },
        [query]
    );

    const getSnapshot = useCallback(() => {
        return window.matchMedia(query).matches;
    }, [query]);

    const getServerSnapshot = useCallback(() => false, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Usage:
// const isMobile = useMediaQuery('(max-width: 768px)');
// const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

// ===========================================
// Example 7: usePrevious
// ===========================================
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// Usage:
// const [count, setCount] = useState(0);
// const previousCount = usePrevious(count);

// ===========================================
// Example 8: useAsync
// ===========================================
interface AsyncState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

export function useAsync<T, Args extends unknown[]>(
    asyncFn: (...args: Args) => Promise<T>
): AsyncState<T> & { execute: (...args: Args) => Promise<T | null> } {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: Args): Promise<T | null> => {
            setState({ data: null, isLoading: true, error: null });

            try {
                const result = await asyncFn(...args);
                setState({ data: result, isLoading: false, error: null });
                return result;
            } catch (error) {
                setState({ data: null, isLoading: false, error: error as Error });
                return null;
            }
        },
        [asyncFn]
    );

    return { ...state, execute };
}

// Usage:
// const { data, isLoading, error, execute } = useAsync(createUser);
// <button onClick={() => execute({ name: 'John', email: 'john@example.com' })}>

// ===========================================
// Example 9: useInterval
// ===========================================
export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}

// Usage:
// const [count, setCount] = useState(0);
// const [isRunning, setIsRunning] = useState(true);
// useInterval(() => setCount(c => c + 1), isRunning ? 1000 : null);

// ===========================================
// Example 10: useWindowSize
// ===========================================
interface WindowSize {
    width: number;
    height: number;
}

export function useWindowSize(): WindowSize {
    const subscribe = useCallback((callback: () => void) => {
        window.addEventListener('resize', callback);
        return () => window.removeEventListener('resize', callback);
    }, []);

    const getSnapshot = useCallback((): WindowSize => ({
        width: window.innerWidth,
        height: window.innerHeight,
    }), []);

    const getServerSnapshot = useCallback((): WindowSize => ({
        width: 0,
        height: 0,
    }), []);

    // Use JSON to make the comparison work
    const size = useSyncExternalStore(
        subscribe,
        () => JSON.stringify(getSnapshot()),
        () => JSON.stringify(getServerSnapshot())
    );

    return JSON.parse(size);
}

// Usage:
// const { width, height } = useWindowSize();

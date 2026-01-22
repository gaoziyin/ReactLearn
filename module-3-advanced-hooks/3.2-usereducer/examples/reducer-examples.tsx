// useReducer Examples
// React 19 with TypeScript

import React, { useReducer, useContext, createContext, ReactNode } from 'react';

// ===========================================
// Example 1: Basic Counter with Reducer
// ===========================================
interface CounterState {
    count: number;
}

type CounterAction =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'RESET' }
    | { type: 'SET'; payload: number };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        case 'RESET':
            return { count: 0 };
        case 'SET':
            return { count: action.payload };
        default:
            return state;
    }
}

export function Counter(): React.ReactElement {
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });

    return (
        <div className="counter">
            <h2>Count: {state.count}</h2>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
            <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>Set to 100</button>
        </div>
    );
}

// ===========================================
// Example 2: Todo List with Reducer
// ===========================================
interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
    filter: 'all' | 'active' | 'completed';
}

type TodoAction =
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: string }
    | { type: 'DELETE_TODO'; payload: string }
    | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
    | { type: 'CLEAR_COMPLETED' }
    | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: Date.now().toString(), text: action.payload, completed: false },
                ],
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload),
            };
        case 'EDIT_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, text: action.payload.text }
                        : todo
                ),
            };
        case 'CLEAR_COMPLETED':
            return {
                ...state,
                todos: state.todos.filter(todo => !todo.completed),
            };
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload,
            };
        default:
            return state;
    }
}

const initialTodoState: TodoState = {
    todos: [],
    filter: 'all',
};

export function TodoApp(): React.ReactElement {
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);

    const filteredTodos = state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.completed;
        if (state.filter === 'completed') return todo.completed;
        return true;
    });

    const handleAddTodo = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('todo') as HTMLInputElement;
        if (input.value.trim()) {
            dispatch({ type: 'ADD_TODO', payload: input.value.trim() });
            input.value = '';
        }
    };

    return (
        <div className="todo-app">
            <form onSubmit={handleAddTodo}>
                <input name="todo" placeholder="Add todo..." />
                <button type="submit">Add</button>
            </form>

            <div className="filters">
                {(['all', 'active', 'completed'] as const).map(filter => (
                    <button
                        key={filter}
                        onClick={() => dispatch({ type: 'SET_FILTER', payload: filter })}
                        className={state.filter === filter ? 'active' : ''}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                        />
                        <span>{todo.text}</span>
                        <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>
                Clear Completed
            </button>
        </div>
    );
}

// ===========================================
// Example 3: Form State with Reducer
// ===========================================
interface FormState {
    values: {
        email: string;
        password: string;
        confirmPassword: string;
    };
    errors: {
        email?: string;
        password?: string;
        confirmPassword?: string;
    };
    touched: {
        email: boolean;
        password: boolean;
        confirmPassword: boolean;
    };
    isSubmitting: boolean;
    isValid: boolean;
}

type FormAction =
    | { type: 'SET_FIELD'; payload: { field: string; value: string } }
    | { type: 'SET_TOUCHED'; payload: string }
    | { type: 'SET_ERRORS'; payload: FormState['errors'] }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR' }
    | { type: 'RESET' };

const initialFormState: FormState = {
    values: { email: '', password: '', confirmPassword: '' },
    errors: {},
    touched: { email: false, password: false, confirmPassword: false },
    isSubmitting: false,
    isValid: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.payload.field]: action.payload.value,
                },
            };
        case 'SET_TOUCHED':
            return {
                ...state,
                touched: {
                    ...state.touched,
                    [action.payload]: true,
                },
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.payload,
                isValid: Object.keys(action.payload).length === 0,
            };
        case 'SUBMIT_START':
            return { ...state, isSubmitting: true };
        case 'SUBMIT_SUCCESS':
            return { ...initialFormState };
        case 'SUBMIT_ERROR':
            return { ...state, isSubmitting: false };
        case 'RESET':
            return initialFormState;
        default:
            return state;
    }
}

export function RegistrationForm(): React.ReactElement {
    const [state, dispatch] = useReducer(formReducer, initialFormState);

    const validate = (): FormState['errors'] => {
        const errors: FormState['errors'] = {};
        if (!state.values.email.includes('@')) {
            errors.email = 'Invalid email';
        }
        if (state.values.password.length < 8) {
            errors.password = 'Password must be 8+ characters';
        }
        if (state.values.password !== state.values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const errors = validate();
        dispatch({ type: 'SET_ERRORS', payload: errors });

        if (Object.keys(errors).length === 0) {
            dispatch({ type: 'SUBMIT_START' });
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch({ type: 'SUBMIT_SUCCESS' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={state.values.email}
                onChange={e => dispatch({ type: 'SET_FIELD', payload: { field: 'email', value: e.target.value } })}
                onBlur={() => dispatch({ type: 'SET_TOUCHED', payload: 'email' })}
            />
            {state.touched.email && state.errors.email && <span>{state.errors.email}</span>}

            <input
                type="password"
                value={state.values.password}
                onChange={e => dispatch({ type: 'SET_FIELD', payload: { field: 'password', value: e.target.value } })}
                onBlur={() => dispatch({ type: 'SET_TOUCHED', payload: 'password' })}
            />
            {state.touched.password && state.errors.password && <span>{state.errors.password}</span>}

            <input
                type="password"
                value={state.values.confirmPassword}
                onChange={e => dispatch({ type: 'SET_FIELD', payload: { field: 'confirmPassword', value: e.target.value } })}
                onBlur={() => dispatch({ type: 'SET_TOUCHED', payload: 'confirmPassword' })}
            />
            {state.touched.confirmPassword && state.errors.confirmPassword && <span>{state.errors.confirmPassword}</span>}

            <button type="submit" disabled={state.isSubmitting}>
                {state.isSubmitting ? 'Submitting...' : 'Register'}
            </button>
        </form>
    );
}

// ===========================================
// Example 4: useReducer with Context
// ===========================================
interface AppState {
    user: { id: string; name: string } | null;
    notifications: Array<{ id: string; message: string }>;
    theme: 'light' | 'dark';
}

type AppAction =
    | { type: 'LOGIN'; payload: { id: string; name: string } }
    | { type: 'LOGOUT' }
    | { type: 'ADD_NOTIFICATION'; payload: string }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'TOGGLE_THEME' };

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    { id: Date.now().toString(), message: action.payload },
                ],
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
            };
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
        default:
            return state;
    }
}

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | null>(null);

export function AppProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [state, dispatch] = useReducer(appReducer, {
        user: null,
        notifications: [],
        theme: 'light',
    });

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
}

export function useAppState(): AppState {
    const context = useContext(AppStateContext);
    if (!context) throw new Error('useAppState must be used within AppProvider');
    return context;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
    const context = useContext(AppDispatchContext);
    if (!context) throw new Error('useAppDispatch must be used within AppProvider');
    return context;
}

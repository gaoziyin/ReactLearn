// useContext Examples
// React 19 with TypeScript

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ===========================================
// Example 1: Theme Context
// ===========================================
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
        background: string;
        text: string;
        primary: string;
    };
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
    const [theme, setTheme] = useState<Theme>('light');

    const toggleTheme = (): void => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const colors = theme === 'light'
        ? { background: '#ffffff', text: '#000000', primary: '#007bff' }
        : { background: '#1a1a2e', text: '#ffffff', primary: '#4dabf7' };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Using the theme
export function ThemedButton(): React.ReactElement {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                backgroundColor: colors.primary,
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
            }}
        >
            Current: {theme} mode
        </button>
    );
}

// ===========================================
// Example 2: Auth Context
// ===========================================
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser({
                id: '1',
                name: 'John Doe',
                email,
                role: 'user',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ===========================================
// Example 3: Multi-Context Pattern
// ===========================================
interface NotificationContextType {
    notifications: Array<{ id: string; message: string; type: 'info' | 'error' | 'success' }>;
    addNotification: (message: string, type: 'info' | 'error' | 'success') => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications(): NotificationContextType {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}

export function NotificationProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [notifications, setNotifications] = useState<NotificationContextType['notifications']>([]);

    const addNotification = (message: string, type: 'info' | 'error' | 'success'): void => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id: string): void => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

// ===========================================
// Example 4: Combining Providers
// ===========================================
interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): React.ReactElement {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

// App component using multiple contexts
export function Dashboard(): React.ReactElement {
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const { addNotification } = useNotifications();

    const handleLogout = (): void => {
        logout();
        addNotification('You have been logged out', 'info');
    };

    return (
        <div style={{ backgroundColor: colors.background, color: colors.text }}>
            <h1>Welcome, {user?.name}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

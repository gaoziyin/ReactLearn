// Optimization Patterns Examples
// React 19 with TypeScript

import React, { lazy, Suspense, startTransition, useDeferredValue, memo } from 'react';

// ===========================================
// Example 1: Code Splitting with lazy()
// ===========================================

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const PDFViewer = lazy(() => import('./PDFViewer'));
const RichTextEditor = lazy(() => import('./RichTextEditor'));

export function DashboardWithLazyComponents(): React.ReactElement {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            {/* Each lazy component gets its own Suspense boundary */}
            <Suspense fallback={<div className="skeleton chart-skeleton" />}>
                <HeavyChart />
            </Suspense>

            <Suspense fallback={<div className="skeleton pdf-skeleton" />}>
                <PDFViewer />
            </Suspense>
        </div>
    );
}

// ===========================================
// Example 2: Route-based Code Splitting
// ===========================================

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export function AppRouter(): React.ReactElement {
    // Simplified routing example
    const path = window.location.pathname;

    return (
        <Suspense fallback={<div className="page-loading">Loading...</div>}>
            {path === '/' && <HomePage />}
            {path === '/products' && <ProductsPage />}
            {path === '/checkout' && <CheckoutPage />}
            {path === '/admin' && <AdminDashboard />}
        </Suspense>
    );
}

// ===========================================
// Example 3: useDeferredValue for Expensive Renders
// ===========================================

interface SearchResultsProps {
    query: string;
}

function SearchResults({ query }: SearchResultsProps): React.ReactElement {
    // Expensive filtering/rendering
    const results = performExpensiveSearch(query);

    return (
        <ul>
            {results.map(result => (
                <li key={result.id}>{result.title}</li>
            ))}
        </ul>
    );
}

export function SearchPage(): React.ReactElement {
    const [query, setQuery] = React.useState('');

    // Defer the value used for expensive rendering
    const deferredQuery = useDeferredValue(query);

    // Check if we're showing stale results
    const isStale = query !== deferredQuery;

    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
            />

            <div style={{ opacity: isStale ? 0.5 : 1 }}>
                <SearchResults query={deferredQuery} />
            </div>
        </div>
    );
}

// ===========================================
// Example 4: startTransition for Non-urgent Updates
// ===========================================

export function TabPanel(): React.ReactElement {
    const [tab, setTab] = React.useState('home');
    const [isPending, setIsPending] = React.useState(false);

    const handleTabChange = (newTab: string) => {
        // Mark this update as non-urgent
        startTransition(() => {
            setTab(newTab);
        });
    };

    return (
        <div>
            <nav className="tabs">
                {['home', 'profile', 'settings'].map(t => (
                    <button
                        key={t}
                        onClick={() => handleTabChange(t)}
                        className={tab === t ? 'active' : ''}
                    >
                        {t}
                    </button>
                ))}
            </nav>

            <div className="tab-content">
                {tab === 'home' && <HomeTab />}
                {tab === 'profile' && <ProfileTab />}
                {tab === 'settings' && <SettingsTab />}
            </div>
        </div>
    );
}

// ===========================================
// Example 5: Memoization Patterns
// ===========================================

interface ExpensiveListProps {
    items: Array<{ id: string; name: string; value: number }>;
    onItemClick: (id: string) => void;
}

// Memoized list item
const ListItem = memo(function ListItem({
    id,
    name,
    value,
    onClick,
}: {
    id: string;
    name: string;
    value: number;
    onClick: (id: string) => void;
}) {
    return (
        <li onClick={() => onClick(id)}>
            {name}: {value}
        </li>
    );
});

// Parent component with stable callback
export function ExpensiveList({ items, onItemClick }: ExpensiveListProps): React.ReactElement {
    // useCallback ensures stable reference
    const handleClick = React.useCallback((id: string) => {
        onItemClick(id);
    }, [onItemClick]);

    return (
        <ul>
            {items.map(item => (
                <ListItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    value={item.value}
                    onClick={handleClick}
                />
            ))}
        </ul>
    );
}

// ===========================================
// Example 6: Virtualization Pattern
// ===========================================

interface VirtualListProps {
    items: any[];
    itemHeight: number;
    containerHeight: number;
}

export function VirtualList({
    items,
    itemHeight,
    containerHeight
}: VirtualListProps): React.ReactElement {
    const [scrollTop, setScrollTop] = React.useState(0);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return (
        <div
            style={{ height: containerHeight, overflow: 'auto' }}
            onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
        >
            <div style={{ height: items.length * itemHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, index) => (
                        <div key={startIndex + index} style={{ height: itemHeight }}>
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Placeholder functions
function performExpensiveSearch(query: string) {
    return [{ id: '1', title: `Result for ${query}` }];
}
function HomeTab() { return <div>Home</div>; }
function ProfileTab() { return <div>Profile</div>; }
function SettingsTab() { return <div>Settings</div>; }

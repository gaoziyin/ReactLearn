// useMemo and useCallback Examples
// React 19 with TypeScript

import React, { useState, useMemo, useCallback, memo } from 'react';

// ===========================================
// Example 1: useMemo for Expensive Calculations
// ===========================================
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
}

interface ProductListProps {
    products: Product[];
    searchQuery: string;
    sortBy: 'name' | 'price';
}

export function ProductList({ products, searchQuery, sortBy }: ProductListProps): React.ReactElement {
    // Memoize the filtered and sorted list
    const filteredProducts = useMemo(() => {
        console.log('Filtering and sorting products...');

        // Step 1: Filter
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Step 2: Sort
        return [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            return a.price - b.price;
        });
    }, [products, searchQuery, sortBy]); // Only recalculate when these change

    return (
        <ul>
            {filteredProducts.map(product => (
                <li key={product.id}>
                    {product.name} - ${product.price}
                </li>
            ))}
        </ul>
    );
}

// ===========================================
// Example 2: useMemo for Derived State
// ===========================================
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartSummaryProps {
    items: CartItem[];
    taxRate: number;
}

export function CartSummary({ items, taxRate }: CartSummaryProps): React.ReactElement {
    const { subtotal, tax, total, itemCount } = useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        const itemCount = items.reduce((count, item) => count + item.quantity, 0);

        return { subtotal, tax, total, itemCount };
    }, [items, taxRate]);

    return (
        <div className="cart-summary">
            <p>Items: {itemCount}</p>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax ({(taxRate * 100).toFixed(0)}%): ${tax.toFixed(2)}</p>
            <p><strong>Total: ${total.toFixed(2)}</strong></p>
        </div>
    );
}

// ===========================================
// Example 3: useCallback for Event Handlers
// ===========================================
interface TodoItemProps {
    id: string;
    text: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

// Memoized child component
const TodoItem = memo(function TodoItem({
    id,
    text,
    completed,
    onToggle,
    onDelete,
}: TodoItemProps): React.ReactElement {
    console.log(`Rendering TodoItem: ${text}`);

    return (
        <li className={completed ? 'completed' : ''}>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggle(id)}
            />
            <span>{text}</span>
            <button onClick={() => onDelete(id)}>Delete</button>
        </li>
    );
});

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export function TodoList(): React.ReactElement {
    const [todos, setTodos] = useState<Todo[]>([
        { id: '1', text: 'Learn React', completed: false },
        { id: '2', text: 'Build app', completed: false },
    ]);
    const [inputValue, setInputValue] = useState('');

    // useCallback prevents creating new function references on every render
    const handleToggle = useCallback((id: string) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    }, []);

    const handleDelete = useCallback((id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);

    const handleAdd = useCallback(() => {
        if (inputValue.trim()) {
            setTodos(prev => [
                ...prev,
                { id: Date.now().toString(), text: inputValue.trim(), completed: false },
            ]);
            setInputValue('');
        }
    }, [inputValue]);

    return (
        <div>
            <div>
                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd}>Add</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        id={todo.id}
                        text={todo.text}
                        completed={todo.completed}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

// ===========================================
// Example 4: useCallback with Dependencies
// ===========================================
interface SearchProps {
    onSearch: (query: string, filters: string[]) => void;
}

export function SearchComponent(): React.ReactElement {
    const [query, setQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [results, setResults] = useState<string[]>([]);

    // This callback changes when activeFilters changes
    const handleSearch = useCallback(async () => {
        console.log('Searching with filters:', activeFilters);
        // Simulate API call
        const response = await fetch(`/api/search?q=${query}&filters=${activeFilters.join(',')}`);
        const data = await response.json();
        setResults(data);
    }, [query, activeFilters]);

    const toggleFilter = useCallback((filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    }, []);

    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <div className="filters">
                {['category1', 'category2', 'category3'].map(filter => (
                    <label key={filter}>
                        <input
                            type="checkbox"
                            checked={activeFilters.includes(filter)}
                            onChange={() => toggleFilter(filter)}
                        />
                        {filter}
                    </label>
                ))}
            </div>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

// ===========================================
// Example 5: When NOT to Use useMemo/useCallback
// ===========================================

// ❌ DON'T: Simple calculations
function BadExample({ items }: { items: number[] }): React.ReactElement {
    // Overkill - simple sum is fast
    const total = useMemo(() => items.reduce((a, b) => a + b, 0), [items]);
    return <span>{total}</span>;
}

// ✅ DO: Just calculate directly
function GoodExample({ items }: { items: number[] }): React.ReactElement {
    const total = items.reduce((a, b) => a + b, 0);
    return <span>{total}</span>;
}

// ❌ DON'T: Callbacks passed to non-memoized children
function BadCallbackExample(): React.ReactElement {
    const [count, setCount] = useState(0);

    // Useless - Button is not memoized
    const handleClick = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    return <button onClick={handleClick}>{count}</button>;
}

// ✅ DO: Skip useCallback for simple cases
function GoodCallbackExample(): React.ReactElement {
    const [count, setCount] = useState(0);

    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ===========================================
// Example 6: useMemo for Object/Array References
// ===========================================
interface ChartProps {
    data: { x: number; y: number }[];
}

const ExpensiveChart = memo(function ExpensiveChart({ data }: ChartProps): React.ReactElement {
    console.log('Rendering expensive chart...');
    return (
        <div className="chart">
            {data.map((point, i) => (
                <div key={i} style={{ left: point.x, bottom: point.y }} />
            ))}
        </div>
    );
});

export function ChartContainer({ rawData }: { rawData: number[] }): React.ReactElement {
    const [zoom, setZoom] = useState(1);

    // Memoize to prevent new array reference on every render
    const chartData = useMemo(() =>
        rawData.map((value, index) => ({
            x: index * 10 * zoom,
            y: value * zoom,
        })),
        [rawData, zoom]
    );

    return (
        <div>
            <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
            />
            <ExpensiveChart data={chartData} />
        </div>
    );
}

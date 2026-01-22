// Lists and Keys Examples
// React 19 with TypeScript

import React from 'react';

// ===========================================
// Example 1: Basic List Rendering
// ===========================================
interface Product {
    id: string;
    name: string;
    price: number;
}

interface ProductListProps {
    products: Product[];
}

export function ProductList({ products }: ProductListProps): React.ReactElement {
    return (
        <ul className="product-list">
            {products.map((product) => (
                // Use unique id as key - NOT index!
                <li key={product.id} className="product-item">
                    <span>{product.name}</span>
                    <span>${product.price.toFixed(2)}</span>
                </li>
            ))}
        </ul>
    );
}

// ===========================================
// Example 2: Nested Lists
// ===========================================
interface Category {
    id: string;
    name: string;
    items: { id: string; name: string }[];
}

interface CategoryListProps {
    categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps): React.ReactElement {
    return (
        <div className="category-list">
            {categories.map((category) => (
                <div key={category.id} className="category">
                    <h3>{category.name}</h3>
                    <ul>
                        {category.items.map((item) => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

// ===========================================
// Example 3: List with Components
// ===========================================
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
}

interface UserCardProps {
    user: User;
    onSelect: (id: string) => void;
}

function UserCard({ user, onSelect }: UserCardProps): React.ReactElement {
    return (
        <div
            className="user-card"
            onClick={() => onSelect(user.id)}
        >
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <span className={`role-badge role-${user.role}`}>
                {user.role}
            </span>
        </div>
    );
}

interface UserGridProps {
    users: User[];
    onUserSelect: (id: string) => void;
}

export function UserGrid({ users, onUserSelect }: UserGridProps): React.ReactElement {
    return (
        <div className="user-grid">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    onSelect={onUserSelect}
                />
            ))}
        </div>
    );
}

// ===========================================
// Example 4: Filtering and Mapping
// ===========================================
interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}

interface TaskListProps {
    tasks: Task[];
    filter: 'all' | 'active' | 'completed';
}

export function TaskList({ tasks, filter }: TaskListProps): React.ReactElement {
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // 'all'
    });

    if (filteredTasks.length === 0) {
        return <p className="empty-message">No tasks found</p>;
    }

    return (
        <ul className="task-list">
            {filteredTasks.map((task) => (
                <li
                    key={task.id}
                    className={`task ${task.completed ? 'completed' : ''}`}
                >
                    <span className={`priority-${task.priority}`}>●</span>
                    <span>{task.title}</span>
                </li>
            ))}
        </ul>
    );
}

// ===========================================
// Example 5: Sorting Lists
// ===========================================
interface SortableItem {
    id: string;
    name: string;
    date: string;
    value: number;
}

type SortKey = 'name' | 'date' | 'value';
type SortOrder = 'asc' | 'desc';

interface SortableListProps {
    items: SortableItem[];
    sortBy: SortKey;
    order: SortOrder;
}

export function SortableList({ items, sortBy, order }: SortableListProps): React.ReactElement {
    const sortedItems = [...items].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'value') {
            comparison = a.value - b.value;
        }

        return order === 'desc' ? -comparison : comparison;
    });

    return (
        <table className="sortable-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {sortedItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td>{item.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ===========================================
// Example 6: Fragments in Lists
// ===========================================
interface DefinitionItem {
    id: string;
    term: string;
    definition: string;
}

interface DefinitionListProps {
    items: DefinitionItem[];
}

export function DefinitionList({ items }: DefinitionListProps): React.ReactElement {
    return (
        <dl className="definition-list">
            {items.map((item) => (
                // Use React.Fragment with key for multiple elements
                <React.Fragment key={item.id}>
                    <dt>{item.term}</dt>
                    <dd>{item.definition}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}

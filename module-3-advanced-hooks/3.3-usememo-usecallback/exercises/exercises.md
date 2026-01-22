# useMemo & useCallback Exercises

Practice memoization techniques to optimize React performance.

---

## Exercise 1: Product Filter with Memoization

Create a product filter component that uses `useMemo` to optimize:
- Filtering by search query
- Filtering by category
- Sorting by price/name
- Calculating stats (count, average price, etc.)

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

function ProductFilter({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [inStockOnly, setInStockOnly] = useState(false);

  // TODO: Use useMemo for:
  // 1. filteredProducts
  // 2. categories (unique list)
  // 3. stats (count, avgPrice, minPrice, maxPrice)
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useState, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

function ProductFilter({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Memoize unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Memoize filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.price - b.price;
    });

    return result;
  }, [products, search, category, inStockOnly, sortBy]);

  // Memoize stats
  const stats = useMemo(() => {
    if (filteredProducts.length === 0) {
      return { count: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 };
    }
    
    const prices = filteredProducts.map(p => p.price);
    return {
      count: filteredProducts.length,
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [filteredProducts]);

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
      />
      
      <select value={category ?? ''} onChange={e => setCategory(e.target.value || null)}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={e => setInStockOnly(e.target.checked)}
        />
        In Stock Only
      </label>

      <div className="stats">
        <p>Showing {stats.count} products</p>
        <p>Price: ${stats.minPrice} - ${stats.maxPrice}</p>
        <p>Average: ${stats.avgPrice.toFixed(2)}</p>
      </div>

      <ul>
        {filteredProducts.map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

</details>

---

## Exercise 2: Optimized Data Table

Build a data table component with memoized child rows:

```tsx
interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DataTableProps {
  data: Row[];
  onRowClick: (id: string) => void;
  onRowDelete: (id: string) => void;
}

// TODO:
// 1. Create a memoized TableRow component
// 2. Use useCallback for handlers
// 3. Prevent unnecessary re-renders when one row changes
```

<details>
<summary>💡 Solution</summary>

```tsx
import { memo, useCallback, useState } from 'react';

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TableRowProps {
  row: Row;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const TableRow = memo(function TableRow({
  row,
  isSelected,
  onSelect,
  onDelete,
}: TableRowProps) {
  console.log(`Rendering row: ${row.name}`);
  
  return (
    <tr className={isSelected ? 'selected' : ''}>
      <td onClick={() => onSelect(row.id)}>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.role}</td>
      <td>
        <button onClick={() => onDelete(row.id)}>Delete</button>
      </td>
    </tr>
  );
});

function DataTable({ data }: { data: Row[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rows, setRows] = useState(data);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setRows(prev => prev.filter(row => row.id !== id));
    setSelectedId(prev => prev === id ? null : prev);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <TableRow
            key={row.id}
            row={row}
            isSelected={row.id === selectedId}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
```

</details>

---

## Exercise 3: Debounced Search with useCallback

Create a search component with debounced API calls:

```tsx
// TODO:
// 1. Use useCallback for the debounced search function
// 2. Use useMemo to create the debounced version
// 3. Clean up on unmount
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useState, useCallback, useMemo, useEffect } from 'react';

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout;
  
  const debounced = ((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => clearTimeout(timeoutId);
  
  return debounced;
}

function SearchWithDebounce() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce(fetchResults, 300),
    [fetchResults]
  );

  useEffect(() => {
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  }, [query, debouncedFetch]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <span>Loading...</span>}
      <ul>
        {results.map((result, i) => (
          <li key={i}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
```

</details>

---

## Challenge: Virtual List with Memoization

Build a virtualized list that only renders visible items:
- Calculate visible range based on scroll position
- Memoize visible items
- Use memoized row components
- Implement smooth scrolling

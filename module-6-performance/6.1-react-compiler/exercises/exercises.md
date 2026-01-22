# React Compiler Examples & Exercises

## Understanding React Compiler

React Compiler automatically optimizes your code by adding memoization.

### Example: Before vs After Compiler

```tsx
// Your Code (what you write)
function ProductCard({ product }: { product: Product }) {
  const formattedPrice = formatPrice(product.price);
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
    </div>
  );
}

// What Compiler Generates (conceptually)
function ProductCard({ product }: { product: Product }) {
  const formattedPrice = useMemo(
    () => formatPrice(product.price),
    [product.price]
  );
  
  return useMemo(
    () => (
      <div className="product-card">
        <h3>{product.name}</h3>
        <p>{formattedPrice}</p>
      </div>
    ),
    [product.name, formattedPrice]
  );
}
```

---

## Exercises

### Exercise 1: Identify Optimization Opportunities

Look at this code - what would React Compiler optimize?

```tsx
function Dashboard({ user, orders }) {
  const stats = calculateStats(orders);
  const recentOrders = orders.slice(0, 5);
  
  const handleExport = () => {
    exportToCsv(orders);
  };
  
  return (
    <div>
      <UserHeader user={user} />
      <StatsPanel stats={stats} />
      <OrderList orders={recentOrders} onExport={handleExport} />
    </div>
  );
}
```

<details>
<summary>💡 Answer</summary>

The compiler would automatically memoize:
1. `stats` calculation (like useMemo)
2. `recentOrders` slice (like useMemo)
3. `handleExport` function (like useCallback)
4. The entire JSX return (like memo)

You don't need to manually add these optimizations!
</details>

---

### Exercise 2: Writing Compiler-Friendly Code

What's wrong with this code for the compiler?

```tsx
function BadExample({ items }) {
  // Mutating during render
  items.sort((a, b) => a.name.localeCompare(b.name));
  
  // Reading from external mutable source
  const theme = window.currentTheme;
  
  return (
    <ul style={{ color: theme.color }}>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

<details>
<summary>💡 Answer</summary>

Problems:
1. `items.sort()` mutates the prop directly
2. `window.currentTheme` is an external mutable source

Fixed version:

```tsx
function GoodExample({ items }) {
  // Create new sorted array, don't mutate
  const sortedItems = [...items].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Use React state or context for theme
  const theme = useTheme();
  
  return (
    <ul style={{ color: theme.color }}>
      {sortedItems.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```
</details>

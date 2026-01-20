# 6.3 Performance Optimization Patterns

## 📚 Learning Objectives

- Implement code splitting
- Use lazy loading
- Optimize re-renders

---

## 🔪 Code Splitting with lazy()

```tsx
import { lazy, Suspense } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App(): React.ReactElement {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 🔄 Virtualization for Long Lists

```tsx
// Use react-window for large lists
import { FixedSizeList } from 'react-window';

interface Item {
  id: number;
  name: string;
}

function VirtualList({ items }: { items: Item[] }): React.ReactElement {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

---

## 🧠 Memoization Pattern

```tsx
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive child
const ExpensiveChild = memo(function ExpensiveChild({ 
  data, 
  onClick 
}: { 
  data: Data; 
  onClick: () => void;
}): React.ReactElement {
  return <div onClick={onClick}>{data.value}</div>;
});

function Parent({ items }: { items: Item[] }): React.ReactElement {
  // Memoize computed value
  const processedData = useMemo(() => 
    items.map(item => expensiveTransform(item)),
    [items]
  );
  
  // Memoize callback
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <ExpensiveChild data={processedData} onClick={handleClick} />;
}
```

---

## 📊 Profiling

```tsx
import { Profiler } from 'react';

function onRender(
  id: string,
  phase: string,
  actualDuration: number
): void {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}

function App(): React.ReactElement {
  return (
    <Profiler id="App" onRender={onRender}>
      <MyComponent />
    </Profiler>
  );
}
```

---

## ✅ Optimization Checklist

| Pattern | Use When |
|---------|----------|
| `lazy()` | Large components, routes |
| Virtualization | 100+ list items |
| `memo()` | Expensive child + stable props |
| `useMemo` | Expensive calculations |
| `useCallback` | Callbacks to memoized children |

---

## 📝 Summary

- Code split with `lazy()` and `Suspense`
- Virtualize long lists
- Memoize expensive components and values
- Profile to find bottlenecks

---

[← Previous: 6.2 Asset Loading](../6.2-asset-loading/) | [Next: 6.4 Best Practices →](../6.4-best-practices/)

# Optimization Patterns Exercises

## Exercise 1: Implement Code Splitting

Convert this monolithic import to use lazy loading:

```tsx
// Before
import { HeavyComponent } from './HeavyComponent';
import { Analytics } from './Analytics';
import { RichEditor } from './RichEditor';

function App() {
  const [showEditor, setShowEditor] = useState(false);
  
  return (
    <div>
      <HeavyComponent />
      <Analytics />
      {showEditor && <RichEditor />}
    </div>
  );
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { lazy, Suspense, useState } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
const Analytics = lazy(() => import('./Analytics'));
const RichEditor = lazy(() => import('./RichEditor'));

function App() {
  const [showEditor, setShowEditor] = useState(false);
  
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
      
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
      
      {showEditor && (
        <Suspense fallback={<div>Loading editor...</div>}>
          <RichEditor />
        </Suspense>
      )}
    </div>
  );
}
```
</details>

---

## Exercise 2: Optimize Search with useDeferredValue

Fix this search that lags on every keystroke:

```tsx
function Search() {
  const [query, setQuery] = useState('');
  
  // This causes lag on every keystroke
  const results = expensiveFilter(allItems, query);
  
  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultsList results={results} />
    </div>
  );
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useState, useDeferredValue, useMemo } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  const results = useMemo(
    () => expensiveFilter(allItems, deferredQuery),
    [deferredQuery]
  );
  
  const isStale = query !== deferredQuery;
  
  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <ResultsList results={results} />
      </div>
    </div>
  );
}
```
</details>

---

## Exercise 3: Create a Virtual Scroll List

Implement virtualization for 10,000 items:

<details>
<summary>💡 Solution</summary>

```tsx
import { useState, useMemo } from 'react';

interface VirtualListProps {
  items: any[];
  itemHeight: number;
  windowHeight: number;
  overscan?: number;
}

function VirtualList({ 
  items, 
  itemHeight, 
  windowHeight,
  overscan = 3 
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const { startIndex, endIndex, offsetY, totalHeight } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(windowHeight / itemHeight);
    const end = Math.min(items.length, start + visibleCount + overscan * 2);
    
    return {
      startIndex: start,
      endIndex: end,
      offsetY: start * itemHeight,
      totalHeight: items.length * itemHeight,
    };
  }, [scrollTop, itemHeight, windowHeight, items.length, overscan]);
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height: windowHeight, overflow: 'auto' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)` 
          }}
        >
          {visibleItems.map((item, i) => (
            <div 
              key={startIndex + i} 
              style={{ height: itemHeight }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```
</details>

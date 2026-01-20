# Exercise 1.5: Search Box Component

## Task

Create a `SearchBox` component that:
1. Updates search query in real-time
2. Shows "Searching..." indicator while typing
3. Clears input on Escape key
4. Submits on Enter key

---

## Solution

```tsx
import React, { useState } from 'react';

interface SearchResult {
  query: string;
  timestamp: Date;
}

function SearchBox(): React.ReactElement {
  const [query, setQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [lastSearch, setLastSearch] = useState<SearchResult | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    setIsTyping(true);
    
    // Simulate debounce - stop "typing" indicator after 500ms
    setTimeout(() => setIsTyping(false), 500);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      setQuery('');
      setIsTyping(false);
    }
    
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = (): void => {
    setLastSearch({
      query,
      timestamp: new Date()
    });
    setIsTyping(false);
    console.log('Searching for:', query);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    padding: '20px'
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #3498db',
    borderRadius: '8px',
    outline: 'none'
  };

  return (
    <div style={containerStyle}>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type to search... (Enter to submit, Esc to clear)"
        style={inputStyle}
      />
      
      {isTyping && query && (
        <p style={{ color: '#3498db' }}>🔍 Searching...</p>
      )}
      
      {lastSearch && !isTyping && (
        <p style={{ color: '#27ae60' }}>
          ✅ Searched for "{lastSearch.query}" at {lastSearch.timestamp.toLocaleTimeString()}
        </p>
      )}
      
      <small style={{ color: '#95a5a6' }}>
        Press Enter to search, Escape to clear
      </small>
    </div>
  );
}

export default SearchBox;
```

---

## Key Concepts Demonstrated

1. **Change events**: `React.ChangeEvent<HTMLInputElement>`
2. **Keyboard events**: `React.KeyboardEvent<HTMLInputElement>`
3. **Event key detection**: `event.key === 'Enter'`
4. **Multiple state variables**: query, isTyping, lastSearch

---

## Bonus Challenge

Extend the component with:
1. Debouncing for the search (wait 300ms after typing stops)
2. Loading spinner during "search"
3. Search history dropdown

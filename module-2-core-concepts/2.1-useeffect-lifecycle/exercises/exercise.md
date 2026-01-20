# Exercise 2.1: Live Clock Component

## Task

Create a `LiveClock` component that:
1. Shows the current time (hours:minutes:seconds)
2. Updates every second using setInterval
3. Has pause/resume functionality
4. Properly cleans up on unmount

---

## Solution

```tsx
import React, { useState, useEffect } from 'react';

function LiveClock(): React.ReactElement {
  const [time, setTime] = useState<Date>(new Date());
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return; // Don't set up timer if paused
    
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Cleanup: clear interval
    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused]); // Re-run when pause state changes

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const clockStyle: React.CSSProperties = {
    fontSize: '48px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: isPaused ? '#95a5a6' : '#2c3e50',
    padding: '20px',
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: isPaused ? '#27ae60' : '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  };

  return (
    <div>
      <div style={clockStyle}>
        {formatTime(time)}
        {isPaused && <span style={{ fontSize: '16px' }}> (Paused)</span>}
      </div>
      <div style={{ textAlign: 'center' }}>
        <button 
          style={buttonStyle}
          onClick={() => setIsPaused(prev => !prev)}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
    </div>
  );
}

export default LiveClock;
```

---

## Key Concepts Demonstrated

1. **setInterval in useEffect**: Timer setup and cleanup
2. **Conditional effect**: Early return when paused
3. **Cleanup function**: `clearInterval` prevents memory leaks
4. **Dependency array**: Re-runs when `isPaused` changes

---

## Bonus Challenge

Add the following features:
1. Show date as well as time
2. Allow switching between 12h and 24h format
3. Add a reset button that sets time to 00:00:00

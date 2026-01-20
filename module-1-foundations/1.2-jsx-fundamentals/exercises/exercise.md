# Exercise 1.2: JSX Expressions & Styling

## Task

Create a `UserCard` component that:
1. Uses variables for name and age
2. Shows "Adult" if age >= 18, otherwise "Minor"
3. Has inline styles for a card appearance

---

## Solution

```tsx
import React from 'react';

function UserCard(): React.ReactElement {
  const name: string = "Alice";
  const age: number = 25;
  
  const cardStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '300px'
  };
  
  const nameStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50'
  };
  
  return (
    <div style={cardStyle}>
      <h2 style={nameStyle}>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {age >= 18 ? '✅ Adult' : '👶 Minor'}</p>
    </div>
  );
}

export default UserCard;
```

---

## Bonus Challenge

Extend the component to:
1. Add a profile image using a URL variable
2. Display a list of hobbies using `.map()`
3. Add hover effect styles

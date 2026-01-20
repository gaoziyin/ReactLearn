# Exercise 1.4: Shopping Cart

## Task

Create a `ShoppingCart` component that:
1. Manages cart items with TypeScript interfaces
2. Supports add/remove operations
3. Calculates derived total
4. Shows item count

---

## Solution

```tsx
import React, { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

function ShoppingCart(): React.ReactElement {
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, name: 'React Book', quantity: 1, price: 29.99 },
    { id: 2, name: 'TypeScript Guide', quantity: 2, price: 24.99 }
  ]);

  // Add item
  const addItem = (item: Omit<CartItem, 'id'>): void => {
    const newItem: CartItem = {
      ...item,
      id: Date.now()
    };
    setItems(prev => [...prev, newItem]);
  };

  // Remove item
  const removeItem = (id: number): void => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id: number, quantity: number): void => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Derived state: total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Derived state: item count
  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const containerStyle: React.CSSProperties = {
    maxWidth: '500px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px'
  };

  return (
    <div style={containerStyle}>
      <h2>
        🛒 Shopping Cart 
        <span style={{ 
          backgroundColor: '#3498db', 
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '14px',
          marginLeft: '10px'
        }}>
          {itemCount}
        </span>
      </h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <span>{item.name}</span>
            <div>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                -
              </button>
              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
              <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button 
                onClick={() => removeItem(item.id)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'right',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        Total: ${totalPrice.toFixed(2)}
      </div>
    </div>
  );
}

export default ShoppingCart;
```

---

## Key Concepts Demonstrated

1. **Typed state**: `useState<CartItem[]>`
2. **Immutable updates**: Using spread operator and `.map()/.filter()`
3. **Derived state**: `totalPrice` and `itemCount` calculated from items
4. **Functional updates**: Using `prev =>` pattern

---

## Bonus Challenge

Add the following features:
1. Persist cart to localStorage
2. Add a "Clear Cart" button
3. Show empty cart message when no items

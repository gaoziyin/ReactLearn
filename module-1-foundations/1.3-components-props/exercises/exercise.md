# Exercise 1.3: Product Card Component

## Task

Create a `ProductCard` component with typed props that displays:
1. Product name and image
2. Price with currency symbol ($)
3. A "SALE" badge when `onSale` is true

---

## Solution

```tsx
import React from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  imageUrl: string;
  onSale?: boolean;
}

function ProductCard({ 
  name, 
  price, 
  imageUrl, 
  onSale = false 
}: ProductCardProps): React.ReactElement {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '16px',
    maxWidth: '280px',
    position: 'relative'
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px'
  };

  const formatPrice = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div style={cardStyle}>
      {onSale && <span style={badgeStyle}>SALE</span>}
      <img src={imageUrl} alt={name} style={imageStyle} />
      <h3>{name}</h3>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2ecc71' }}>
        {formatPrice(price)}
      </p>
    </div>
  );
}

export default ProductCard;
```

---

## Usage

```tsx
import ProductCard from './ProductCard';

function App(): React.ReactElement {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <ProductCard 
        name="Wireless Headphones"
        price={79.99}
        imageUrl="https://example.com/headphones.jpg"
        onSale={true}
      />
      <ProductCard 
        name="USB-C Cable"
        price={19.99}
        imageUrl="https://example.com/cable.jpg"
      />
    </div>
  );
}
```

---

## Bonus Challenge

Add the following features:
1. Conditional styling: strikethrough original price if on sale
2. A `discount` prop that calculates the sale price
3. An `onClick` handler prop for the card

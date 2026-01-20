# Exercise 2.2: Payment Status Component

## Task

Create a `PaymentStatus` component that:
1. Displays different UI based on payment status
2. Uses object lookup pattern for clean code
3. Shows retry button only for failed payments

---

## Solution

```tsx
import React from 'react';

type PaymentStatusType = 'pending' | 'processing' | 'success' | 'failed';

interface PaymentStatusProps {
  status: PaymentStatusType;
  amount: number;
  onRetry?: () => void;
}

function PaymentStatus({ status, amount, onRetry }: PaymentStatusProps): React.ReactElement {
  const formatAmount = (value: number): string => `$${value.toFixed(2)}`;

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '400px',
    textAlign: 'center'
  };

  const statusConfig: Record<PaymentStatusType, {
    icon: string;
    message: string;
    bgColor: string;
    textColor: string;
  }> = {
    pending: {
      icon: '⏳',
      message: 'Payment pending',
      bgColor: '#fff3cd',
      textColor: '#856404'
    },
    processing: {
      icon: '🔄',
      message: 'Processing your payment...',
      bgColor: '#cce5ff',
      textColor: '#004085'
    },
    success: {
      icon: '✅',
      message: 'Payment successful!',
      bgColor: '#d4edda',
      textColor: '#155724'
    },
    failed: {
      icon: '❌',
      message: 'Payment failed',
      bgColor: '#f8d7da',
      textColor: '#721c24'
    }
  };

  const config = statusConfig[status];

  return (
    <div style={{
      ...containerStyle,
      backgroundColor: config.bgColor,
      color: config.textColor
    }}>
      <div style={{ fontSize: '48px' }}>{config.icon}</div>
      <h2>{config.message}</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {formatAmount(amount)}
      </p>
      
      {/* Conditional retry button - only for failed status */}
      {status === 'failed' && onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🔄 Retry Payment
        </button>
      )}
      
      {/* Processing spinner */}
      {status === 'processing' && (
        <div style={{ marginTop: '10px' }}>
          <small>Please wait...</small>
        </div>
      )}
    </div>
  );
}

export default PaymentStatus;
```

---

## Usage

```tsx
function App(): React.ReactElement {
  const handleRetry = (): void => {
    console.log('Retrying payment...');
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <PaymentStatus status="pending" amount={99.99} />
      <PaymentStatus status="processing" amount={49.99} />
      <PaymentStatus status="success" amount={149.99} />
      <PaymentStatus status="failed" amount={29.99} onRetry={handleRetry} />
    </div>
  );
}
```

---

## Key Concepts Demonstrated

1. **Object lookup**: Cleaner than switch/case for multiple states
2. **Logical &&**: Conditional button rendering
3. **Type safety**: `PaymentStatusType` union type
4. **Config pattern**: Centralized UI configuration

---

## Bonus Challenge

Add these features:
1. Animation for processing status (pulsing effect)
2. Success confetti effect
3. Error message for failed status

# Exercise 2.4: Checkout Form

## Task

Create a `CheckoutForm` with:
1. Shipping address fields
2. Payment method toggle (Credit Card / PayPal)
3. Credit card fields shown only when selected
4. Form validation

---

## Solution

```tsx
import React, { useState } from 'react';

type PaymentMethod = 'credit-card' | 'paypal';

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
}

interface CreditCardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  fullName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

function CheckoutForm(): React.ReactElement {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    zipCode: ''
  });
  
  const [cardInfo, setCardInfo] = useState<CreditCardInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Shipping validation
    if (!shipping.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shipping.address.trim()) newErrors.address = 'Address is required';
    if (!shipping.city.trim()) newErrors.city = 'City is required';
    if (!shipping.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Credit card validation (only if selected)
    if (paymentMethod === 'credit-card') {
      if (!cardInfo.cardNumber.match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Enter valid 16-digit card number';
      }
      if (!cardInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Use MM/YY format';
      }
      if (!cardInfo.cvv.match(/^\d{3,4}$/)) {
        newErrors.cvv = 'Enter valid CVV';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Order placed!', { shipping, paymentMethod, cardInfo });
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '5px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc3545',
    fontSize: '12px',
    marginBottom: '10px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '20px' }}>
      <h2>🛒 Checkout</h2>
      
      {/* Shipping Section */}
      <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
        <legend>📦 Shipping Address</legend>
        
        <input
          name="fullName"
          placeholder="Full Name"
          value={shipping.fullName}
          onChange={handleShippingChange}
          style={inputStyle}
        />
        {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
        
        <input
          name="address"
          placeholder="Street Address"
          value={shipping.address}
          onChange={handleShippingChange}
          style={inputStyle}
        />
        {errors.address && <p style={errorStyle}>{errors.address}</p>}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 2 }}>
            <input
              name="city"
              placeholder="City"
              value={shipping.city}
              onChange={handleShippingChange}
              style={inputStyle}
            />
            {errors.city && <p style={errorStyle}>{errors.city}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <input
              name="zipCode"
              placeholder="ZIP"
              value={shipping.zipCode}
              onChange={handleShippingChange}
              style={inputStyle}
            />
            {errors.zipCode && <p style={errorStyle}>{errors.zipCode}</p>}
          </div>
        </div>
      </fieldset>
      
      {/* Payment Method */}
      <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
        <legend>💳 Payment Method</legend>
        
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="radio"
            name="paymentMethod"
            value="credit-card"
            checked={paymentMethod === 'credit-card'}
            onChange={() => setPaymentMethod('credit-card')}
          />
          Credit Card
        </label>
        
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
          />
          PayPal
        </label>
        
        {/* Conditional Credit Card Fields */}
        {paymentMethod === 'credit-card' && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <input
              name="cardNumber"
              placeholder="Card Number (16 digits)"
              value={cardInfo.cardNumber}
              onChange={handleCardChange}
              maxLength={16}
              style={inputStyle}
            />
            {errors.cardNumber && <p style={errorStyle}>{errors.cardNumber}</p>}
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <input
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardInfo.expiryDate}
                  onChange={handleCardChange}
                  maxLength={5}
                  style={inputStyle}
                />
                {errors.expiryDate && <p style={errorStyle}>{errors.expiryDate}</p>}
              </div>
              <div>
                <input
                  name="cvv"
                  placeholder="CVV"
                  value={cardInfo.cvv}
                  onChange={handleCardChange}
                  maxLength={4}
                  style={inputStyle}
                />
                {errors.cvv && <p style={errorStyle}>{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'paypal' && (
          <p style={{ color: '#0070ba', marginTop: '10px' }}>
            You will be redirected to PayPal to complete your purchase.
          </p>
        )}
      </fieldset>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}

export default CheckoutForm;
```

---

## Key Concepts Demonstrated

1. **Multiple form sections**: Shipping + Payment
2. **Conditional fields**: Credit card shown only when selected
3. **Union types**: `PaymentMethod` type
4. **Pattern validation**: Card number, expiry, CVV formats
5. **Submit state**: Disable button during submission

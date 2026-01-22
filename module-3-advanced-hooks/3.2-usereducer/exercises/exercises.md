# useReducer Exercises

Practice managing complex state with useReducer.

---

## Exercise 1: Shopping Cart Reducer

Create a shopping cart with useReducer that supports:
- Add item
- Remove item  
- Update quantity
- Apply discount code
- Calculate totals

```tsx
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercent: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: string }
  | { type: 'CLEAR_CART' };
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useReducer } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercent: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: string }
  | { type: 'CLEAR_CART' };

const discountCodes: Record<string, number> = {
  'SAVE10': 10,
  'SAVE20': 20,
  'HALF': 50,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'APPLY_DISCOUNT': {
      const percent = discountCodes[action.payload.toUpperCase()] ?? 0;
      return {
        ...state,
        discountCode: percent > 0 ? action.payload : null,
        discountPercent: percent,
      };
    }
    case 'CLEAR_CART':
      return { items: [], discountCode: null, discountPercent: 0 };
    default:
      return state;
  }
}

function useCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discountCode: null,
    discountPercent: 0,
  });

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * (state.discountPercent / 100);
  const total = subtotal - discount;

  return { state, dispatch, subtotal, discount, total };
}
```

</details>

---

## Exercise 2: Multi-step Form

Build a multi-step form wizard using useReducer:
- Step 1: Personal info (name, email)
- Step 2: Address (street, city, zip)
- Step 3: Review & submit

```tsx
interface FormState {
  step: 1 | 2 | 3;
  data: {
    name: string;
    email: string;
    street: string;
    city: string;
    zip: string;
  };
  errors: Record<string, string>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: string } }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS' };
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useReducer } from 'react';

interface FormState {
  step: 1 | 2 | 3;
  data: {
    name: string;
    email: string;
    street: string;
    city: string;
    zip: string;
  };
  errors: Record<string, string>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: string } }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS' };

const initialState: FormState = {
  step: 1,
  data: { name: '', email: '', street: '', city: '', zip: '' },
  errors: {},
  isSubmitting: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) as 1 | 2 | 3 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) as 1 | 2 | 3 };
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.payload.field]: action.payload.value },
        errors: { ...state.errors, [action.payload.field]: '' },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SUBMIT':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return initialState;
    default:
      return state;
  }
}

function validateStep(step: number, data: FormState['data']): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (step === 1) {
    if (!data.name) errors.name = 'Name is required';
    if (!data.email.includes('@')) errors.email = 'Valid email required';
  }
  
  if (step === 2) {
    if (!data.street) errors.street = 'Street is required';
    if (!data.city) errors.city = 'City is required';
    if (!data.zip) errors.zip = 'ZIP is required';
  }
  
  return errors;
}

function useMultiStepForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const nextStep = () => {
    const errors = validateStep(state.step, state.data);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors });
      return false;
    }
    dispatch({ type: 'NEXT_STEP' });
    return true;
  };

  const prevStep = () => dispatch({ type: 'PREV_STEP' });
  
  const updateField = (field: string, value: string) => 
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });

  const submit = async () => {
    dispatch({ type: 'SUBMIT' });
    await new Promise(r => setTimeout(r, 1000));
    dispatch({ type: 'SUBMIT_SUCCESS' });
  };

  return { state, nextStep, prevStep, updateField, submit };
}
```

</details>

---

## Exercise 3: Undo/Redo History

Create a drawing canvas state with undo/redo functionality:

```tsx
interface CanvasState {
  shapes: Array<{ id: string; type: string; x: number; y: number }>;
  past: CanvasState['shapes'][];
  future: CanvasState['shapes'][];
}

type CanvasAction =
  | { type: 'ADD_SHAPE'; payload: { type: string; x: number; y: number } }
  | { type: 'DELETE_SHAPE'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };
```

<details>
<summary>💡 Solution</summary>

```tsx
interface CanvasState {
  shapes: Array<{ id: string; type: string; x: number; y: number }>;
  past: CanvasState['shapes'][];
  future: CanvasState['shapes'][];
}

type CanvasAction =
  | { type: 'ADD_SHAPE'; payload: { type: string; x: number; y: number } }
  | { type: 'DELETE_SHAPE'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_SHAPE':
      return {
        shapes: [
          ...state.shapes,
          { id: Date.now().toString(), ...action.payload },
        ],
        past: [...state.past, state.shapes],
        future: [],
      };
    case 'DELETE_SHAPE':
      return {
        shapes: state.shapes.filter(s => s.id !== action.payload),
        past: [...state.past, state.shapes],
        future: [],
      };
    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        shapes: previous,
        past: state.past.slice(0, -1),
        future: [state.shapes, ...state.future],
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        shapes: next,
        past: [...state.past, state.shapes],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
}
```

</details>

---

## Challenge: Game State

Build a simple game state manager with useReducer:
- Player health, score, level
- Enemies array
- Power-ups
- Game status (playing, paused, game over)
- Multiple game actions (attack, heal, level up, etc.)

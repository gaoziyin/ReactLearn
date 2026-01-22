# useContext Exercises

Practice creating and using React Context with these exercises.

---

## Exercise 1: Language Context

Create a language/locale context that:
- Stores the current language (e.g., 'en', 'es', 'zh')
- Provides a function to change the language
- Includes a translations object

```tsx
// Your implementation here

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string; // Translation function
}

// Create the context, provider, and hook
```

<details>
<summary>💡 Solution</summary>

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'zh';

const translations: Record<Language, Record<string, string>> = {
  en: { greeting: 'Hello', goodbye: 'Goodbye' },
  es: { greeting: 'Hola', goodbye: 'Adiós' },
  zh: { greeting: '你好', goodbye: '再见' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

</details>

---

## Exercise 2: Shopping Cart Context

Build a shopping cart context with:
- Cart items array
- Add/remove item functions
- Calculate total price
- Clear cart function

```tsx
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>): void => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string): void => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const total = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
}
```

</details>

---

## Exercise 3: Modal Context

Create a modal/dialog management context:
- Open/close modal functions
- Support for multiple modal types
- Pass data to modals

```tsx
// Implement a ModalProvider that can:
// 1. Open different types of modals
// 2. Pass data to the modal
// 3. Handle modal closing with result

function Example() {
  const { openModal } = useModal();
  
  const handleDelete = async () => {
    const confirmed = await openModal('confirm', {
      title: 'Delete Item?',
      message: 'This action cannot be undone.',
    });
    
    if (confirmed) {
      // Delete the item
    }
  };
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ModalType = 'confirm' | 'alert' | 'form';

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: Record<string, unknown>;
  resolve: ((value: unknown) => void) | null;
}

interface ModalContextType {
  modalState: ModalState;
  openModal: <T>(type: ModalType, data?: Record<string, unknown>) => Promise<T>;
  closeModal: (result?: unknown) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: {},
    resolve: null,
  });

  const openModal = useCallback(<T,>(
    type: ModalType,
    data: Record<string, unknown> = {}
  ): Promise<T> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type,
        data,
        resolve: resolve as (value: unknown) => void,
      });
    });
  }, []);

  const closeModal = useCallback((result?: unknown): void => {
    modalState.resolve?.(result);
    setModalState({
      isOpen: false,
      type: null,
      data: {},
      resolve: null,
    });
  }, [modalState.resolve]);

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
```

</details>

---

## Challenge: Combine All Contexts

Create an `AppProviders` component that combines:
1. Theme context
2. Auth context  
3. Cart context
4. Language context

Then build a small app that uses all of them together!

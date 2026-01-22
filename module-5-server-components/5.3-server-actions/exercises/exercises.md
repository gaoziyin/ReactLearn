# Server Actions Exercises

Practice building data mutations with Server Actions.

---

## Exercise 1: Todo CRUD

Create a todo app with Server Actions:
- Add todo
- Toggle completion
- Delete todo
- All with database operations

<details>
<summary>💡 Solution</summary>

```tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function addTodo(formData: FormData) {
  const text = formData.get('text') as string;
  
  if (!text?.trim()) {
    return { error: 'Text is required' };
  }

  // await db.todo.create({ 
  //   data: { text, completed: false } 
  // });

  revalidatePath('/todos');
  return { success: true };
}

export async function toggleTodo(id: string) {
  // const todo = await db.todo.findUnique({ where: { id } });
  // await db.todo.update({
  //   where: { id },
  //   data: { completed: !todo.completed }
  // });

  revalidatePath('/todos');
}

export async function deleteTodo(id: string) {
  // await db.todo.delete({ where: { id } });
  revalidatePath('/todos');
}

// components/TodoList.tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleTodo, deleteTodo } from '@/app/actions';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList({ todos }: { todos: Todo[] }) {
  const [isPending, startTransition] = useTransition();
  
  const [optimisticTodos, updateTodo] = useOptimistic(
    todos,
    (state, { id, action }: { id: string; action: 'toggle' | 'delete' }) => {
      if (action === 'delete') {
        return state.filter(t => t.id !== id);
      }
      return state.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
    }
  );

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              startTransition(async () => {
                updateTodo({ id: todo.id, action: 'toggle' });
                await toggleTodo(todo.id);
              });
            }}
          />
          <span>{todo.text}</span>
          <button
            onClick={() => {
              startTransition(async () => {
                updateTodo({ id: todo.id, action: 'delete' });
                await deleteTodo(todo.id);
              });
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

</details>

---

## Exercise 2: Shopping Cart Actions

Build cart server actions with validation:
- Add to cart (check stock)
- Update quantity
- Remove item
- Apply coupon code

<details>
<summary>💡 Solution</summary>

```tsx
// app/cart/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addToCart(productId: string, quantity: number = 1) {
  // Check stock
  // const product = await db.product.findUnique({ where: { id: productId } });
  // if (!product || product.stock < quantity) {
  //   return { error: 'Not enough stock' };
  // }

  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  // await db.cartItem.upsert({
  //   where: { cartId_productId: { cartId, productId } },
  //   create: { cartId, productId, quantity },
  //   update: { quantity: { increment: quantity } }
  // });

  revalidatePath('/cart');
  return { success: true };
}

export async function updateQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  // await db.cartItem.update({
  //   where: { id: itemId },
  //   data: { quantity }
  // });

  revalidatePath('/cart');
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  // await db.cartItem.delete({ where: { id: itemId } });
  revalidatePath('/cart');
  return { success: true };
}

export async function applyCoupon(
  prevState: any,
  formData: FormData
) {
  const code = formData.get('code') as string;

  // const coupon = await db.coupon.findUnique({ where: { code } });
  // if (!coupon || coupon.expiresAt < new Date()) {
  //   return { error: 'Invalid or expired coupon' };
  // }

  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  // await db.cart.update({
  //   where: { id: cartId },
  //   data: { couponId: coupon.id }
  // });

  revalidatePath('/cart');
  return { success: true, discount: 10 };
}
```

</details>

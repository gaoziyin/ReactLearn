# Directives Exercises

Practice using "use client" and "use server" directives.

---

## Exercise 1: Interactive Card

Create a product card that:
- Shows server-rendered content
- Has a "use client" add-to-cart button
- Updates state on client

<details>
<summary>💡 Solution</summary>

```tsx
// components/AddToCartButton.tsx
'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
  onAdd: (id: string) => Promise<void>;
}

export function AddToCartButton({ productId, onAdd }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    await onAdd(productId);
    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={isAdding}
    >
      {isAdding ? 'Adding...' : added ? '✓ Added!' : 'Add to Cart'}
    </button>
  );
}

// app/products/page.tsx (Server Component)
import { AddToCartButton } from '@/components/AddToCartButton';
import { addToCart } from '@/app/actions';

async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="products">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <AddToCartButton 
            productId={product.id}
            onAdd={addToCart}
          />
        </div>
      ))}
    </div>
  );
}
```

</details>

---

## Exercise 2: Form with Server Action

Create a newsletter signup with server action:
- Form runs on client
- Submission handled by server action
- Show success/error states

<details>
<summary>💡 Solution</summary>

```tsx
// app/actions.ts
'use server';

export async function subscribeToNewsletter(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  
  if (!email.includes('@')) {
    return { error: 'Invalid email address' };
  }
  
  // Simulate API call
  await new Promise(r => setTimeout(r, 1000));
  
  // await db.newsletter.create({ data: { email } });
  
  return { success: true };
}

// components/NewsletterForm.tsx
'use client';

import { useActionState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    null
  );

  if (state?.success) {
    return <p className="success">Thanks for subscribing!</p>;
  }

  return (
    <form action={formAction}>
      <input 
        name="email" 
        type="email" 
        placeholder="Enter your email" 
        required 
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Subscribing...' : 'Subscribe'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

</details>

---

## Exercise 3: Hybrid Component Pattern

Build a comments section:
- Server fetches initial comments
- Client handles new comment submission
- Optimistic updates for new comments

<details>
<summary>💡 Solution</summary>

```tsx
// app/actions.ts
'use server';

export async function addComment(postId: string, text: string) {
  // await db.comment.create({ data: { postId, text } });
  return { id: Date.now().toString(), text, author: 'You' };
}

// components/CommentForm.tsx
'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { addComment } from '@/app/actions';

interface Comment {
  id: string;
  text: string;
  author: string;
}

interface CommentFormProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentFormProps) {
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();
  
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, newComment]
  );

  const handleSubmit = async (formData: FormData) => {
    const text = formData.get('text') as string;
    
    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      text,
      author: 'You',
    };
    
    startTransition(async () => {
      addOptimisticComment(optimistic);
      const newComment = await addComment(postId, text);
      setComments(prev => [...prev, newComment]);
    });
  };

  return (
    <div>
      <ul>
        {optimisticComments.map(c => (
          <li key={c.id}>{c.author}: {c.text}</li>
        ))}
      </ul>
      
      <form action={handleSubmit}>
        <input name="text" placeholder="Add comment..." />
        <button disabled={isPending}>Post</button>
      </form>
    </div>
  );
}

// app/posts/[id]/page.tsx
import { CommentSection } from '@/components/CommentSection';

async function getComments(postId: string) {
  const res = await fetch(`/api/posts/${postId}/comments`);
  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const comments = await getComments(params.id);
  
  return (
    <main>
      <h1>Post</h1>
      <CommentSection postId={params.id} initialComments={comments} />
    </main>
  );
}
```

</details>

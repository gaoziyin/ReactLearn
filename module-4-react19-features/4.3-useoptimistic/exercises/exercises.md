# useOptimistic Exercises

Practice creating responsive UIs with optimistic updates.

---

## Exercise 1: Bookmark Toggle

Create a bookmark button with optimistic UI:
- Toggle bookmark state instantly
- Sync with server in background
- Handle errors gracefully
- Show pending state visually

```tsx
interface Article {
  id: string;
  title: string;
  isBookmarked: boolean;
}

function BookmarkButton({ article }: { article: Article }) {
  // TODO: Implement optimistic bookmark toggle
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useOptimistic, useState } from 'react';

interface Article {
  id: string;
  title: string;
  isBookmarked: boolean;
}

async function toggleBookmark(id: string, bookmarked: boolean): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (Math.random() < 0.1) throw new Error('Failed');
}

function BookmarkButton({ article }: { article: Article }) {
  const [actualArticle, setActualArticle] = useState(article);
  
  const [optimisticArticle, setOptimisticArticle] = useOptimistic(
    actualArticle,
    (current, isBookmarked: boolean) => ({ ...current, isBookmarked })
  );

  const handleToggle = async () => {
    const newState = !optimisticArticle.isBookmarked;
    setOptimisticArticle(newState);
    
    try {
      await toggleBookmark(article.id, newState);
      setActualArticle(prev => ({ ...prev, isBookmarked: newState }));
    } catch (error) {
      // Automatically reverts on error
      console.error('Failed to update bookmark');
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className={optimisticArticle.isBookmarked ? 'bookmarked' : ''}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
      }}
    >
      {optimisticArticle.isBookmarked ? '🔖' : '📑'}
    </button>
  );
}
```

</details>

---

## Exercise 2: Rating Component

Build a star rating component with optimistic updates:
- Show 5 stars
- Click to rate
- Update optimistically
- Show loading state on the selected star

```tsx
interface Product {
  id: string;
  name: string;
  userRating: number | null; // 1-5 or null
  averageRating: number;
}

function StarRating({ product }: { product: Product }) {
  // TODO: Implement
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useOptimistic, useState } from 'react';

interface Product {
  id: string;
  name: string;
  userRating: number | null;
  averageRating: number;
}

async function submitRating(productId: string, rating: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800));
}

function StarRating({ product }: { product: Product }) {
  const [actualProduct, setActualProduct] = useState(product);
  const [isPending, setIsPending] = useState(false);
  
  const [optimisticProduct, setOptimisticProduct] = useOptimistic(
    actualProduct,
    (current, rating: number) => ({ ...current, userRating: rating })
  );

  const handleRate = async (rating: number) => {
    if (isPending) return;
    
    setIsPending(true);
    setOptimisticProduct(rating);
    
    try {
      await submitRating(product.id, rating);
      setActualProduct(prev => ({ ...prev, userRating: rating }));
    } catch (error) {
      console.error('Failed to submit rating');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="star-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            disabled={isPending}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: isPending ? 'wait' : 'pointer',
              opacity: isPending && star === optimisticProduct.userRating ? 0.5 : 1,
            }}
          >
            {star <= (optimisticProduct.userRating ?? 0) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      {optimisticProduct.userRating && (
        <p>Your rating: {optimisticProduct.userRating}/5</p>
      )}
    </div>
  );
}
```

</details>

---

## Exercise 3: Comment Thread

Create a comment section with optimistic posting:
- Add new comments optimistically
- Show "posting..." indicator
- Handle failures with retry option
- Delete comments optimistically

```tsx
interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  isPending?: boolean;
  failed?: boolean;
}

function CommentSection({ postId }: { postId: string }) {
  // TODO: Implement
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useOptimistic, useState, useRef } from 'react';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  isPending?: boolean;
  failed?: boolean;
}

async function postComment(postId: string, text: string): Promise<Comment> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() < 0.2) throw new Error('Failed');
  return {
    id: Date.now().toString(),
    text,
    author: 'You',
    createdAt: new Date().toISOString(),
  };
}

async function deleteComment(commentId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
}

function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (state, action: { type: 'add' | 'delete'; comment?: Comment; id?: string }) => {
      if (action.type === 'add' && action.comment) {
        return [...state, action.comment];
      }
      if (action.type === 'delete' && action.id) {
        return state.filter(c => c.id !== action.id);
      }
      return state;
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputRef.current?.value;
    if (!text?.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      text,
      author: 'You',
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    setOptimisticComments({ type: 'add', comment: optimisticComment });
    inputRef.current!.value = '';

    try {
      const newComment = await postComment(postId, text);
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      // Could show error state instead of just reverting
      console.error('Failed to post comment');
    }
  };

  const handleDelete = async (id: string) => {
    setOptimisticComments({ type: 'delete', id });
    
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete');
    }
  };

  return (
    <div className="comment-section">
      <div className="comments">
        {optimisticComments.map(comment => (
          <div 
            key={comment.id} 
            className={`comment ${comment.isPending ? 'pending' : ''}`}
            style={{ opacity: comment.isPending ? 0.6 : 1 }}
          >
            <strong>{comment.author}</strong>
            <p>{comment.text}</p>
            {comment.isPending && <span>Posting...</span>}
            {!comment.isPending && (
              <button onClick={() => handleDelete(comment.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} placeholder="Add a comment..." />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
```

</details>

---

## Challenge: Kanban Board

Create a Kanban board with optimistic drag-and-drop:
- Multiple columns (Todo, In Progress, Done)
- Drag cards between columns
- Optimistically update position
- Handle reorder failures
- Animate transitions

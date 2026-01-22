// useOptimistic Examples
// React 19 with TypeScript

import React, { useOptimistic, useActionState, useState } from 'react';

// ===========================================
// Example 1: Like Button with Optimistic UI
// ===========================================
interface Post {
    id: string;
    title: string;
    likes: number;
    isLiked: boolean;
}

async function likePost(postId: string): Promise<{ likes: number }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate occasional failure
    if (Math.random() < 0.1) {
        throw new Error('Failed to like post');
    }

    return { likes: Math.floor(Math.random() * 100) + 1 };
}

export function LikeButton({ post }: { post: Post }): React.ReactElement {
    const [optimisticPost, setOptimisticPost] = useOptimistic(
        post,
        (currentPost, newLiked: boolean) => ({
            ...currentPost,
            isLiked: newLiked,
            likes: newLiked ? currentPost.likes + 1 : currentPost.likes - 1,
        })
    );

    const handleLike = async () => {
        const newLiked = !optimisticPost.isLiked;
        setOptimisticPost(newLiked);

        try {
            await likePost(post.id);
        } catch (error) {
            // On error, the optimistic update will automatically revert
            console.error('Failed to update like:', error);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={optimisticPost.isLiked ? 'liked' : ''}
        >
            {optimisticPost.isLiked ? '❤️' : '🤍'} {optimisticPost.likes}
        </button>
    );
}

// ===========================================
// Example 2: Todo List with Optimistic Updates
// ===========================================
interface Todo {
    id: string;
    text: string;
    completed: boolean;
    pending?: boolean; // For visual feedback
}

async function updateTodo(id: string, completed: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
}

async function deleteTodo(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
}

export function OptimisticTodoList({ initialTodos }: { initialTodos: Todo[] }): React.ReactElement {
    const [todos, setTodos] = useState(initialTodos);

    const [optimisticTodos, setOptimisticTodos] = useOptimistic(
        todos,
        (state, action: { type: 'toggle' | 'delete'; id: string }) => {
            switch (action.type) {
                case 'toggle':
                    return state.map(todo =>
                        todo.id === action.id
                            ? { ...todo, completed: !todo.completed, pending: true }
                            : todo
                    );
                case 'delete':
                    return state.filter(todo => todo.id !== action.id);
                default:
                    return state;
            }
        }
    );

    const handleToggle = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        setOptimisticTodos({ type: 'toggle', id });

        try {
            await updateTodo(id, !todo.completed);
            // Update actual state after success
            setTodos(prev =>
                prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            );
        } catch (error) {
            console.error('Failed to update todo');
            // Optimistic state will revert automatically
        }
    };

    const handleDelete = async (id: string) => {
        setOptimisticTodos({ type: 'delete', id });

        try {
            await deleteTodo(id);
            setTodos(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete todo');
        }
    };

    return (
        <ul className="todo-list">
            {optimisticTodos.map(todo => (
                <li
                    key={todo.id}
                    className={`${todo.completed ? 'completed' : ''} ${todo.pending ? 'pending' : ''}`}
                >
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo.id)}
                    />
                    <span>{todo.text}</span>
                    <button onClick={() => handleDelete(todo.id)}>×</button>
                </li>
            ))}
        </ul>
    );
}

// ===========================================
// Example 3: Message Sending with Optimistic UI
// ===========================================
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    status?: 'sending' | 'sent' | 'failed';
}

async function sendMessage(text: string): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (Math.random() < 0.2) {
        throw new Error('Network error');
    }

    return {
        id: Date.now().toString(),
        text,
        sender: 'user',
        status: 'sent',
    };
}

export function ChatInput({
    messages,
    onMessageSent
}: {
    messages: Message[];
    onMessageSent: (message: Message) => void;
}): React.ReactElement {
    const [optimisticMessages, setOptimisticMessages] = useOptimistic(
        messages,
        (state, newMessage: Message) => [...state, newMessage]
    );

    const handleSubmit = async (formData: FormData) => {
        const text = formData.get('message') as string;
        if (!text.trim()) return;

        // Create optimistic message
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            text,
            sender: 'user',
            status: 'sending',
        };

        setOptimisticMessages(optimisticMessage);

        try {
            const sentMessage = await sendMessage(text);
            onMessageSent(sentMessage);
        } catch (error) {
            // Message will revert, could also show error state
            console.error('Failed to send message');
        }
    };

    return (
        <div className="chat">
            <div className="messages">
                {optimisticMessages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.sender} ${msg.status || ''}`}
                    >
                        {msg.text}
                        {msg.status === 'sending' && <span className="sending-indicator">⏳</span>}
                    </div>
                ))}
            </div>

            <form action={handleSubmit}>
                <input name="message" placeholder="Type a message..." />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

// ===========================================
// Example 4: Shopping Cart with Optimistic Updates
// ===========================================
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

async function updateCartQuantity(id: string, quantity: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
}

export function CartItem({
    item,
    onUpdate
}: {
    item: CartItem;
    onUpdate: (id: string, quantity: number) => void;
}): React.ReactElement {
    const [optimisticItem, setOptimisticItem] = useOptimistic(
        item,
        (current, newQuantity: number) => ({ ...current, quantity: newQuantity })
    );

    const handleQuantityChange = async (delta: number) => {
        const newQuantity = Math.max(0, optimisticItem.quantity + delta);
        setOptimisticItem(newQuantity);

        try {
            await updateCartQuantity(item.id, newQuantity);
            onUpdate(item.id, newQuantity);
        } catch (error) {
            console.error('Failed to update quantity');
        }
    };

    return (
        <div className="cart-item">
            <span>{optimisticItem.name}</span>
            <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{optimisticItem.quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <span>${(optimisticItem.price * optimisticItem.quantity).toFixed(2)}</span>
        </div>
    );
}

// ===========================================
// Example 5: Follow Button with Loading States
// ===========================================
interface User {
    id: string;
    name: string;
    isFollowing: boolean;
    followerCount: number;
}

async function toggleFollow(userId: string, follow: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
}

export function FollowButton({ user, onFollowChange }: {
    user: User;
    onFollowChange: (user: User) => void;
}): React.ReactElement {
    const [optimisticUser, setOptimisticUser] = useOptimistic(
        user,
        (current, isFollowing: boolean) => ({
            ...current,
            isFollowing,
            followerCount: current.followerCount + (isFollowing ? 1 : -1),
        })
    );

    const [isPending, setIsPending] = useState(false);

    const handleFollow = async () => {
        const newFollowState = !optimisticUser.isFollowing;
        setIsPending(true);
        setOptimisticUser(newFollowState);

        try {
            await toggleFollow(user.id, newFollowState);
            onFollowChange({
                ...user,
                isFollowing: newFollowState,
                followerCount: user.followerCount + (newFollowState ? 1 : -1),
            });
        } catch (error) {
            console.error('Failed to update follow status');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="user-card">
            <span>{user.name}</span>
            <span>{optimisticUser.followerCount} followers</span>
            <button
                onClick={handleFollow}
                className={optimisticUser.isFollowing ? 'following' : ''}
                disabled={isPending}
            >
                {isPending ? '...' : optimisticUser.isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );
}

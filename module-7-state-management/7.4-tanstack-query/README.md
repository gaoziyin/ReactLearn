# 7.4 TanStack Query (React Query)

## 📚 Learning Objectives

- Understand server state vs client state
- Use queries for data fetching
- Implement mutations with cache invalidation
- Configure caching and refetching

---

## 🚀 What is TanStack Query?

TanStack Query handles server state: fetching, caching, synchronizing.

```bash
npm install @tanstack/react-query
```

---

## 🏪 Setup

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContent />
    </QueryClientProvider>
  );
}
```

---

## 💻 Basic Query

```tsx
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json() as Promise<User>;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
    </div>
  );
}
```

---

## 📦 Mutations

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

---

## ⚡ Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    
    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos']);
    
    // Optimistically update
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo => todo.id === newTodo.id ? newTodo : todo)
    );
    
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

---

## 📝 Summary

- TanStack Query handles server state
- Automatic caching and refetching
- Mutations with cache invalidation
- Optimistic updates for better UX

---

[← Back to Module 7](../README.md) | [Next: 7.5 Jotai & Recoil →](../7.5-jotai-recoil/)

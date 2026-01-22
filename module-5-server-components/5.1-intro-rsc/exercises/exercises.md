# React Server Components Exercises

Practice building with Server Components.

---

## Exercise 1: Blog with Server Components

Create a blog application:
- Server Component for blog list
- Server Component for individual post
- Use Suspense for loading states

<details>
<summary>💡 Solution</summary>

```tsx
// app/blog/page.tsx - Server Component
import { Suspense } from 'react';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}

async function PostList() {
  const posts = await getPosts();
  
  return (
    <ul className="post-list">
      {posts.map(post => (
        <li key={post.id}>
          <a href={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function BlogPage() {
  return (
    <main>
      <h1>Blog</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList />
      </Suspense>
    </main>
  );
}
```

</details>

---

## Exercise 2: Dashboard with Multiple Data Sources

Build a dashboard that fetches from multiple APIs in parallel.

<details>
<summary>💡 Solution</summary>

```tsx
import { Suspense } from 'react';

async function getStats() {
  const res = await fetch('https://api.example.com/stats');
  return res.json();
}

async function getRecentOrders() {
  const res = await fetch('https://api.example.com/orders?limit=5');
  return res.json();
}

async function getNotifications() {
  const res = await fetch('https://api.example.com/notifications');
  return res.json();
}

async function StatsPanel() {
  const stats = await getStats();
  return (
    <div className="stats">
      <div>Revenue: ${stats.revenue}</div>
      <div>Orders: {stats.orders}</div>
      <div>Users: {stats.users}</div>
    </div>
  );
}

async function RecentOrders() {
  const orders = await getRecentOrders();
  return (
    <ul className="orders">
      {orders.map(order => (
        <li key={order.id}>Order #{order.id} - ${order.total}</li>
      ))}
    </ul>
  );
}

async function NotificationList() {
  const notifications = await getNotifications();
  return (
    <ul className="notifications">
      {notifications.map(n => (
        <li key={n.id}>{n.message}</li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsPanel />
      </Suspense>
      
      <div className="grid">
        <Suspense fallback={<div>Loading orders...</div>}>
          <RecentOrders />
        </Suspense>
        
        <Suspense fallback={<div>Loading notifications...</div>}>
          <NotificationList />
        </Suspense>
      </div>
    </div>
  );
}
```

</details>

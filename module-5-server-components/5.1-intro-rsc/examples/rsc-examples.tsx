// React Server Components Examples
// React 19 with TypeScript

// ===========================================
// Example 1: Basic Server Component
// ===========================================
// Server Components are the DEFAULT in React 19 with Next.js
// They run on the server and send HTML to the client

// This is a Server Component - no "use client" directive
interface User {
    id: string;
    name: string;
    email: string;
}

async function getUser(id: string): Promise<User> {
    // This runs on the server - can directly access databases
    const response = await fetch(`https://api.example.com/users/${id}`, {
        cache: 'force-cache', // Server-side caching
    });
    return response.json();
}

// Server Component - can be async!
export async function UserProfile({ userId }: { userId: string }) {
    // Data fetching happens on the server
    const user = await getUser(userId);

    return (
        <div className="user-profile">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}

// ===========================================
// Example 2: Database Access in Server Component
// ===========================================
// In a real app, you'd import your database client
// import { db } from '@/lib/database';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

async function getProducts(): Promise<Product[]> {
    // Direct database access - only possible in Server Components
    // const products = await db.product.findMany();

    // Simulated for example
    return [
        { id: '1', name: 'Widget', price: 29.99, description: 'A great widget' },
        { id: '2', name: 'Gadget', price: 49.99, description: 'An amazing gadget' },
    ];
}

export async function ProductList() {
    const products = await getProducts();

    return (
        <div className="product-grid">
            {products.map(product => (
                <article key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                    <p>{product.description}</p>
                </article>
            ))}
        </div>
    );
}

// ===========================================
// Example 3: Server Component with Props
// ===========================================
interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    publishedAt: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const response = await fetch(`https://api.example.com/posts/${slug}`);
    if (!response.ok) return null;
    return response.json();
}

export async function BlogPostPage({ slug }: { slug: string }) {
    const post = await getBlogPost(slug);

    if (!post) {
        return <div className="not-found">Post not found</div>;
    }

    return (
        <article className="blog-post">
            <h1>{post.title}</h1>
            <p className="meta">
                By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
            </p>
            <div className="content">{post.content}</div>
        </article>
    );
}

// ===========================================
// Example 4: Nested Server Components
// ===========================================
interface Category {
    id: string;
    name: string;
}

async function getCategories(): Promise<Category[]> {
    const res = await fetch('https://api.example.com/categories');
    return res.json();
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    const res = await fetch(`https://api.example.com/categories/${categoryId}/products`);
    return res.json();
}

// Parent Server Component
export async function CategoryPage({ categoryId }: { categoryId: string }) {
    const categories = await getCategories();
    const currentCategory = categories.find(c => c.id === categoryId);

    return (
        <div className="category-page">
            <nav className="sidebar">
                {categories.map(cat => (
                    <a key={cat.id} href={`/category/${cat.id}`}>
                        {cat.name}
                    </a>
                ))}
            </nav>

            <main>
                <h1>{currentCategory?.name}</h1>
                {/* Nested Server Component */}
                <CategoryProducts categoryId={categoryId} />
            </main>
        </div>
    );
}

// Child Server Component
async function CategoryProducts({ categoryId }: { categoryId: string }) {
    const products = await getProductsByCategory(categoryId);

    return (
        <div className="products">
            {products.map(product => (
                <div key={product.id} className="product">
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                </div>
            ))}
        </div>
    );
}

// ===========================================
// Example 5: Server Component with Suspense
// ===========================================
import { Suspense } from 'react';

async function getSlowData(): Promise<{ data: string }> {
    // Simulate slow API
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { data: 'Loaded after 2 seconds' };
}

async function SlowComponent() {
    const result = await getSlowData();
    return <div>{result.data}</div>;
}

export function PageWithSuspense() {
    return (
        <div>
            <h1>Fast Content</h1>
            <p>This shows immediately</p>

            <Suspense fallback={<div className="skeleton">Loading slow content...</div>}>
                <SlowComponent />
            </Suspense>
        </div>
    );
}

// Directives Examples - "use client" and "use server"
// React 19 with TypeScript

// ===========================================
// Example 1: "use client" Directive
// ===========================================

// File: components/Counter.tsx
'use client';  // This marks the component as a Client Component

import { useState } from 'react';

export function Counter(): React.ReactElement {
    const [count, setCount] = useState(0);

    return (
        <div className="counter">
            <p>Count: {count}</p>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
    );
}

// ===========================================
// Example 2: Client Component with Event Handlers
// ===========================================

// File: components/SearchInput.tsx
'use client';

import { useState, useTransition } from 'react';

interface SearchInputProps {
    onSearch: (query: string) => Promise<void>;
}

export function SearchInput({ onSearch }: SearchInputProps): React.ReactElement {
    const [query, setQuery] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await onSearch(query);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                disabled={isPending}
            />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
}

// ===========================================
// Example 3: Mixing Server and Client Components
// ===========================================

// File: app/page.tsx (Server Component - no directive needed)
import { Suspense } from 'react';

// Import Client Components
import { Counter } from '@/components/Counter';
import { SearchInput } from '@/components/SearchInput';

interface Product {
    id: string;
    name: string;
    price: number;
}

async function getProducts(): Promise<Product[]> {
    const res = await fetch('https://api.example.com/products');
    return res.json();
}

// Server Component can render Client Components
export default async function HomePage() {
    const products = await getProducts();

    return (
        <main>
            <h1>Welcome</h1>

            {/* Client Component for interactivity */}
            <Counter />

            {/* Server-rendered content */}
            <section className="products">
                <h2>Products</h2>
                <ul>
                    {products.map(p => (
                        <li key={p.id}>{p.name} - ${p.price}</li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

// ===========================================
// Example 4: "use server" Inline Directive
// ===========================================

// File: app/contact/page.tsx
'use client';

import { useActionState } from 'react';

// Define a server action inline with "use server"
async function submitContact(
    prevState: { message: string } | null,
    formData: FormData
) {
    'use server'; // This function runs on the server

    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Server-side operations
    // await db.contact.create({ data: { email, message } });
    // await sendEmail(email, message);

    return { message: 'Thank you for contacting us!' };
}

export default function ContactPage() {
    const [state, formAction, isPending] = useActionState(submitContact, null);

    return (
        <form action={formAction}>
            <input name="email" type="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" required />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send'}
            </button>
            {state?.message && <p>{state.message}</p>}
        </form>
    );
}

// ===========================================
// Example 5: Server Actions in Separate File
// ===========================================

// File: app/actions.ts
'use server';

// All exports from this file are Server Actions

export async function createUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Database operation
    // await db.user.create({ data: { name, email } });

    return { success: true };
}

export async function deleteUser(userId: string) {
    // await db.user.delete({ where: { id: userId } });
    return { success: true };
}

export async function updateUserProfile(
    userId: string,
    data: { name?: string; bio?: string }
) {
    // await db.user.update({ where: { id: userId }, data });
    return { success: true };
}

// ===========================================
// Example 6: Using Server Actions in Client
// ===========================================

// File: components/UserForm.tsx
'use client';

import { useActionState } from 'react';
import { createUser } from '@/app/actions';

export function UserForm(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            return await createUser(formData);
        },
        null
    );

    return (
        <form action={formAction}>
            <input name="name" placeholder="Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create User'}
            </button>
        </form>
    );
}

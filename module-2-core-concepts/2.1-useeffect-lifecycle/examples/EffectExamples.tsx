// useEffect Examples (TypeScript)

import React, { useState, useEffect } from 'react';

// 1. Document Title Effect
export function DocumentTitle(): React.ReactElement {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        document.title = `Count: ${count}`;

        return () => {
            document.title = 'React App';
        };
    }, [count]);

    return (
        <button onClick={() => setCount(c => c + 1)}>
            Count: {count}
        </button>
    );
}

// 2. Window Resize Listener
export function WindowSize(): React.ReactElement {
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = (): void => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty array = mount only

    return (
        <div>
            Window: {size.width} x {size.height}
        </div>
    );
}

// 3. Local Storage Sync
export function LocalStorageSync(): React.ReactElement {
    const [name, setName] = useState<string>(() => {
        return localStorage.getItem('name') ?? '';
    });

    useEffect(() => {
        localStorage.setItem('name', name);
    }, [name]);

    return (
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name (persisted)"
        />
    );
}

// 4. Debounced Search
export function DebouncedSearch(): React.ReactElement {
    const [query, setQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [query]);

    return (
        <div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
            />
            <p>Searching for: {debouncedQuery || '...'}</p>
        </div>
    );
}

// 5. API Data Fetching
interface Post {
    id: number;
    title: string;
    body: string;
}

export function PostsFetcher(): React.ReactElement {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchPosts = async (): Promise<void> => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
                const data: Post[] = await response.json();

                if (!cancelled) {
                    setPosts(data);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to fetch posts');
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    );
}

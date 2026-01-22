// use() API Examples
// React 19 with TypeScript

import React, { Suspense, use, createContext, useContext } from 'react';

// ===========================================
// Example 1: Reading Promises with use()
// ===========================================
interface User {
    id: string;
    name: string;
    email: string;
}

// This function returns a Promise
async function fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
}

// Component that uses the promise
function UserProfile({ userPromise }: { userPromise: Promise<User> }): React.ReactElement {
    // use() unwraps the promise - component suspends until resolved
    const user = use(userPromise);

    return (
        <div className="user-profile">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}

// Parent component with Suspense boundary
export function UserPage({ userId }: { userId: string }): React.ReactElement {
    // Create the promise at render time (or use a cache)
    const userPromise = fetchUser(userId);

    return (
        <Suspense fallback={<div className="loading">Loading user...</div>}>
            <UserProfile userPromise={userPromise} />
        </Suspense>
    );
}

// ===========================================
// Example 2: Reading Context with use()
// ===========================================
interface Theme {
    primary: string;
    secondary: string;
    background: string;
    text: string;
}

const ThemeContext = createContext<Theme | null>(null);

// Traditional way with useContext - can't be conditional
function TraditionalThemedButton(): React.ReactElement {
    const theme = useContext(ThemeContext);
    if (!theme) throw new Error('No theme');

    return (
        <button style={{ backgroundColor: theme.primary, color: theme.text }}>
            Click me
        </button>
    );
}

// With use() - can be called conditionally!
function ConditionalThemedContent({ showButton }: { showButton: boolean }): React.ReactElement {
    if (showButton) {
        // use() can be called inside conditionals
        const theme = use(ThemeContext);
        if (!theme) return <div>No theme</div>;

        return (
            <button style={{ backgroundColor: theme.primary }}>
                Themed Button
            </button>
        );
    }

    return <div>No button to show</div>;
}

// ===========================================
// Example 3: Multiple Promises
// ===========================================
interface Post {
    id: string;
    title: string;
    body: string;
}

interface Comment {
    id: string;
    postId: string;
    text: string;
    author: string;
}

async function fetchPost(id: string): Promise<Post> {
    const res = await fetch(`/api/posts/${id}`);
    return res.json();
}

async function fetchComments(postId: string): Promise<Comment[]> {
    const res = await fetch(`/api/posts/${postId}/comments`);
    return res.json();
}

function PostContent({ postPromise }: { postPromise: Promise<Post> }): React.ReactElement {
    const post = use(postPromise);

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </article>
    );
}

function CommentsList({ commentsPromise }: { commentsPromise: Promise<Comment[]> }): React.ReactElement {
    const comments = use(commentsPromise);

    return (
        <div className="comments">
            <h3>Comments ({comments.length})</h3>
            {comments.map(comment => (
                <div key={comment.id} className="comment">
                    <strong>{comment.author}</strong>
                    <p>{comment.text}</p>
                </div>
            ))}
        </div>
    );
}

export function PostPage({ postId }: { postId: string }): React.ReactElement {
    const postPromise = fetchPost(postId);
    const commentsPromise = fetchComments(postId);

    return (
        <div className="post-page">
            {/* Each Suspense boundary allows independent loading */}
            <Suspense fallback={<div>Loading post...</div>}>
                <PostContent postPromise={postPromise} />
            </Suspense>

            <Suspense fallback={<div>Loading comments...</div>}>
                <CommentsList commentsPromise={commentsPromise} />
            </Suspense>
        </div>
    );
}

// ===========================================
// Example 4: Error Handling with ErrorBoundary
// ===========================================
import { ErrorBoundary } from 'react-error-boundary';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

async function fetchProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
        throw new Error(`Product ${id} not found`);
    }
    return res.json();
}

function ProductDetails({ productPromise }: { productPromise: Promise<Product> }): React.ReactElement {
    const product = use(productPromise);

    return (
        <div className="product">
            <h2>{product.name}</h2>
            <p className="price">${product.price}</p>
            <p>{product.description}</p>
        </div>
    );
}

function ProductErrorFallback({ error, resetErrorBoundary }: {
    error: Error;
    resetErrorBoundary: () => void;
}): React.ReactElement {
    return (
        <div className="error-container">
            <h3>Oops! Something went wrong</h3>
            <p>{error.message}</p>
            <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
    );
}

export function ProductPage({ productId }: { productId: string }): React.ReactElement {
    const productPromise = fetchProduct(productId);

    return (
        <ErrorBoundary
            FallbackComponent={ProductErrorFallback}
            onReset={() => window.location.reload()}
        >
            <Suspense fallback={<div>Loading product...</div>}>
                <ProductDetails productPromise={productPromise} />
            </Suspense>
        </ErrorBoundary>
    );
}

// ===========================================
// Example 5: Streaming Data with use()
// ===========================================
interface SearchResult {
    id: string;
    title: string;
    snippet: string;
}

// This simulates a search that takes time
async function searchProducts(query: string): Promise<SearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulated results
    return [
        { id: '1', title: `Result 1 for "${query}"`, snippet: 'Description...' },
        { id: '2', title: `Result 2 for "${query}"`, snippet: 'Description...' },
        { id: '3', title: `Result 3 for "${query}"`, snippet: 'Description...' },
    ];
}

function SearchResults({ resultsPromise }: { resultsPromise: Promise<SearchResult[]> }): React.ReactElement {
    const results = use(resultsPromise);

    if (results.length === 0) {
        return <p>No results found</p>;
    }

    return (
        <ul className="search-results">
            {results.map(result => (
                <li key={result.id}>
                    <h4>{result.title}</h4>
                    <p>{result.snippet}</p>
                </li>
            ))}
        </ul>
    );
}

export function SearchPage(): React.ReactElement {
    const [query, setQuery] = React.useState('');
    const [searchPromise, setSearchPromise] = React.useState<Promise<SearchResult[]> | null>(null);

    const handleSearch = () => {
        if (query.trim()) {
            // Create new promise when searching
            setSearchPromise(searchProducts(query));
        }
    };

    return (
        <div className="search-page">
            <div className="search-input">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search products..."
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {searchPromise && (
                <Suspense fallback={<div>Searching...</div>}>
                    <SearchResults resultsPromise={searchPromise} />
                </Suspense>
            )}
        </div>
    );
}

// ===========================================
// Example 6: Nested use() with Context and Promises
// ===========================================
interface ApiConfig {
    baseUrl: string;
    apiKey: string;
}

const ApiConfigContext = createContext<ApiConfig | null>(null);

function DataDisplay({
    dataPromise,
    showDetails
}: {
    dataPromise: Promise<{ items: string[] }>;
    showDetails: boolean;
}): React.ReactElement {
    const data = use(dataPromise);

    // Conditionally read context
    if (showDetails) {
        const config = use(ApiConfigContext);
        return (
            <div>
                <p>API: {config?.baseUrl}</p>
                <ul>
                    {data.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        );
    }

    return (
        <ul>
            {data.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    );
}

# use() API Exercises

Practice React 19's new use() hook for reading promises and context.

---

## Exercise 1: User Dashboard

Create a dashboard that loads user data with use():
- Fetch user profile
- Fetch user stats (posts, followers, following)
- Show each section as it loads
- Handle errors gracefully

```tsx
interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

function Dashboard({ userId }: { userId: string }) {
  // TODO: Implement with use() and Suspense
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { Suspense, use } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

async function fetchUser(id: string): Promise<User> {
  await new Promise(r => setTimeout(r, 500));
  return { id, name: 'John Doe', avatar: '/avatar.jpg' };
}

async function fetchStats(id: string): Promise<UserStats> {
  await new Promise(r => setTimeout(r, 800));
  return { posts: 42, followers: 1234, following: 567 };
}

function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
    </div>
  );
}

function StatsPanel({ statsPromise }: { statsPromise: Promise<UserStats> }) {
  const stats = use(statsPromise);
  return (
    <div className="stats-panel">
      <div className="stat">
        <span className="value">{stats.posts}</span>
        <span className="label">Posts</span>
      </div>
      <div className="stat">
        <span className="value">{stats.followers}</span>
        <span className="label">Followers</span>
      </div>
      <div className="stat">
        <span className="value">{stats.following}</span>
        <span className="label">Following</span>
      </div>
    </div>
  );
}

function Dashboard({ userId }: { userId: string }) {
  const userPromise = fetchUser(userId);
  const statsPromise = fetchStats(userId);

  return (
    <div className="dashboard">
      <ErrorBoundary fallback={<div>Error loading profile</div>}>
        <Suspense fallback={<div className="skeleton user-skeleton" />}>
          <UserCard userPromise={userPromise} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<div>Error loading stats</div>}>
        <Suspense fallback={<div className="skeleton stats-skeleton" />}>
          <StatsPanel statsPromise={statsPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

</details>

---

## Exercise 2: Conditional Context Reading

Create a component that conditionally reads from context using use():
- Read theme context only when needed
- Read auth context for protected features
- Fall back gracefully when context is missing

```tsx
// Contexts
const ThemeContext = createContext<Theme | null>(null);
const AuthContext = createContext<AuthState | null>(null);

function FeaturePanel({ 
  showThemed: boolean;
  requireAuth: boolean;
}) {
  // TODO: Use use() to conditionally read contexts
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { createContext, use } from 'react';

interface Theme {
  primary: string;
  background: string;
}

interface AuthState {
  user: { name: string } | null;
  isAuthenticated: boolean;
}

const ThemeContext = createContext<Theme | null>(null);
const AuthContext = createContext<AuthState | null>(null);

function FeaturePanel({ 
  showThemed, 
  requireAuth,
  children,
}: { 
  showThemed: boolean;
  requireAuth: boolean;
  children: React.ReactNode;
}) {
  let styles: React.CSSProperties = {};
  
  // Conditionally read theme context
  if (showThemed) {
    const theme = use(ThemeContext);
    if (theme) {
      styles = {
        backgroundColor: theme.background,
        color: theme.primary,
      };
    }
  }

  // Conditionally read auth context
  if (requireAuth) {
    const auth = use(AuthContext);
    
    if (!auth?.isAuthenticated) {
      return (
        <div className="auth-required">
          <p>Please log in to access this feature</p>
          <button>Login</button>
        </div>
      );
    }
    
    return (
      <div style={styles} className="feature-panel">
        <p>Welcome, {auth.user?.name}!</p>
        {children}
      </div>
    );
  }

  return (
    <div style={styles} className="feature-panel">
      {children}
    </div>
  );
}

// Usage
function App() {
  return (
    <ThemeContext.Provider value={{ primary: '#007bff', background: '#f8f9fa' }}>
      <AuthContext.Provider value={{ user: { name: 'John' }, isAuthenticated: true }}>
        <FeaturePanel showThemed={true} requireAuth={true}>
          <p>Protected content here</p>
        </FeaturePanel>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

</details>

---

## Exercise 3: Parallel Data Fetching

Build a product comparison page that:
- Fetches multiple products in parallel
- Shows each product as it loads
- Displays comparison table when all loaded

```tsx
function ProductComparison({ productIds }: { productIds: string[] }) {
  // TODO: Fetch all products and display comparison
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { Suspense, use } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  features: string[];
}

async function fetchProduct(id: string): Promise<Product> {
  await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
  return {
    id,
    name: `Product ${id}`,
    price: Math.floor(Math.random() * 100) + 10,
    rating: Math.random() * 2 + 3,
    features: ['Feature A', 'Feature B', 'Feature C'],
  };
}

function ProductCard({ productPromise }: { productPromise: Promise<Product> }) {
  const product = use(productPromise);
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="rating">{'⭐'.repeat(Math.round(product.rating))}</p>
      <ul>
        {product.features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </div>
  );
}

function ProductComparison({ productIds }: { productIds: string[] }) {
  // Create all promises at once (parallel fetching)
  const productPromises = productIds.map(id => fetchProduct(id));

  return (
    <div className="product-comparison">
      <h2>Compare Products</h2>
      <div className="products-grid">
        {productPromises.map((promise, index) => (
          <Suspense 
            key={productIds[index]} 
            fallback={<div className="product-skeleton">Loading...</div>}
          >
            <ProductCard productPromise={promise} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

// Usage
function App() {
  return <ProductComparison productIds={['1', '2', '3']} />;
}
```

</details>

---

## Challenge: Infinite Scroll Gallery

Create an image gallery with:
- Initial load of images using use()
- Load more on scroll
- Each batch loads with Suspense
- Smooth loading transitions
- Prefetch next batch on hover

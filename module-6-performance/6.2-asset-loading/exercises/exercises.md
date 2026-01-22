# Asset Loading Examples & Exercises

## Resource Loading APIs in React 19

### Example 1: Preloading Resources

```tsx
import { preload, preconnect, prefetchDNS, preinit } from 'react-dom';

function App() {
  // Preload a font
  preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2' });
  
  // Preconnect to API
  preconnect('https://api.myapp.com');
  
  // DNS prefetch for analytics
  prefetchDNS('https://analytics.google.com');
  
  // Preinit a critical script
  preinit('/scripts/critical.js', { as: 'script' });
  
  return <MainContent />;
}
```

### Example 2: Stylesheet Loading

```tsx
function ProductPage({ product }) {
  return (
    <>
      {/* Styles with precedence control */}
      <link rel="stylesheet" href="/styles/base.css" precedence="low" />
      <link rel="stylesheet" href="/styles/product.css" precedence="medium" />
      
      <main>
        <h1>{product.name}</h1>
      </main>
    </>
  );
}
```

### Example 3: Async Script Loading

```tsx
function AnalyticsProvider({ children }) {
  return (
    <>
      {/* Async scripts */}
      <script async src="https://analytics.example.com/script.js" />
      
      {/* Defer scripts */}
      <script defer src="/scripts/non-critical.js" />
      
      {children}
    </>
  );
}
```

---

## Exercises

### Exercise 1: Create a Resource Loader

Build a component that preloads critical resources:

```tsx
interface ResourceLoaderProps {
  fonts: string[];
  apis: string[];
  scripts: string[];
}

function ResourceLoader({ fonts, apis, scripts }: ResourceLoaderProps) {
  // TODO: Implement preloading
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { preload, preconnect, preinit } from 'react-dom';

interface ResourceLoaderProps {
  fonts: string[];
  apis: string[];
  scripts: { src: string; priority: 'critical' | 'normal' }[];
}

function ResourceLoader({ fonts, apis, scripts }: ResourceLoaderProps) {
  // Preload fonts
  fonts.forEach(font => {
    preload(font, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  });
  
  // Preconnect to APIs
  apis.forEach(api => {
    preconnect(api);
  });
  
  // Load scripts
  scripts.forEach(({ src, priority }) => {
    if (priority === 'critical') {
      preinit(src, { as: 'script' });
    } else {
      preload(src, { as: 'script' });
    }
  });
  
  return null;
}

// Usage
function App() {
  return (
    <>
      <ResourceLoader
        fonts={['/fonts/inter.woff2', '/fonts/roboto.woff2']}
        apis={['https://api.myapp.com', 'https://cdn.myapp.com']}
        scripts={[
          { src: '/scripts/critical.js', priority: 'critical' },
          { src: '/scripts/analytics.js', priority: 'normal' }
        ]}
      />
      <MainApp />
    </>
  );
}
```
</details>

### Exercise 2: Conditional Resource Loading

Load different stylesheets based on user preferences:

<details>
<summary>💡 Solution</summary>

```tsx
function ThemeStyles({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <>
      <link rel="stylesheet" href="/styles/base.css" precedence="low" />
      
      {theme === 'dark' ? (
        <link rel="stylesheet" href="/styles/dark.css" precedence="medium" />
      ) : (
        <link rel="stylesheet" href="/styles/light.css" precedence="medium" />
      )}
    </>
  );
}
```
</details>

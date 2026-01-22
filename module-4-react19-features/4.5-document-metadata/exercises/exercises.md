# Document Metadata Exercises

Practice using React 19's native document metadata support.

---

## Exercise 1: Dynamic SEO Component

Create a reusable SEO component:
- Accept title, description, image props
- Generate Open Graph tags
- Generate Twitter Card tags
- Support canonical URL

```tsx
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

function SEO({ title, description, image, url }: SEOProps) {
  // TODO: Implement
}
```

<details>
<summary>💡 Solution</summary>

```tsx
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

function SEO({ 
  title, 
  description, 
  image = '/og-default.jpg',
  url,
  type = 'website'
}: SEOProps) {
  const siteUrl = 'https://mysite.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Canonical */}
      {url && <link rel="canonical" href={fullUrl} />}
    </>
  );
}

// Usage
function ProductPage({ product }) {
  return (
    <>
      <SEO 
        title={`${product.name} | MyStore`}
        description={product.description}
        image={product.image}
        url={`/products/${product.slug}`}
        type="product"
      />
      <main>
        <h1>{product.name}</h1>
      </main>
    </>
  );
}
```

</details>

---

## Exercise 2: Theme-Aware Metadata

Create metadata that adapts to theme:
- Different theme-color for light/dark mode
- Preload theme-specific stylesheets

<details>
<summary>💡 Solution</summary>

```tsx
interface ThemeMetadataProps {
  lightThemeColor: string;
  darkThemeColor: string;
}

function ThemeMetadata({ 
  lightThemeColor = '#ffffff',
  darkThemeColor = '#1a1a2e'
}: ThemeMetadataProps) {
  return (
    <>
      <meta 
        name="theme-color" 
        content={lightThemeColor}
        media="(prefers-color-scheme: light)" 
      />
      <meta 
        name="theme-color" 
        content={darkThemeColor}
        media="(prefers-color-scheme: dark)" 
      />
      
      <link 
        rel="stylesheet" 
        href="/styles/theme-light.css"
        media="(prefers-color-scheme: light)"
        precedence="medium"
      />
      <link 
        rel="stylesheet" 
        href="/styles/theme-dark.css"
        media="(prefers-color-scheme: dark)"
        precedence="medium"
      />
    </>
  );
}
```

</details>

---

## Exercise 3: Resource Preloading

Create a component that optimizes resource loading:
- Preload fonts
- Preconnect to API domains
- DNS prefetch for analytics

<details>
<summary>💡 Solution</summary>

```tsx
interface PreloadConfig {
  fonts: string[];
  apiDomains: string[];
  analyticsDomains: string[];
}

function ResourcePreloader({ fonts, apiDomains, analyticsDomains }: PreloadConfig) {
  return (
    <>
      {fonts.map(font => (
        <link
          key={font}
          rel="preload"
          href={font}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {apiDomains.map(domain => (
        <link key={domain} rel="preconnect" href={domain} />
      ))}
      
      {analyticsDomains.map(domain => (
        <link key={domain} rel="dns-prefetch" href={domain} />
      ))}
    </>
  );
}

// Usage
function App() {
  return (
    <>
      <ResourcePreloader
        fonts={['/fonts/inter.woff2', '/fonts/roboto.woff2']}
        apiDomains={['https://api.myapp.com', 'https://cdn.myapp.com']}
        analyticsDomains={['https://analytics.google.com']}
      />
      <main>App content</main>
    </>
  );
}
```

</details>

# 9.1 Project Structure

## 📚 Learning Objectives

- Understand different folder structures
- Choose the right pattern for your project
- Organize code for scalability

---

## 📁 Structure Patterns

### Pattern 1: Feature-Based (Recommended)

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── index.ts
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── index.ts
│   └── cart/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── app/
│   ├── routes/
│   └── providers/
└── main.tsx
```

### Pattern 2: Type-Based (Simpler)

```
src/
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── hooks/
├── utils/
├── api/
├── types/
└── main.tsx
```

---

## 🎯 Best Practices

| Practice | Why |
|----------|-----|
| **Index exports** | Clean imports: `from '@/features/auth'` |
| **Colocation** | Keep related files together |
| **Path aliases** | `@/` instead of `../../` |
| **Barrel files** | Re-export from single point |

---

## 💻 Path Aliases Setup

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/features/*": ["src/features/*"]
    }
  }
}
```

```ts
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 📝 Summary

- Feature-based for larger apps
- Type-based for simpler apps
- Use path aliases for clean imports
- Colocate related files

---

[← Back to Module 9](../README.md) | [Next: 9.2 Component Patterns →](../9.2-component-patterns/)

# 6.4 React Best Practices Summary

## 📚 Complete Checklist

A comprehensive guide to writing production-ready React code.

---

## 🏗️ Component Design

| ✅ Do | ❌ Don't |
|------|---------|
| Keep components small and focused | Create god components |
| Use meaningful names | Use generic names |
| Colocate related code | Scatter related logic |
| Use TypeScript interfaces | Use `any` type |

---

## 🔄 State Management

| ✅ Do | ❌ Don't |
|------|---------|
| Keep state minimal | Duplicate derived data |
| Lift state when shared | Prop drill excessively |
| Use Context for global state | Overuse Context |
| Prefer useReducer for complex state | Nest many useState |

---

## ⚡ Performance

| ✅ Do | ❌ Don't |
|------|---------|
| Measure before optimizing | Premature optimization |
| Code split routes | Bundle everything |
| Virtualize long lists | Render 1000+ items |
| Use stable keys | Use index as key (for dynamic lists) |

---

## 🎣 Hooks

| ✅ Do | ❌ Don't |
|------|---------|
| Follow hooks rules | Call hooks conditionally |
| Create custom hooks for reuse | Duplicate stateful logic |
| Clean up effects | Leave subscriptions open |
| Specify all dependencies | Lie about dependencies |

---

## 📝 TypeScript

```tsx
// ✅ Good: Typed props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

// ✅ Good: Typed state
const [user, setUser] = useState<User | null>(null);

// ✅ Good: Typed events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setValue(e.target.value);
};
```

---

## 📁 Project Structure

```
src/
├── components/        # Shared components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── hooks/            # Custom hooks
├── contexts/         # Context providers
├── utils/            # Helper functions
├── types/            # TypeScript types
└── pages/            # Route components
```

---

## 🔒 Security

| ✅ Do | ❌ Don't |
|------|---------|
| Validate server inputs | Trust client data |
| Sanitize HTML | Use dangerouslySetInnerHTML |
| Use HTTPS | Expose secrets |
| Implement auth properly | Store tokens in localStorage |

---

## 🧪 Testing

```tsx
// Component test
test('renders correctly', () => {
  render(<Button>Click</Button>);
  expect(screen.getByText('Click')).toBeInTheDocument();
});

// Hook test
test('toggles value', () => {
  const { result } = renderHook(() => useToggle(false));
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});
```

---

## 📝 Final Summary

1. **Components**: Small, focused, typed
2. **State**: Minimal, lifted appropriately
3. **Effects**: Cleanup, proper dependencies
4. **Performance**: Measure, then optimize
5. **TypeScript**: Type everything
6. **Testing**: Test behavior, not implementation

---

## 🎉 Congratulations!

You've completed the React v19 curriculum from startup to intermediate!

---

[← Previous: 6.3 Optimization Patterns](../6.3-optimization-patterns/) | [🏠 Back to Curriculum](../README.md)

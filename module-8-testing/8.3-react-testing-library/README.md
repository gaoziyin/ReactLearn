# 8.3 React Testing Library

## 📚 Learning Objectives

- Understand RTL philosophy
- Use queries effectively
- Test user interactions
- Test async operations

---

## 🧠 RTL Philosophy

> The more your tests resemble the way your software is used, the more confidence they can give you.

Test from the **user's perspective**, not implementation details.

---

## 🔍 Query Priority

```tsx
// 1. BEST: Accessible queries (screen readers can use these)
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Search...')
screen.getByText('Welcome')

// 2. Semantic queries
screen.getByAltText('Profile picture')
screen.getByTitle('Close')

// 3. LAST RESORT: Test IDs
screen.getByTestId('custom-element')
```

---

## 💻 Testing User Interactions

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits with user credentials', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // Type in inputs
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Click submit
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

---

## ⚡ Testing Async Operations

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './UserList';

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: '1', name: 'John' }]),
  })
) as any;

describe('UserList', () => {
  it('displays users after loading', async () => {
    render(<UserList />);
    
    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for users to appear
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
    
    // Loading should be gone
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
```

---

## 📝 Summary

- Query by accessibility first
- Use userEvent for interactions
- waitFor for async operations
- Test behavior, not state

---

[← Back to Module 8](../README.md) | [Next: 8.4 Integration Testing →](../8.4-integration-testing/)

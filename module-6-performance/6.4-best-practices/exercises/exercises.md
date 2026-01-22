# Best Practices Exercises

## React 19 Best Practices Checklist

### ✅ Component Design
- [ ] Use function components exclusively
- [ ] Keep components focused (single responsibility)
- [ ] Extract reusable logic into custom hooks
- [ ] Use TypeScript for type safety

### ✅ State Management  
- [ ] Lift state only when necessary
- [ ] Use useReducer for complex state
- [ ] Consider Context for cross-cutting concerns
- [ ] Use external state managers for large apps

### ✅ Performance
- [ ] Enable React Compiler when stable
- [ ] Use Suspense for async boundaries
- [ ] Implement code splitting for routes
- [ ] Virtualize long lists

### ✅ React 19 Features
- [ ] Use Actions for form handling
- [ ] Leverage useOptimistic for UX
- [ ] Use Server Components appropriately
- [ ] Native document metadata

---

## Exercise 1: Review Code for Best Practices

What issues do you see in this code?

```tsx
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);
  
  const filteredUsers = users.filter(u => 
    u.name.includes(filter)
  ).sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return (
    <div>
      <input onChange={e => setFilter(e.target.value)} />
      {filteredUsers.map(user => (
        <div onClick={() => console.log(user)}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

<details>
<summary>💡 Issues & Solutions</summary>

1. **Missing key prop** on mapped elements
2. **No useMemo** for expensive filtering/sorting
3. **No useCallback** for event handlers
4. **Inline function** in onClick
5. **No TypeScript** types
6. **Could use useFetch hook** or React Query

Better version:

```tsx
interface User {
  id: string;
  name: string;
}

function UserDashboard() {
  const { data: users, isLoading, error } = useFetch<User[]>('/api/users');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name'>('name');
  
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users
      .filter(u => u.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [users, filter, sortBy]);
  
  const handleUserClick = useCallback((user: User) => {
    console.log(user);
  }, []);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <SearchInput value={filter} onChange={setFilter} />
      <UserList users={filteredUsers} onUserClick={handleUserClick} />
    </div>
  );
}
```
</details>

---

## Exercise 2: Accessibility Audit

Add accessibility features to this component:

```tsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      previousFocus.current?.focus();
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="close-button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
```
</details>

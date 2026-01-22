# 9.2 Component Patterns

## 📚 Learning Objectives

- Compound Components pattern
- Render Props pattern
- Higher-Order Components (HOC)
- Custom Hooks pattern

---

## 🔲 Compound Components

```tsx
// Flexible, composable API like <select><option>

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;
  
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useContext(TabsContext)!;
  
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// Attach to parent
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="home">
  <Tabs.List>
    <Tabs.Tab id="home">Home</Tabs.Tab>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="home">Home content</Tabs.Panel>
  <Tabs.Panel id="profile">Profile content</Tabs.Panel>
</Tabs>
```

---

## 🎨 Render Props

```tsx
// Share logic via render function

interface MousePosition {
  x: number;
  y: number;
}

function MouseTracker({ 
  render 
}: { 
  render: (pos: MousePosition) => ReactNode 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return <>{render(position)}</>;
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse: {x}, {y}</div>
  )}
/>
```

---

## 🔄 Custom Hook (Preferred)

```tsx
// Same logic, cleaner API

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return position;
}

// Usage
function MyComponent() {
  const { x, y } = useMousePosition();
  return <div>Mouse: {x}, {y}</div>;
}
```

---

## 📝 Summary

- Compound: Flexible component APIs
- Render Props: Share behavior
- Custom Hooks: Preferred for logic reuse
- Choose based on use case

---

[← Back to Module 9](../README.md) | [Next: 9.3 Design System →](../9.3-design-system/)

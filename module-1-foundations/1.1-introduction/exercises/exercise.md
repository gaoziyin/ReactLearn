# Exercise 1.1: Create Your First Component

## Task

Create a `Welcome` component that displays:
1. Your name in an `<h1>` tag
2. A brief introduction about yourself in a `<p>` tag

## Requirements

- Use a function component
- Use PascalCase for the component name
- Return valid JSX

---

## Solution

```jsx
// Welcome.jsx
function Welcome() {
  return (
    <div>
      <h1>John Doe</h1>
      <p>I'm a web developer learning React 19!</p>
    </div>
  );
}

export default Welcome;
```

## Using the Component

```jsx
// App.jsx
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Welcome />
    </div>
  );
}

export default App;
```

---

## Bonus Challenge

Modify the `Welcome` component to include:
- An emoji after your name
- A list of 3 hobbies using `<ul>` and `<li>` tags

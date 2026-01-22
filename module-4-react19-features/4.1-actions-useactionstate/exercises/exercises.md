# Actions & useActionState Exercises

Practice React 19's new form handling with Actions.

---

## Exercise 1: Contact Form

Create a contact form with useActionState:
- Fields: name, email, subject, message
- Validate all fields
- Show success message after submission
- Display field-level errors

```tsx
interface ContactState {
  success: boolean;
  errors: Record<string, string>;
  message?: string;
}

async function contactAction(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // TODO: Implement validation and submission
}
```

<details>
<summary>💡 Solution</summary>

```tsx
'use client';

import { useActionState } from 'react';

interface ContactState {
  success: boolean;
  errors: Record<string, string>;
  message?: string;
}

async function contactAction(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  const errors: Record<string, string> = {};

  if (!name || name.length < 2) {
    errors.name = 'Name is required';
  }

  if (!email || !email.includes('@')) {
    errors.email = 'Valid email is required';
  }

  if (!subject) {
    errors.subject = 'Subject is required';
  }

  if (!message || message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Simulate sending
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    errors: {},
    message: 'Thank you! We will get back to you soon.',
  };
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(contactAction, {
    success: false,
    errors: {},
  });

  if (state.success) {
    return <div className="success">{state.message}</div>;
  }

  return (
    <form action={formAction}>
      <div>
        <input name="name" placeholder="Your Name" disabled={isPending} />
        {state.errors.name && <span className="error">{state.errors.name}</span>}
      </div>

      <div>
        <input name="email" type="email" placeholder="Your Email" disabled={isPending} />
        {state.errors.email && <span className="error">{state.errors.email}</span>}
      </div>

      <div>
        <input name="subject" placeholder="Subject" disabled={isPending} />
        {state.errors.subject && <span className="error">{state.errors.subject}</span>}
      </div>

      <div>
        <textarea name="message" placeholder="Your Message" rows={5} disabled={isPending} />
        {state.errors.message && <span className="error">{state.errors.message}</span>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

</details>

---

## Exercise 2: Todo with Actions

Build a todo list using form actions:
- Add new todos
- Toggle completion
- Delete todos
- Filter todos

```tsx
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

// Hint: Use hidden inputs to pass action type and todo id
```

<details>
<summary>💡 Solution</summary>

```tsx
'use client';

import { useActionState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

async function todoAction(
  prevState: TodoState,
  formData: FormData
): Promise<TodoState> {
  const action = formData.get('action') as string;
  const id = formData.get('id') as string;
  const text = formData.get('text') as string;

  switch (action) {
    case 'add':
      if (!text?.trim()) return prevState;
      return {
        todos: [
          ...prevState.todos,
          { id: Date.now().toString(), text: text.trim(), completed: false },
        ],
      };

    case 'toggle':
      return {
        todos: prevState.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      };

    case 'delete':
      return {
        todos: prevState.todos.filter(todo => todo.id !== id),
      };

    default:
      return prevState;
  }
}

function TodoApp() {
  const [state, formAction, isPending] = useActionState(todoAction, { todos: [] });

  return (
    <div>
      {/* Add Todo Form */}
      <form action={formAction}>
        <input type="hidden" name="action" value="add" />
        <input name="text" placeholder="New todo..." disabled={isPending} />
        <button type="submit" disabled={isPending}>Add</button>
      </form>

      {/* Todo List */}
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {/* Toggle Form */}
            <form action={formAction} style={{ display: 'inline' }}>
              <input type="hidden" name="action" value="toggle" />
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit">{todo.completed ? '✓' : '○'}</button>
            </form>

            <span>{todo.text}</span>

            {/* Delete Form */}
            <form action={formAction} style={{ display: 'inline' }}>
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit">×</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

</details>

---

## Exercise 3: Multi-step Wizard

Create a multi-step form using Actions:
- Step 1: Personal info
- Step 2: Preferences
- Step 3: Review & Submit
- Navigate between steps
- Preserve data across steps

<details>
<summary>💡 Solution</summary>

```tsx
'use client';

import { useActionState } from 'react';

interface WizardState {
  step: 1 | 2 | 3;
  data: {
    name: string;
    email: string;
    theme: string;
    notifications: boolean;
  };
  submitted: boolean;
}

async function wizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const action = formData.get('_action') as string;

  if (action === 'next' && prevState.step < 3) {
    // Collect data from current step
    const newData = { ...prevState.data };
    
    if (prevState.step === 1) {
      newData.name = formData.get('name') as string;
      newData.email = formData.get('email') as string;
    } else if (prevState.step === 2) {
      newData.theme = formData.get('theme') as string;
      newData.notifications = formData.get('notifications') === 'on';
    }

    return {
      ...prevState,
      step: (prevState.step + 1) as 1 | 2 | 3,
      data: newData,
    };
  }

  if (action === 'prev' && prevState.step > 1) {
    return {
      ...prevState,
      step: (prevState.step - 1) as 1 | 2 | 3,
    };
  }

  if (action === 'submit') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...prevState, submitted: true };
  }

  return prevState;
}

function WizardForm() {
  const [state, formAction, isPending] = useActionState(wizardAction, {
    step: 1,
    data: { name: '', email: '', theme: 'light', notifications: true },
    submitted: false,
  });

  if (state.submitted) {
    return <div>🎉 Form submitted successfully!</div>;
  }

  return (
    <form action={formAction}>
      <div className="progress">Step {state.step} of 3</div>

      {state.step === 1 && (
        <div>
          <h3>Personal Info</h3>
          <input name="name" defaultValue={state.data.name} placeholder="Name" />
          <input name="email" defaultValue={state.data.email} placeholder="Email" />
        </div>
      )}

      {state.step === 2 && (
        <div>
          <h3>Preferences</h3>
          <select name="theme" defaultValue={state.data.theme}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <label>
            <input
              type="checkbox"
              name="notifications"
              defaultChecked={state.data.notifications}
            />
            Email notifications
          </label>
        </div>
      )}

      {state.step === 3 && (
        <div>
          <h3>Review</h3>
          <p>Name: {state.data.name}</p>
          <p>Email: {state.data.email}</p>
          <p>Theme: {state.data.theme}</p>
          <p>Notifications: {state.data.notifications ? 'Yes' : 'No'}</p>
        </div>
      )}

      <div className="actions">
        {state.step > 1 && (
          <button name="_action" value="prev" disabled={isPending}>
            Back
          </button>
        )}
        {state.step < 3 && (
          <button name="_action" value="next" disabled={isPending}>
            Next
          </button>
        )}
        {state.step === 3 && (
          <button name="_action" value="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </form>
  );
}
```

</details>

---

## Challenge: Shopping Checkout

Build a complete checkout flow with Actions:
- Cart review
- Shipping address
- Payment details
- Order confirmation
- Handle errors at each step

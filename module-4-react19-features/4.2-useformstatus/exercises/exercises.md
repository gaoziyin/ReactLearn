# useFormStatus Exercises

Practice using useFormStatus to create responsive form UIs.

---

## Exercise 1: Enhanced Submit Button

Create a reusable submit button component that:
- Shows loading spinner when pending
- Changes background color during submission
- Shows different text based on pending state
- Can be customized with props

```tsx
interface EnhancedButtonProps {
  pendingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

function EnhancedSubmitButton(props: EnhancedButtonProps): React.ReactElement {
  // TODO: Implement
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useFormStatus } from 'react-dom';

interface EnhancedButtonProps {
  pendingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

function EnhancedSubmitButton({
  pendingText = 'Processing...',
  children,
  variant = 'primary',
}: EnhancedButtonProps): React.ReactElement {
  const { pending } = useFormStatus();

  const baseStyles = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: pending ? 'not-allowed' : 'pointer',
    opacity: pending ? 0.7 : 1,
    transition: 'all 0.2s',
  };

  const variantStyles = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
  };

  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {pending ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Usage
function MyForm() {
  return (
    <form action={someAction}>
      <input name="email" />
      <EnhancedSubmitButton variant="primary" pendingText="Subscribing...">
        Subscribe
      </EnhancedSubmitButton>
    </form>
  );
}
```

</details>

---

## Exercise 2: Form Field Wrapper

Create a wrapper component for form fields that:
- Disables inputs during submission
- Shows visual feedback (opacity, cursor)
- Optionally shows field-specific loading indicator

```tsx
interface FieldWrapperProps {
  children: React.ReactElement;
  showSpinner?: boolean;
}

function FieldWrapper({ children, showSpinner }: FieldWrapperProps) {
  // TODO: Clone element and add disabled prop based on pending state
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import React, { cloneElement } from 'react';
import { useFormStatus } from 'react-dom';

interface FieldWrapperProps {
  children: React.ReactElement;
  showSpinner?: boolean;
  label?: string;
}

function FieldWrapper({
  children,
  showSpinner = false,
  label,
}: FieldWrapperProps): React.ReactElement {
  const { pending } = useFormStatus();

  const clonedInput = cloneElement(children, {
    disabled: pending || children.props.disabled,
    style: {
      ...children.props.style,
      opacity: pending ? 0.6 : 1,
      cursor: pending ? 'not-allowed' : 'text',
    },
  });

  return (
    <div className="field-wrapper" style={{ position: 'relative', marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '4px' }}>
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {clonedInput}
        
        {pending && showSpinner && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              border: '2px solid #ccc',
              borderTopColor: '#007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
      </div>
    </div>
  );
}

// Usage
function ContactForm() {
  return (
    <form action={submitAction}>
      <FieldWrapper label="Name">
        <input name="name" placeholder="Your name" />
      </FieldWrapper>
      
      <FieldWrapper label="Email" showSpinner>
        <input name="email" type="email" placeholder="Your email" />
      </FieldWrapper>
      
      <FieldWrapper label="Message">
        <textarea name="message" rows={4} />
      </FieldWrapper>
      
      <EnhancedSubmitButton>Send</EnhancedSubmitButton>
    </form>
  );
}
```

</details>

---

## Exercise 3: Submission Preview Panel

Create a component that shows what's being submitted:
- Access form data during submission
- Display formatted preview of all fields
- Animate in/out based on pending state

```tsx
function SubmissionPreview(): React.ReactElement {
  // TODO: Show preview of form data being submitted
}
```

<details>
<summary>💡 Solution</summary>

```tsx
import { useFormStatus } from 'react-dom';

function SubmissionPreview(): React.ReactElement {
  const { pending, data } = useFormStatus();

  if (!pending || !data) {
    return <></>;
  }

  // Convert FormData to readable format
  const entries: [string, string][] = [];
  data.forEach((value, key) => {
    if (typeof value === 'string') {
      entries.push([key, value]);
    }
  });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#333',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '300px',
      }}
    >
      <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="spinner" style={{
          width: '14px',
          height: '14px',
          border: '2px solid #666',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        Submitting...
      </h4>
      
      <dl style={{ margin: 0, fontSize: '14px' }}>
        {entries.map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <dt style={{ color: '#aaa', textTransform: 'capitalize' }}>{key}</dt>
            <dd style={{ margin: 0, wordBreak: 'break-word' }}>
              {value.length > 50 ? value.substring(0, 50) + '...' : value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Add this component inside your form
function MyForm() {
  return (
    <form action={submitAction}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Submit</button>
      <SubmissionPreview />
    </form>
  );
}
```

</details>

---

## Challenge: Complete Form System

Build a complete form system with:
- `<FormProvider>` - Wraps form and provides context
- `<FormField>` - Auto-disabled input during submission
- `<FormSubmit>` - Smart submit button
- `<FormStatus>` - Shows current form status
- `<FormOverlay>` - Full-form loading overlay

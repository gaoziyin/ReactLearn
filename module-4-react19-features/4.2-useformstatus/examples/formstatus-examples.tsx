// useFormStatus Examples
// React 19 with TypeScript

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// ===========================================
// Example 1: Submit Button with Status
// ===========================================
function SubmitButton({ text = 'Submit' }: { text?: string }): React.ReactElement {
    const { pending, data, method, action } = useFormStatus();

    return (
        <button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <span className="spinner" />
                    Processing...
                </>
            ) : (
                text
            )}
        </button>
    );
}

// Usage in a form
async function handleSubmit(prevState: unknown, formData: FormData) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true };
}

export function FormWithSubmitButton(): React.ReactElement {
    const [state, formAction] = useActionState(handleSubmit, null);

    return (
        <form action={formAction}>
            <input name="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Password" />
            <SubmitButton text="Login" />
        </form>
    );
}

// ===========================================
// Example 2: Form Fields Disabled During Submit
// ===========================================
function FormField({
    name,
    type = 'text',
    placeholder,
}: {
    name: string;
    type?: string;
    placeholder?: string;
}): React.ReactElement {
    const { pending } = useFormStatus();

    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={pending}
            className={pending ? 'disabled' : ''}
        />
    );
}

export function DisabledFieldsForm(): React.ReactElement {
    const [state, formAction] = useActionState(handleSubmit, null);

    return (
        <form action={formAction} className="form">
            <FormField name="firstName" placeholder="First Name" />
            <FormField name="lastName" placeholder="Last Name" />
            <FormField name="email" type="email" placeholder="Email" />
            <FormField name="phone" type="tel" placeholder="Phone" />
            <SubmitButton text="Register" />
        </form>
    );
}

// ===========================================
// Example 3: Loading Indicator Component
// ===========================================
function FormLoadingOverlay(): React.ReactElement | null {
    const { pending } = useFormStatus();

    if (!pending) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="spinner-large" />
                <p>Please wait...</p>
            </div>
        </div>
    );
}

export function FormWithOverlay(): React.ReactElement {
    const [state, formAction] = useActionState(handleSubmit, null);

    return (
        <form action={formAction} className="form-with-overlay">
            <FormLoadingOverlay />

            <h2>Contact Us</h2>
            <input name="name" placeholder="Your Name" />
            <input name="email" type="email" placeholder="Your Email" />
            <textarea name="message" placeholder="Your Message" rows={5} />
            <SubmitButton text="Send Message" />
        </form>
    );
}

// ===========================================
// Example 4: Progress Indicator
// ===========================================
function FormProgress(): React.ReactElement {
    const { pending } = useFormStatus();

    return (
        <div className="progress-container">
            <div
                className={`progress-bar ${pending ? 'animating' : ''}`}
                style={{ width: pending ? '100%' : '0%' }}
            />
        </div>
    );
}

export function FormWithProgress(): React.ReactElement {
    const [state, formAction] = useActionState(handleSubmit, null);

    return (
        <form action={formAction}>
            <FormProgress />
            <input name="data" placeholder="Enter data" />
            <SubmitButton text="Process" />
        </form>
    );
}

// ===========================================
// Example 5: Conditional Content During Submit
// ===========================================
function FormFeedback({
    children,
    pendingContent,
}: {
    children: React.ReactNode;
    pendingContent: React.ReactNode;
}): React.ReactElement {
    const { pending } = useFormStatus();

    return <>{pending ? pendingContent : children}</>;
}

export function ConditionalForm(): React.ReactElement {
    const [state, formAction] = useActionState(handleSubmit, null);

    return (
        <form action={formAction}>
            <FormFeedback
                pendingContent={
                    <div className="pending-message">
                        <span className="spinner" />
                        <p>Uploading your file...</p>
                        <small>This may take a few moments</small>
                    </div>
                }
            >
                <div className="upload-form">
                    <input name="file" type="file" />
                    <p>Select a file to upload</p>
                </div>
            </FormFeedback>
            <SubmitButton text="Upload" />
        </form>
    );
}

// ===========================================
// Example 6: Accessing Form Data During Submit
// ===========================================
function SubmitPreview(): React.ReactElement {
    const { pending, data } = useFormStatus();

    if (!pending || !data) {
        return <div className="preview-placeholder">Preview will appear here</div>;
    }

    const email = data.get('email') as string;

    return (
        <div className="submit-preview">
            <p>Sending to: <strong>{email}</strong></p>
            <span className="spinner" /> Sending...
        </div>
    );
}

export function FormWithPreview(): React.ReactElement {
    const [state, formAction] = useActionState(handleSubmit, null);

    return (
        <form action={formAction}>
            <input name="email" type="email" placeholder="Recipient email" />
            <textarea name="message" placeholder="Message" />
            <SubmitPreview />
            <SubmitButton text="Send Email" />
        </form>
    );
}

// ===========================================
// Example 7: Multiple Submit Buttons
// ===========================================
function ActionButton({
    name,
    value,
    children,
}: {
    name: string;
    value: string;
    children: React.ReactNode;
}): React.ReactElement {
    const { pending, data } = useFormStatus();

    // Check if this specific button was clicked
    const isThisButtonPending = pending && data?.get(name) === value;

    return (
        <button
            type="submit"
            name={name}
            value={value}
            disabled={pending}
        >
            {isThisButtonPending ? 'Processing...' : children}
        </button>
    );
}

interface ActionState {
    action: string;
    success: boolean;
}

async function handleMultiAction(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    const action = formData.get('action') as string;
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { action, success: true };
}

export function MultiActionForm(): React.ReactElement {
    const [state, formAction] = useActionState(handleMultiAction, null);

    return (
        <form action={formAction}>
            <input name="item" placeholder="Item name" />

            <div className="action-buttons">
                <ActionButton name="action" value="save">
                    💾 Save Draft
                </ActionButton>
                <ActionButton name="action" value="publish">
                    🚀 Publish
                </ActionButton>
                <ActionButton name="action" value="delete">
                    🗑️ Delete
                </ActionButton>
            </div>

            {state?.success && (
                <p className="success">
                    Action "{state.action}" completed successfully!
                </p>
            )}
        </form>
    );
}

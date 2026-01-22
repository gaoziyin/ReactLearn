// Actions & useActionState Examples
// React 19 with TypeScript

import React, { useActionState } from 'react';

// ===========================================
// Example 1: Basic Form Action
// ===========================================
interface LoginState {
    message: string;
    error?: string;
}

async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email.includes('@')) {
        return { message: '', error: 'Invalid email format' };
    }

    if (password.length < 8) {
        return { message: '', error: 'Password must be at least 8 characters' };
    }

    // Simulate authentication
    return { message: `Welcome, ${email}!` };
}

export function LoginForm(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(loginAction, { message: '' });

    return (
        <form action={formAction} className="login-form">
            <h2>Login</h2>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={isPending}
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    disabled={isPending}
                />
            </div>

            {state.error && (
                <div className="error-message">{state.error}</div>
            )}

            {state.message && (
                <div className="success-message">{state.message}</div>
            )}

            <button type="submit" disabled={isPending}>
                {isPending ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

// ===========================================
// Example 2: Multi-field Validation
// ===========================================
interface RegistrationState {
    success: boolean;
    errors: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    };
}

async function registerAction(
    prevState: RegistrationState,
    formData: FormData
): Promise<RegistrationState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const errors: RegistrationState['errors'] = {};

    // Validate fields
    if (!name || name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!email.includes('@')) {
        errors.email = 'Invalid email format';
    }

    if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    return { success: true, errors: {} };
}

export function RegistrationForm(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(registerAction, {
        success: false,
        errors: {},
    });

    if (state.success) {
        return (
            <div className="success-container">
                <h2>🎉 Registration Successful!</h2>
                <p>Check your email to verify your account.</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="registration-form">
            <h2>Create Account</h2>

            <div className="form-group">
                <input name="name" placeholder="Full Name" disabled={isPending} />
                {state.errors.name && <span className="error">{state.errors.name}</span>}
            </div>

            <div className="form-group">
                <input name="email" type="email" placeholder="Email" disabled={isPending} />
                {state.errors.email && <span className="error">{state.errors.email}</span>}
            </div>

            <div className="form-group">
                <input name="password" type="password" placeholder="Password" disabled={isPending} />
                {state.errors.password && <span className="error">{state.errors.password}</span>}
            </div>

            <div className="form-group">
                <input name="confirmPassword" type="password" placeholder="Confirm Password" disabled={isPending} />
                {state.errors.confirmPassword && <span className="error">{state.errors.confirmPassword}</span>}
            </div>

            <button type="submit" disabled={isPending}>
                {isPending ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
    );
}

// ===========================================
// Example 3: Search with Actions
// ===========================================
interface SearchState {
    results: Array<{ id: string; title: string }>;
    query: string;
    total: number;
}

async function searchAction(
    prevState: SearchState,
    formData: FormData
): Promise<SearchState> {
    const query = formData.get('query') as string;

    if (!query.trim()) {
        return { results: [], query: '', total: 0 };
    }

    // Simulate API search
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock results
    const mockResults = [
        { id: '1', title: `Result for "${query}" - Item 1` },
        { id: '2', title: `Result for "${query}" - Item 2` },
        { id: '3', title: `Result for "${query}" - Item 3` },
    ];

    return {
        results: mockResults,
        query,
        total: mockResults.length,
    };
}

export function SearchForm(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(searchAction, {
        results: [],
        query: '',
        total: 0,
    });

    return (
        <div className="search-container">
            <form action={formAction}>
                <input
                    name="query"
                    placeholder="Search..."
                    defaultValue={state.query}
                />
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Searching...' : 'Search'}
                </button>
            </form>

            {state.query && (
                <p className="results-count">
                    Found {state.total} results for "{state.query}"
                </p>
            )}

            <ul className="results-list">
                {state.results.map(result => (
                    <li key={result.id}>{result.title}</li>
                ))}
            </ul>
        </div>
    );
}

// ===========================================
// Example 4: File Upload Action
// ===========================================
interface UploadState {
    uploadedFiles: Array<{ name: string; size: number; url: string }>;
    error?: string;
}

async function uploadAction(
    prevState: UploadState,
    formData: FormData
): Promise<UploadState> {
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        return { ...prevState, error: 'Please select a file' };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { ...prevState, error: 'File size must be less than 5MB' };
    }

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newFile = {
        name: file.name,
        size: file.size,
        url: `/uploads/${file.name}`,
    };

    return {
        uploadedFiles: [...prevState.uploadedFiles, newFile],
        error: undefined,
    };
}

export function FileUploadForm(): React.ReactElement {
    const [state, formAction, isPending] = useActionState(uploadAction, {
        uploadedFiles: [],
    });

    return (
        <div className="upload-container">
            <form action={formAction}>
                <input
                    name="file"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    disabled={isPending}
                />
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {state.error && <div className="error">{state.error}</div>}

            <h3>Uploaded Files</h3>
            <ul>
                {state.uploadedFiles.map((file, index) => (
                    <li key={index}>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                ))}
            </ul>
        </div>
    );
}

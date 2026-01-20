// JSX Examples (TypeScript)

import React from 'react';

// 1. Expressions in JSX
export function ExpressionDemo(): React.ReactElement {
    const name: string = "World";
    const items: number[] = [1, 2, 3];

    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>Sum: {items.reduce((a, b) => a + b, 0)}</p>
            <p>Today: {new Date().toLocaleDateString()}</p>
        </div>
    );
}

// 2. Fragment Usage
export function FragmentDemo(): React.ReactElement {
    return (
        <>
            <header>Header Content</header>
            <main>Main Content</main>
            <footer>Footer Content</footer>
        </>
    );
}

// 3. Conditional Rendering in JSX
interface UserProps {
    isLoggedIn: boolean;
    username?: string;
}

export function ConditionalDemo({ isLoggedIn, username }: UserProps): React.ReactElement {
    return (
        <div>
            {isLoggedIn ? (
                <p>Welcome back, {username}!</p>
            ) : (
                <p>Please log in</p>
            )}
        </div>
    );
}

// 4. Inline Styles
export function StyleDemo(): React.ReactElement {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px',
        backgroundColor: '#667eea',
        color: 'white',
        borderRadius: '8px'
    };

    return (
        <div style={containerStyle}>
            <span>Styled Container</span>
        </div>
    );
}

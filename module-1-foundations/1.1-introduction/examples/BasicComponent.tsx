// Basic React Component Structure (TypeScript)

import React from 'react';

// 1. Simple Function Component
function HelloWorld(): React.ReactElement {
    return <h1>Hello, World!</h1>;
}

// 2. Component with Multiple Elements
function Welcome(): React.ReactElement {
    return (
        <div>
            <h1>Welcome to React 19!</h1>
            <p>This is your first React application.</p>
        </div>
    );
}

// 3. Arrow Function Component
const Greeting: React.FC = () => {
    return <h2>Greetings from React!</h2>;
};

// 4. Component with Implicit Return
const Message: React.FC = () => <p>This is a simple message.</p>;

// Export the main component
export { HelloWorld, Welcome, Greeting, Message };
export default Welcome;

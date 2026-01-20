// Event Handling Examples (TypeScript)

import React, { useState } from 'react';

// 1. Click Event with Mouse Position
export function ClickTracker(): React.ReactElement {
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <div
            onClick={handleClick}
            style={{
                width: '300px',
                height: '200px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            Click position: ({position.x}, {position.y})
        </div>
    );
}

// 2. Form with Multiple Input Types
interface FormState {
    name: string;
    email: string;
    age: number;
    subscribe: boolean;
    plan: string;
}

export function MultiInputForm(): React.ReactElement {
    const [form, setForm] = useState<FormState>({
        name: '',
        email: '',
        age: 0,
        subscribe: false,
        plan: 'basic'
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const { name, value, type } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (event.target as HTMLInputElement).checked
                : type === 'number'
                    ? Number(value)
                    : value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log('Form submitted:', form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Name"
            />
            <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Email"
            />
            <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleInputChange}
            />
            <label>
                <input
                    name="subscribe"
                    type="checkbox"
                    checked={form.subscribe}
                    onChange={handleInputChange}
                />
                Subscribe to newsletter
            </label>
            <select name="plan" value={form.plan} onChange={handleInputChange}>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    );
}

// 3. Keyboard Shortcuts
export function KeyboardShortcuts(): React.ReactElement {
    const [message, setMessage] = useState<string>('Press a key...');

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        const shortcuts: Record<string, string> = {
            's': 'Save',
            'n': 'New',
            'd': 'Delete',
            'f': 'Find'
        };

        if (event.ctrlKey && shortcuts[event.key]) {
            event.preventDefault();
            setMessage(`Ctrl+${event.key.toUpperCase()}: ${shortcuts[event.key]}!`);
        }
    };

    return (
        <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                padding: '20px',
                border: '1px solid #ccc',
                outline: 'none'
            }}
        >
            <p>{message}</p>
            <small>Try Ctrl+S, Ctrl+N, Ctrl+D, Ctrl+F</small>
        </div>
    );
}

// 4. Mouse Events (Hover, Enter, Leave)
export function HoverCard(): React.ReactElement {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '20px',
                backgroundColor: isHovered ? '#3498db' : '#ecf0f1',
                color: isHovered ? 'white' : 'black',
                transition: 'all 0.3s ease',
                borderRadius: '8px',
                cursor: 'pointer'
            }}
        >
            {isHovered ? '🎉 Hovering!' : 'Hover over me'}
        </div>
    );
}

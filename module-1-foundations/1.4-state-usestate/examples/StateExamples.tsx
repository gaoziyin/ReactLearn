// useState Examples (TypeScript)

import React, { useState } from 'react';

// 1. Simple Counter
export function Counter(): React.ReactElement {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(prev => prev + 1)}>+</button>
            <button onClick={() => setCount(prev => prev - 1)}>-</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}

// 2. Toggle Boolean
export function Toggle(): React.ReactElement {
    const [isOn, setIsOn] = useState<boolean>(false);

    return (
        <button
            onClick={() => setIsOn(prev => !prev)}
            style={{
                backgroundColor: isOn ? '#2ecc71' : '#e74c3c',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px'
            }}
        >
            {isOn ? 'ON' : 'OFF'}
        </button>
    );
}

// 3. Object State
interface FormData {
    username: string;
    email: string;
    password: string;
}

export function RegistrationForm(): React.ReactElement {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <form>
            <input
                placeholder="Username"
                value={formData.username}
                onChange={handleChange('username')}
            />
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange('email')}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange('password')}
            />
        </form>
    );
}

// 4. Array State with CRUD
interface Task {
    id: number;
    text: string;
    done: boolean;
}

export function TaskList(): React.ReactElement {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [input, setInput] = useState<string>('');

    const addTask = (): void => {
        if (!input.trim()) return;
        setTasks(prev => [
            ...prev,
            { id: Date.now(), text: input, done: false }
        ]);
        setInput('');
    };

    const toggleTask = (id: number): void => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
    };

    const deleteTask = (id: number): void => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    return (
        <div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                        />
                        <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                            {task.text}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

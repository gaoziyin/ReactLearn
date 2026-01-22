// Forms Examples
// React 19 with TypeScript

import React, { useState, FormEvent, ChangeEvent } from 'react';

// ===========================================
// Example 1: Basic Controlled Form
// ===========================================
export function BasicLoginForm(): React.ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Login:', { email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
}

// ===========================================
// Example 2: Form with Object State
// ===========================================
interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    newsletter: boolean;
}

export function RegistrationForm(): React.ReactElement {
    const [formData, setFormData] = useState<RegistrationData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        newsletter: false,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Registration:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <input
                name="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
            />
            <label>
                <input
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={handleChange}
                />
                Subscribe to newsletter
            </label>
            <button type="submit">Register</button>
        </form>
    );
}

// ===========================================
// Example 3: Form with Validation
// ===========================================
interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export function ValidatedForm(): React.ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleBlur = (field: string): void => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(validate());
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        setTouched({ email: true, password: true, confirmPassword: true });

        if (Object.keys(validationErrors).length === 0) {
            console.log('Form submitted successfully');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={touched.email && errors.email ? 'error' : ''}
                />
                {touched.email && errors.email && (
                    <span className="error-message">{errors.email}</span>
                )}
            </div>

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={touched.password && errors.password ? 'error' : ''}
                />
                {touched.password && errors.password && (
                    <span className="error-message">{errors.password}</span>
                )}
            </div>

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                )}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}

// ===========================================
// Example 4: Select and Textarea
// ===========================================
interface FeedbackData {
    category: string;
    rating: number;
    message: string;
}

export function FeedbackForm(): React.ReactElement {
    const [feedback, setFeedback] = useState<FeedbackData>({
        category: '',
        rating: 5,
        message: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Feedback:', feedback);
    };

    return (
        <form onSubmit={handleSubmit}>
            <select
                value={feedback.category}
                onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
            >
                <option value="">Select category</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
            </select>

            <div className="rating">
                <label>Rating: {feedback.rating}</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={feedback.rating}
                    onChange={(e) => setFeedback(prev => ({ ...prev, rating: Number(e.target.value) }))}
                />
            </div>

            <textarea
                placeholder="Your message..."
                value={feedback.message}
                onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                rows={5}
            />

            <button type="submit">Send Feedback</button>
        </form>
    );
}

// ===========================================
// Example 5: Dynamic Form Fields
// ===========================================
interface Skill {
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
}

export function DynamicFieldsForm(): React.ReactElement {
    const [skills, setSkills] = useState<Skill[]>([
        { id: '1', name: '', level: 'beginner' }
    ]);

    const addSkill = (): void => {
        setSkills(prev => [
            ...prev,
            { id: Date.now().toString(), name: '', level: 'beginner' }
        ]);
    };

    const removeSkill = (id: string): void => {
        setSkills(prev => prev.filter(skill => skill.id !== id));
    };

    const updateSkill = (id: string, field: keyof Skill, value: string): void => {
        setSkills(prev => prev.map(skill =>
            skill.id === id ? { ...skill, [field]: value } : skill
        ));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Skills:', skills);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Your Skills</h3>

            {skills.map((skill, index) => (
                <div key={skill.id} className="skill-row">
                    <input
                        placeholder={`Skill ${index + 1}`}
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    />
                    <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                    </select>
                    {skills.length > 1 && (
                        <button type="button" onClick={() => removeSkill(skill.id)}>
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={addSkill}>
                + Add Skill
            </button>

            <button type="submit">Save</button>
        </form>
    );
}

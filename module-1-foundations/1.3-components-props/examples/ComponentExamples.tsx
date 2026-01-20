// Component & Props Examples (TypeScript)

import React, { ReactNode } from 'react';

// 1. Basic Props
interface GreetingProps {
    name: string;
}

export function Greeting({ name }: GreetingProps): React.ReactElement {
    return <h1>Hello, {name}!</h1>;
}

// 2. Multiple Props with Optional
interface UserBadgeProps {
    username: string;
    level: number;
    isPremium?: boolean;
}

export function UserBadge({
    username,
    level,
    isPremium = false
}: UserBadgeProps): React.ReactElement {
    return (
        <div className="badge">
            <span>{username}</span>
            <span>Level {level}</span>
            {isPremium && <span>⭐ Premium</span>}
        </div>
    );
}

// 3. Children Prop
interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export function Container({ children, className = '' }: ContainerProps): React.ReactElement {
    return (
        <div className={`container ${className}`}>
            {children}
        </div>
    );
}

// 4. Composition Pattern
interface AvatarProps {
    src: string;
    size?: 'small' | 'medium' | 'large';
}

export function Avatar({ src, size = 'medium' }: AvatarProps): React.ReactElement {
    const sizeMap = {
        small: '32px',
        medium: '48px',
        large: '64px'
    };

    return (
        <img
            src={src}
            style={{
                width: sizeMap[size],
                height: sizeMap[size],
                borderRadius: '50%'
            }}
            alt="avatar"
        />
    );
}

// 5. Complex Props Interface
interface Article {
    id: number;
    title: string;
    content: string;
    author: string;
    publishedAt: Date;
}

interface ArticleCardProps {
    article: Article;
    featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps): React.ReactElement {
    return (
        <article className={featured ? 'featured' : ''}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            <footer>
                By {article.author} on {article.publishedAt.toLocaleDateString()}
            </footer>
        </article>
    );
}

// Conditional Rendering Examples
// React 19 with TypeScript

import React from 'react';

// ===========================================
// Example 1: Ternary Operator
// ===========================================
interface UserGreetingProps {
  isLoggedIn: boolean;
  username?: string;
}

export function UserGreeting({ isLoggedIn, username }: UserGreetingProps): React.ReactElement {
  return (
    <div className="greeting">
      {isLoggedIn ? (
        <h1>Welcome back, {username}!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}

// ===========================================
// Example 2: Logical AND (&&) Operator
// ===========================================
interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps): React.ReactElement {
  return (
    <div className="notification">
      <span>Notifications</span>
      {count > 0 && (
        <span className="badge">{count}</span>
      )}
    </div>
  );
}

// ===========================================
// Example 3: Early Return Pattern
// ===========================================
interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  data: string[] | null;
}

export function LoadingState({ isLoading, error, data }: LoadingStateProps): React.ReactElement {
  // Early return for loading state
  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  // Early return for error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Early return for empty data
  if (!data || data.length === 0) {
    return <div className="empty">No data available</div>;
  }

  // Normal render
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// ===========================================
// Example 4: Switch-like Rendering
// ===========================================
type Status = 'pending' | 'approved' | 'rejected' | 'processing';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps): React.ReactElement {
  const statusConfig: Record<Status, { color: string; label: string }> = {
    pending: { color: '#ffc107', label: 'Pending' },
    approved: { color: '#28a745', label: 'Approved' },
    rejected: { color: '#dc3545', label: 'Rejected' },
    processing: { color: '#17a2b8', label: 'Processing' },
  };

  const config = statusConfig[status];

  return (
    <span 
      className="status-badge"
      style={{ backgroundColor: config.color }}
    >
      {config.label}
    </span>
  );
}

// ===========================================
// Example 5: Conditional Component
// ===========================================
interface FeatureFlagProps {
  isEnabled: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlag({ 
  isEnabled, 
  children, 
  fallback = null 
}: FeatureFlagProps): React.ReactElement | null {
  if (!isEnabled) {
    return fallback as React.ReactElement | null;
  }
  return <>{children}</>;
}

// Usage:
// <FeatureFlag isEnabled={hasNewFeature} fallback={<OldComponent />}>
//   <NewComponent />
// </FeatureFlag>

// ===========================================
// Example 6: Null/Undefined Handling
// ===========================================
interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  } | null;
}

export function UserProfile({ user }: UserProfileProps): React.ReactElement {
  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div className="user-profile">
      {/* Optional image with fallback */}
      <img 
        src={user.avatar ?? '/default-avatar.png'} 
        alt={user.name} 
      />
      
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      
      {/* Only show bio if it exists */}
      {user.bio && <p className="bio">{user.bio}</p>}
    </div>
  );
}

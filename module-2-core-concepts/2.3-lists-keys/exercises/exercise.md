# Exercise 2.3: Contact List

## Task

Create a `ContactList` component that:
1. Displays contacts with avatar, name, and email
2. Allows adding new contacts
3. Allows removing contacts
4. Shows empty state message

---

## Solution

```tsx
import React, { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

function ContactList(): React.ReactElement {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/50?u=alice' },
    { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/50?u=bob' }
  ]);
  
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');

  const handleAddContact = (): void => {
    if (!newName.trim() || !newEmail.trim()) return;
    
    const newContact: Contact = {
      id: `c${Date.now()}`,
      name: newName,
      email: newEmail,
      avatarUrl: `https://i.pravatar.cc/50?u=${newEmail}`
    };
    
    setContacts(prev => [...prev, newContact]);
    setNewName('');
    setNewEmail('');
  };

  const handleRemoveContact = (id: string): void => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '500px',
    padding: '20px',
    fontFamily: 'system-ui'
  };

  const contactStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    marginRight: '8px',
    border: '1px solid #ced4da',
    borderRadius: '4px'
  };

  return (
    <div style={containerStyle}>
      <h2>📇 Contacts ({contacts.length})</h2>
      
      {/* Add contact form */}
      <div style={{ marginBottom: '20px' }}>
        <input
          style={inputStyle}
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button 
          onClick={handleAddContact}
          style={{ padding: '8px 16px' }}
        >
          Add Contact
        </button>
      </div>
      
      {/* Contact list */}
      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
          <p>📭 No contacts yet</p>
          <small>Add your first contact above</small>
        </div>
      ) : (
        <div>
          {contacts.map(contact => (
            <div key={contact.id} style={contactStyle}>
              <img 
                src={contact.avatarUrl} 
                alt={contact.name}
                style={{ borderRadius: '50%', width: '50px', height: '50px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                <div style={{ color: '#6c757d', fontSize: '14px' }}>{contact.email}</div>
              </div>
              <button 
                onClick={() => handleRemoveContact(contact.id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactList;
```

---

## Key Concepts Demonstrated

1. **Unique keys**: Using `id` property as key
2. **Add/remove operations**: Immutable array updates
3. **Empty state**: Conditional rendering when no items
4. **Form handling**: Controlled inputs for adding contacts

---

## Bonus Challenge

Add these features:
1. Search/filter contacts by name
2. Sort contacts alphabetically
3. Edit contact details inline

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // In a real application, you would send these credentials to a server
    // for registration. For this prototype, we'll simulate it using localStorage.
    if (localStorage.getItem(username)) {
      setError('Username already exists');
      return;
    }

    localStorage.setItem(username, JSON.stringify({ username, password }));
    localStorage.setItem('currentUser', username);
    router.push('/dashboard'); // Redirect to a dashboard or scheduler page after signup
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>공부 스케줄러 회원가입</h1>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</a>
        </p>
      </div>
    </div>
  );
}

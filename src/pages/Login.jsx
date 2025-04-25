import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../components/context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();

      setUser(data.data); 
      localStorage.setItem('user', JSON.stringify(data.data)); 

      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-start justify-center pt-32 px-4">
      <div className="w-full max-w-sm">
        <a href="/">
          <img
            src="/images/Logo1.png"
            alt="Holidaze Logo"
            className="mx-auto mb-8 h-10"
          />
        </a>

        <h2 className="text-xl font-semibold text-center text-black mb-6 tracking-tight">
          Log in to your account
        </h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 border rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-light)] border-[var(--color-border)]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2.5 border rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-light)] border-[var(--color-border)]"
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-2.5 rounded-md transition tracking-wide"
          >
            Log in
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>

        <p className="text-center text-sm text-black mt-8">
          Don't have an account?{' '}
          <a href="/register" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

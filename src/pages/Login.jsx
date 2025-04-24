import React, { useState, useContext } from 'react';
import { UserContext } from '../components/context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Innlogging mislyktes');
      const data = await response.json();
      setUser(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-sm">
        <img
          src="/images/Logo1.png"
          alt="Holidaze Logo"
          className="mx-auto mb-8 h-12"
        />

        <h2 className="text-2xl font-semibold text-center text-black mb-8">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-4 border rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-light)] border-[var(--color-border)]"
          />
         <input
             type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-4 border rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-btn-light)] border-[var(--color-border)]"
         />
          <button
            type="submit"
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold py-3 rounded-md transition tracking-wide"
          >
            Login
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>

        <p className="text-center text-sm text-black mt-10">
          Dont have an account?{' '}
          <a href="/signup" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

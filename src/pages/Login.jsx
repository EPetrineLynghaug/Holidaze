// src/components/Login.jsx
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

    const payload = { email, password };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(`${baseUrl}/auth/login`, options);
      if (!response.ok) {
        throw new Error('Innlogging mislyktes');
      }
      const responseData = await response.json();
      setUser(responseData.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 pt-10">
      <img
        src="/images/Logo1.png"
        alt="Holidaze Logo"
        className="h-20 mb-6"
      />
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl px-6 py-8">
        <h2 className="text-2xl font-semibold text-center text-black mb-8">Login</h2>

        <form onSubmit={handleLogin} className="w-full">
          {/* Email */}
          <label className="block mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded-md px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          {/* Password */}
          <label className="block mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded-md px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <button
            type="submit"
            className="block w-full bg-[#6C63FF] hover:bg-indigo-600 text-white font-semibold py-3 rounded-md shadow-sm transition"
          >
            Login
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </form>

        <p className="text-center text-sm text-black mt-10">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#6C63FF] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

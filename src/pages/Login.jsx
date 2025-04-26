import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../components/context/UserContext';
import Logo from '../components/ui/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo className="mx-auto mb-0  h-24 text-5xl" />
        <h2 className="text-base font-medium text-black tracking-tight">Log in to your account</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
           
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`material-symbols-outlined icon-gray text-xs ml-2 focus:outline-none transition-colors ${showPassword ? 'text-black' : 'text-gray-400'}`}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-3 rounded-md transition tracking-wide"
          >
            Log in
          </button>

          {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
        </form>

        <p className="text-center text-xs text-black mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

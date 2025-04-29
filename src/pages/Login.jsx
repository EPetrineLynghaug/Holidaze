// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Logo from '../components/ui/Logo';
import { login as loginService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Henter profil + token, lagrer alt i authService
      await loginService({ email, password, remember: true });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Innlogging mislyktes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo className="mx-auto h-24 text-5xl" />
        <h2 className="text-base font-medium text-black tracking-tight">
          Logg inn på din konto
        </h2>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* E-post */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined text-xs mr-2">email</span>
            <input
              type="email"
              placeholder="E-post"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Passord */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)] relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Passord"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="material-symbols-outlined text-xs ml-2 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Skjul passord' : 'Vis passord'}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            )}
          </div>

          {/* Innlogging */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-3 rounded-md transition tracking-wide disabled:opacity-50"
          >
            {isLoading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </form>

        <p className="text-center text-xs text-black mt-6">
          Har du ikke konto?{' '}
          <Link to="/register" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Registrer deg
          </Link>
        </p>
      </div>
    </div>
  );
}

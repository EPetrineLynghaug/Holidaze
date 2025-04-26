 import React, { useState } from 'react';
import Logo from '../components/ui/Logo'
import { useNavigate } from 'react-router';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSelectType = (type) => {
    setForm({ ...form, venueManager: type === 'host' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Registration failed');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-center justify-center px-4">
     <div className="w-full max-w-sm space-y-6 text-center ">
        {/* Logo */}
        <Logo className="mx-auto mb-0 h-24 text-5xl" />
        <h2 className="text-center text-base font-medium text-black mb-6 tracking-tight">Register</h2>

        {/* Account type selection */}
        <div className="text-xs text-center text-gray-700 mb-8 bg-white/75 backdrop-filter backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#D1D1D1] shadow-lg">
          What type of account would you like to create?
        </div>

        <div className="flex gap-4 mb-8">
          {/* Traveler */}
          <button
            type="button"
            onClick={() => handleSelectType('traveler')}
            className="flex-1 rounded-xl overflow-hidden transition shadow-lg"
          >
            <div className="relative h-36">
              <img src="/images/traveler.png" alt="Traveler" className="w-full h-full object-cover" />
              <span
                className={`material-symbols-outlined icon-gray text-xs absolute -bottom-4 left-1/2 -translate-x-1/2
                  shadow p-1 rounded-full bg-white transition-colors duration-300 ease-in-out
                  ${!form.venueManager ? 'filled' : ''}`}
              >
                person
              </span>
            </div>
            <div className="text-center pt-6 pb-3 text-xs font-medium text-black">Become a Traveler</div>
          </button>

          {/* Host */}
          <button
            type="button"
            onClick={() => handleSelectType('host')}
            className="flex-1 rounded-xl overflow-hidden transition shadow-lg"
          >
            <div className="relative h-36">
              <img src="/images/hosting-key.png" alt="Host" className="w-full h-full object-cover" />
              <span
                className={`material-symbols-outlined icon-gray text-xs absolute -bottom-4 left-1/2 -translate-x-1/2
                  shadow p-1 rounded-full bg-white transition-colors duration-300 ease-in-out
                  ${form.venueManager ? 'filled' : ''}`}
              >
                family_home
              </span>
            </div>
            <div className="text-center pt-6 pb-3 text-xs font-medium text-black">Start Hosting</div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">person</span>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">email</span>
            <input
              type="email"
              name="email"
              placeholder="eksempel@stud.noroff.no"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center justify-between border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`material-symbols-outlined text-xs ml-2 focus:outline-none transition-colors ${form.password ? 'text-[#5C50FF]' : 'text-gray-400'}`}
            >
              {showPassword ? 'visibility_off' : 'visibility'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-3 rounded-md transition tracking-wide mt-2"
          >
            Create Account
          </button>

          {error && <p className="text-red-500 text-xs text-center mt-1">{error}</p>}
        </form>

        <p className="text-center text-xs text-black mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  });

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
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-start justify-center px-4 pt-20">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <a href="/">
          <img src="/images/Logo1.png" alt="Holidaze Logo" className="mx-auto h-10 mb-1" />
        </a>
        <h2 className="text-center text-lg font-medium text-black mb-6 tracking-tight">Register</h2>

        {/* Account type selection */}
        <p className="text-sm text-center text-black mb-4 bg-gray-100 py-2 rounded-md">
          What type of account would you like to create?
        </p>

        <div className="flex gap-4 mb-8">
          {/* Traveler */}
          <button
            type="button"
            onClick={() => handleSelectType('traveler')}
            className="flex-1 rounded-2xl overflow-hidden transition shadow-xl"
          >
            <div className="relative h-40">
              <img src="/images/traveler.png" alt="Traveler" className="w-full h-full object-cover" />
              <span
                className={`material-symbols-outlined text-4xl absolute -bottom-5 left-1/2 -translate-x-1/2 shadow-md p-2 rounded-full bg-white transition-colors duration-300 ease-in-out ${
                  !form.venueManager ? 'filled text-[var(--color-btn-light)]' : 'text-gray-600'
                }`}
              >
                person
              </span>
            </div>
            <div className="text-center pt-6 pb-3 text-sm font-medium text-black">Become a traveler</div>
          </button>

          {/* Host */}
          <button
            type="button"
            onClick={() => handleSelectType('host')}
            className="flex-1 rounded-2xl overflow-hidden transition shadow-xl"
          >
            <div className="relative h-40">
              <img src="/images/hosting-key.png" alt="Host" className="w-full h-full object-cover" />
              <span
                className={`material-symbols-outlined text-4xl absolute -bottom-5 left-1/2 -translate-x-1/2 shadow-md p-2 rounded-full bg-white transition-colors duration-300 ease-in-out ${
                  form.venueManager ? 'filled text-[var(--color-btn-light)]' : 'text-gray-600'
                }`}
              >
                family_home
              </span>
            </div>
            <div className="text-center pt-6 pb-3 text-sm font-medium text-black">Start Hosting</div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center border rounded-md px-3 py-2.5 border-[var(--color-border)] focus-within:ring-2 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined text-gray-400 text-base mr-2">edit</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center border rounded-md px-3 py-2.5 border-[var(--color-border)] focus-within:ring-2 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined text-gray-400 text-base mr-2">mail</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center border rounded-md px-3 py-2.5 border-[var(--color-border)] focus-within:ring-2 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined text-gray-400 text-base mr-2">lock</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-2.5 rounded-md transition tracking-wide"
          >
            Create account
          </button>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>

        <p className="text-center text-sm text-black mt-8">
          Already have an account?{' '}
          <a href="/login" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

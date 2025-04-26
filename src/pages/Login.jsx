// src/pages/Login.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useForm from '../hooks/useForm';
import { useAuthApi } from '../hooks/useApi';
import { UserContext } from '../components/context/UserContext';
import Logo from '../components/ui/Logo';

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { login, loading: apiLoading, error: apiError } = useAuthApi();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
  } = useForm({ email: '', password: '' }, loginCallback);

  async function loginCallback({ email, password }) {
    try {
      const data = await login({ email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      const field = err.field || 'password';
      setErrors(prev => ({ ...prev, [field]: err.message }));
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo className="mx-auto h-24 text-5xl" />
        <h2 className="text-base font-medium text-black tracking-tight">
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">
              email
            </span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>
          {touched.email && errors.email && (
            <p id="email-error" className="text-red-500 text-xs text-left">
              {errors.email}
            </p>
          )}

          {/* Password Field */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            {values.password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`material-symbols-outlined icon-gray text-xs ml-2 focus:outline-none transition-colors ${
                  showPassword ? 'text-black' : 'text-gray-400'
                }`}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            )}
          </div>
          {touched.password && errors.password && (
            <p id="password-error" className="text-red-500 text-xs text-left">
              {errors.password}
            </p>
          )}

          {/* General API error */}
          {apiError && !errors.general && (
            <p className="text-red-500 text-xs text-center">{apiError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || apiLoading}
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-3 rounded-md transition tracking-wide disabled:opacity-50"
          >
            {isSubmitting || apiLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-xs text-black mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[var(--color-btn-light)] hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
